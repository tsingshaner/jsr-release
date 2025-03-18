import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { defineCommand } from 'citty'
import { getOrDownloadBinPath, publish } from 'jsr'

import type { AnyFunc } from '@qingshaner/utility-shared'

import { mergeProjectManifest, type ProjectManifests } from '..'
import { packagesSetup, sharedArgs } from './setup'

export default defineCommand({
  args: {
    changesetReleases: {
      description: 'Expect a changeset release output.',
      required: false
    },
    ...sharedArgs
  },
  meta: {
    description: 'Publish the JSR package to the registry.',
    name: 'publish'
  },

  setup: packagesSetup,

  async run(ctx) {
    // init deno bin path
    const canary = process.env.DENO_BIN_CANARY !== undefined
    const binFolder = join(import.meta.dirname, '..', '.download')
    void (await getOrDownloadBinPath(binFolder, canary))

    const { packages, pnpmWorkspaceManifest } = ctx.data as ProjectManifests
    const catalogs = pnpmWorkspaceManifest?.catalogs ?? {}
    const changesetReleases = JSON.parse((ctx.args.changesetReleases as string) ?? '[]') as Record<'name', string>[]
    // cleanup functions
    ctx.data = [] as AnyFunc[]

    await Promise.all(
      packages.map(async (project) => {
        if (changesetReleases.length > 0 && !changesetReleases.some((r) => r.name === project.manifest.name)) {
          return
        }

        const packageJSONPath = join(project.rootDirRealPath, 'package.json')

        if (pnpmWorkspaceManifest !== undefined) {
          const originalManifest = await readFile(packageJSONPath, { encoding: 'utf-8' })
          ;(ctx.data as AnyFunc[]).push(() => writeFile(packageJSONPath, originalManifest))

          await project.writeProjectManifest(await mergeProjectManifest(project, catalogs), true)
        }

        await publish(project.rootDirRealPath, {
          binFolder,
          canary,
          pkgJsonPath: packageJSONPath,
          publishArgs: ['--allow-dirty', ...ctx.args._]
        })
      })
    )
  },

  async cleanup(ctx) {
    await Promise.all((ctx.data as AnyFunc[]).map(async (f) => void (await f())))
  }
})
