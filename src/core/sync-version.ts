import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { safeStat } from '@qingshaner/utility-server'
import consola from 'consola'

import type { Project } from '@pnpm/workspace.find-packages'

/**
 * Write the new version to the jsr.json file.
 * @param dir - The package directory.
 * @param version - The new version string.
 */
const writeJSRVersion = async (dir: string, version: string): Promise<boolean> => {
  const jsrConfigPath = resolve(dir, 'jsr.json')

  const [stat, success] = await safeStat(jsrConfigPath)
  if (!(success && stat.isFile())) {
    consola.fatal(`${dir} > jsr.json file not access.`)
    return false
  }

  const jsrContent = (await readFile(jsrConfigPath, { encoding: 'utf-8' })).replace(
    /"version": ".*"/,
    `"version": "${version}"`
  )

  await writeFile(jsrConfigPath, jsrContent)

  return true
}

/**
 * Synchronizes the local JSR versions with the package manifests.
 * @param pkgs - An array of package manifests to sync.
 * @returns A promise that resolves when all versions are synchronized.
 *
 * @public
 */
export const syncLocalJSRVersions = async (pkgs: Project[]): Promise<void> => {
  await Promise.allSettled(
    pkgs.map(async (pkg) => {
      if (pkg.manifest.version === undefined) {
        consola.warn(`${pkg.rootDir} ${pkg.manifest.name} > version field not found.`)
        return
      }

      consola.info(`Syncing ${pkg.rootDir} ${pkg.manifest.name} version: ${pkg.manifest.version} --> jsr.json.`)
      await writeJSRVersion(pkg.rootDir, pkg.manifest.version)
    })
  )

  return
}
