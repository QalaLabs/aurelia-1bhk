import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Connect, Plugin } from 'vite'

const require = createRequire(import.meta.url)

type Job = {
  dir: string
  fps: number
  audio: boolean
  ffmpeg: string
}

const HINT = [
  'System FFmpeg was not found on PATH.',
  'Install it with: winget install Gyan.FFmpeg',
  'Windows builds: https://www.gyan.dev/ffmpeg/builds/',
].join(' ')

function send(res: ServerResponse, status: number, body: string, type = 'text/plain; charset=utf-8') {
  res.statusCode = status
  res.setHeader('content-type', type)
  res.end(body)
}

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

function commandOk(command: string) {
  return new Promise<boolean>((resolve) => {
    const child = spawn(command, ['-version'], { windowsHide: true })
    child.on('error', () => resolve(false))
    child.on('exit', (code) => resolve(code === 0))
  })
}

async function resolveFfmpeg() {
  if (await commandOk('ffmpeg')) return { path: 'ffmpeg', source: 'system' as const }
  try {
    const bundled = require('ffmpeg-static') as string | null
    if (bundled) {
      await access(bundled)
      return { path: bundled, source: 'bundled' as const }
    }
  } catch {
    /* The optional binary is not on disk. */
  }
  return { path: '', source: 'none' as const }
}

function run(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, windowsHide: true })
    let errorText = ''
    child.stderr.on('data', (chunk: Buffer) => {
      errorText = (errorText + chunk.toString()).slice(-4000)
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(errorText || `FFmpeg exited with code ${code}`))
    })
  })
}

export function renderApi(): Plugin {
  const jobs = new Map<string, Job>()
  const attach = (middlewares: Connect.Server) => {
    middlewares.use((req, res, next) => {
      const path = (req.url ?? '').split('?')[0]
      if (!path.startsWith('/api/render')) {
        next()
        return
      }
      void (async () => {
      const url = new URL(req.url ?? '/', 'http://localhost')
      try {
        if (req.method === 'GET' && url.pathname === '/api/render/capabilities') {
          const found = await resolveFfmpeg()
          const hint =
            found.source === 'system'
              ? 'System FFmpeg is available.'
              : found.source === 'bundled'
                ? `${HINT} This project also ships a bundled FFmpeg binary, and renders will use that.`
                : `${HINT} The browser H.264 encoder will be used instead.`
          send(
            res,
            200,
            JSON.stringify({ ffmpeg: found.source !== 'none', source: found.source, hint }),
            'application/json',
          )
          return
        }

        if (req.method === 'POST' && url.pathname === '/api/render/start') {
          const found = await resolveFfmpeg()
          if (!found.path) {
            send(res, 409, HINT)
            return
          }
          const body = JSON.parse((await readBody(req)).toString('utf8')) as {
            fps?: number
            audio?: boolean
          }
          const id = randomUUID()
          const dir = await mkdtemp(join(tmpdir(), 'aurelia-'))
          jobs.set(id, {
            dir,
            fps: body.fps ?? 30,
            audio: Boolean(body.audio),
            ffmpeg: found.path,
          })
          send(res, 200, JSON.stringify({ id }), 'application/json')
          return
        }

        const id = url.searchParams.get('id') ?? ''
        const job = jobs.get(id)
        if (!job) {
          send(res, 404, 'Render job not found')
          return
        }

        if (req.method === 'POST' && url.pathname === '/api/render/frame') {
          const index = Number(url.searchParams.get('index') ?? '0')
          const name = `frame_${String(index).padStart(5, '0')}.jpg`
          await writeFile(join(job.dir, name), await readBody(req))
          send(res, 204, '')
          return
        }

        if (req.method === 'POST' && url.pathname === '/api/render/audio') {
          await writeFile(join(job.dir, 'audio.wav'), await readBody(req))
          send(res, 204, '')
          return
        }

        if (req.method === 'POST' && url.pathname === '/api/render/cancel') {
          jobs.delete(id)
          await rm(job.dir, { recursive: true, force: true })
          send(res, 204, '')
          return
        }

        if (req.method === 'POST' && url.pathname === '/api/render/finish') {
          const args = ['-y', '-framerate', String(job.fps), '-start_number', '0', '-i', 'frame_%05d.jpg']
          if (job.audio) args.push('-i', 'audio.wav')
          args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'veryfast')
          if (job.audio) args.push('-c:a', 'aac', '-b:a', '160k', '-shortest')
          args.push('-movflags', '+faststart', 'out.mp4')
          await run(job.ffmpeg, args, job.dir)
          send(res, 200, JSON.stringify({ ok: true }), 'application/json')
          return
        }

        if (req.method === 'GET' && url.pathname === '/api/render/file') {
          const file = await readFile(join(job.dir, 'out.mp4'))
          res.statusCode = 200
          res.setHeader('content-type', 'video/mp4')
          res.end(file)
          return
        }

        send(res, 404, 'Unknown render route')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Render server error'
        if (!res.headersSent) send(res, 500, message)
      }
      })()
    })
  }

  return {
    name: 'aurelia-render',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}
