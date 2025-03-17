import { promisifyExec } from '@qingshaner/utility-server'
import consola from 'consola'
import { detect } from 'package-manager-detector/detect'

export type ExpectedPackageManager = 'npm' | 'pnpm'

/**
 * Check if the provided package manager name is expected.
 * @param pm - package manager name.
 *
 * @internal
 */
export const isExpectedPackageManger = (pm: string): pm is ExpectedPackageManager => ['npm', 'pnpm'].includes(pm)

/**
 * Detect expected packageMangers.
 *
 * @internal
 */
export const detectPackageManager = async (): Promise<ExpectedPackageManager> => {
  const res = await detect()
  if (res === null || !isExpectedPackageManger(res.name)) {
    consola.warn("can't detect support package manager, fallback to 'npm'")
    return 'npm'
  }

  return res.name
}

/**
 * Check if the git working directory is clean.
 * @returns True if there are no changes, otherwise false.
 *
 * @public
 */
export const isGitClean = async (root?: string | URL): Promise<boolean> => {
  const { stderr, stdout } = await promisifyExec('git status --porcelain', {
    cwd: root
  })
  if (stderr.trim().length > 0) {
    consola.error('Failed to check git status:')
    consola.error(stderr)
    return false
  }

  return stdout.trim().length === 0
}
