import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: 'https://elementsoneastcoast.com',
        changeOrigin: true,
      },
      "/uploads": {
        target: 'https://elementsoneastcoast.com',
        changeOrigin: true,
      },
    },
  },
})