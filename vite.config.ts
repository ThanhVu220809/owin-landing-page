import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig(() => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
  resolve: {
    // fileURLToPath chứ không phải `new URL(...).pathname`: trên Windows
    // pathname trả về `/D:/...` với dấu gạch thừa ở đầu.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
}))
