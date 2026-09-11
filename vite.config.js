import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
    host: true,
    allowedHosts: [
      'basescrib-project-front.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  preview: {
    port: process.env.PORT || 3000,
    host: true,
    allowedHosts: [
      'basescrib-project-front.onrender.com',
      'ale-n7o2.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
})