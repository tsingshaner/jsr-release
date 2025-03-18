import { runMain } from 'citty'
import consola from 'consola'

import packageJSON from '../package.json' with { type: 'json' }
import { isGitClean } from './core'

void runMain({
  args: {
    allowDirty: {
      default: false,
      description: 'allow dirty git repository.',
      type: 'boolean'
    },
    root: {
      default: process.cwd(),
      description: 'directory to run the command in',
      type: 'string'
    }
  },
  meta: {
    description: packageJSON.description,
    name: Object.keys(packageJSON.bin)[0],
    version: packageJSON.version
  },
  async setup(context) {
    if (!(context.args.allowDirty || (await isGitClean(context.args.root)))) {
      consola.fatal('Git working directory is not clean, process aborted.')
      consola.info('You can use --allowDirty to ignore this error.')
      process.exit(1)
    }

    context.data = {
      root: context.args.root
    }
  },

  subCommands: {
    publish: async () => (await import('./commands/publish')).default,
    version: async () => (await import('./commands/version')).default
  }
})
