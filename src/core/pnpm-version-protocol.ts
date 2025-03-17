import { createExportableManifest, type MakePublishManifestOptions } from '@pnpm/exportable-manifest'
import { mergeObject } from '@qingshaner/utility-shared'

import type { Project } from '@pnpm/workspace.find-packages'

/**
 * Merge the project manifest with the exportable manifest.
 * @param pkg - The package manifest.
 * @param catalogs - The catalogs to use for the exportable manifest.
 * @returns The merged manifest.
 */
export const mergeProjectManifest = async (
  pkg: Project,
  catalogs: MakePublishManifestOptions['catalogs']
): Promise<Project['manifest']> => {
  const exportableManifest = await createExportableManifest(pkg.rootDirRealPath, pkg.manifest, { catalogs })

  return mergeObject(pkg.manifest, exportableManifest, {
    arrayMergeStrategy: 'replace'
  })
}
