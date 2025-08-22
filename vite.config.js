
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Vitr-ne-que-vende/',  // tem que ser exatamente igual ao nome do repositório no GitHub
})
