import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import portfolioData from './plugins/portfolio-data.js'
import { execSync } from 'node:child_process'

function safeExec(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}

// Scoped to this directory (`-- .`) since the portfolio may live inside a
// larger monorepo — an unscoped SHA would reflect unrelated commits.
const commitSha = safeExec('git log -1 --format=%h -- .')
const isDirty = commitSha ? safeExec('git status --porcelain -- .').length > 0 : false

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), portfolioData()],
  define: {
    __COMMIT_SHA__: JSON.stringify(commitSha || null),
    __COMMIT_DIRTY__: JSON.stringify(isDirty),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
