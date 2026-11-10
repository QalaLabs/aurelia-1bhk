import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import { renderApi } from './vite/renderPlugin.ts'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), mode === 'vr' ? basicSsl() : null, renderApi()],
}))
