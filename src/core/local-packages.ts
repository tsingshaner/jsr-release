import { findPackages } from '@pnpm/fs.find-packages'
import { findWorkspacePackagesNoCheck, type Project } from '@pnpm/workspace.find-packages'
import { readWorkspaceManifest, type WorkspaceManifest } from '@pnpm/workspace.read-manifest'

import type { ExpectedPackageManager } from './utils'

/**
 * Get local packages func option.
 *
 * @public
 */
export interface GetLocalPackagesOptions {
  /**
   * The package manager.
   */
  packageManager: ExpectedPackageManager
  /**
   * An optional array of patterns to filter the packages.
   */
  patterns?: string[]
  /**
   * Project root directory.
   */
  root: string
}
export interface ProjectManifests {
  packages: Project[]
  pnpmWorkspaceManifest?: WorkspaceManifest
}

/**
 * Get local packages.
 * @param opts - The packages search options.
 *
 * @public
 */
export const getLocalPackages = async (opts: GetLocalPackagesOptions): Promise<ProjectManifests> => {
  if (opts.packageManager === 'pnpm') {
    const pnpmWorkspaceManifest = await readWorkspaceManifest(opts.root)
    if (pnpmWorkspaceManifest !== undefined) {
      return {
        packages: await findWorkspacePackagesNoCheck(opts.root, { patterns: pnpmWorkspaceManifest.packages }),
        pnpmWorkspaceManifest
      }
    }
  }

  return {
    packages: await findPackages(opts.root, {
      patterns: opts.patterns
    })
  }
}
