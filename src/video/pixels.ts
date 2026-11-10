export function stampFade(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  opacity: number,
) {
  if (opacity <= 0.001) return
  context.fillStyle = `rgba(8, 7, 6, ${opacity})`
  context.fillRect(0, 0, width, height)
}

export function canvasToJpeg(canvas: HTMLCanvasElement, quality = 0.92) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not encode a JPEG frame'))
    }, 'image/jpeg', quality)
  })
}

export function pixelsToJpeg(pixels: Uint8Array, width: number, height: number, fade: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2D canvas is not available')
  const image = context.createImageData(width, height)
  const row = width * 4
  for (let y = 0; y < height; y += 1) {
    const source = (height - 1 - y) * row
    image.data.set(pixels.subarray(source, source + row), y * row)
  }
  context.putImageData(image, 0, 0)
  stampFade(context, width, height, fade)
  return canvasToJpeg(canvas)
}

export async function copyDrawingBuffer(source: HTMLCanvasElement, fade: number) {
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('2D canvas is not available')
  context.drawImage(source, 0, 0)
  stampFade(context, canvas.width, canvas.height, fade)
  return canvasToJpeg(canvas)
}
