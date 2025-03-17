import { defineCommand } from 'citty'
import consola from 'consola'

import { type ProjectManifests, syncLocalJSRVersions } from '..'
import { packagesSetup, sharedArgs } from './setup'

export default defineCommand({
  args: {
    list: {
      alias: 'l',
      description: 'List all packages.',
      required: false,
      type: 'boolean'
    },

    sync: {
      alias: 's',
      description: 'Sync the jsr.json version from package.json file.',
      required: false,
      type: 'boolean'
    },
    ...sharedArgs
  },
  meta: {
    description: 'Displays the current version of the application.',
    name: 'packages'
  },

  setup: packagesSetup,

  async run(ctx) {
    const { packages } = ctx.data as ProjectManifests

    if (ctx.args.sync) {
      return await syncLocalJSRVersions(packages)
    }

    for (const project of packages) {
      consola.info(`${project.rootDirRealPath} ${project.manifest.name} > version: ${project.manifest.version}`)
    }
  }
})
