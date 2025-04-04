import { resolve } from 'node:path'

import { presetESLintConfig } from '@qingshaner/eslint-config'

const ROOT = import.meta.dirname

export default presetESLintConfig({
  biome: true,
  cspell: { configFile: resolve(ROOT, 'cspell.yaml') },
  ignores: [resolve(ROOT, '.gitignore'), ['pnpm-lock.yaml']],
  jsonc: true,
  perfectionist: true,
  typescript: [ROOT]
})
