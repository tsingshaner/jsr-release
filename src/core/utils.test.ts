import { describe } from 'vitest'

import { detectPackageManager } from './utils'

describe('test utils', (test) => {
  test('test detect package manager', async ({ expect }) => {
    expect(await detectPackageManager()).toBe('pnpm')
  })
})
