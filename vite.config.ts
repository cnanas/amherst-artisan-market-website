import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function stripVersionSuffix() {
  const semverRe = /^[0-9]+(?:\.[0-9]+){1,2}(?:[-a-zA-Z0-9.]+)?$/
  return {
    name: 'strip-version-suffix',
    async resolveId(source: string, importer: string | undefined, options: any) {
      if (!source) return null
      if (source.startsWith('.') || source.startsWith('/') || source.startsWith('http')) return null

      let base = source
      if (source.startsWith('@')) {
        const lastAt = source.lastIndexOf('@')
        if (lastAt > 0) {
          const ver = source.slice(lastAt + 1)
          if (semverRe.test(ver)) base = source.slice(0, lastAt)
        }
      } else {
        const parts = source.split('@')
        if (parts.length === 2 && semverRe.test(parts[1])) base = parts[0]
      }

      if (base !== source) {
        return (this as any).resolve(base, importer, { skipSelf: true, ...options })
      }
      return null
    },
  }
}

export default defineConfig(() => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/').pop()
  return {
    plugins: [react(), stripVersionSuffix()],
    base: process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : '/',
    server: { port: 5173, open: true },
    build: { outDir: 'dist' },
  }
})
