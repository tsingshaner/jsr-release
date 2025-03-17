import { mergeObject } from '@qingshaner/utility-shared'
import consola from 'consola'
import * as v from 'valibot'

import type { ArgsDef, CommandContext } from 'citty'

import { detectPackageManager, type ExpectedPackageManager, getLocalPackages, isExpectedPackageManger } from '..'

export const sharedArgs = {
  packageManager: {
    description: 'The package manager to use.',
    required: false,
    type: 'string'
  },
  pattern: {
    default: '.',
    description: 'The pattern to match the package names.',
    required: false,
    type: 'string'
  },
  root: {
    alias: 'd',
    default: '.',
    description: 'The directory of the project root.',
    required: false,
    type: 'string'
  }
} as const satisfies ArgsDef

const ArgsSchema = v.looseObjectAsync({
  packageManager: v.fallbackAsync(v.pipe(v.string(), v.check(isExpectedPackageManger)), detectPackageManager),
  pattern: v.string(),
  root: v.string()
})

export type ArgsOutput = v.InferOutput<typeof ArgsSchema>

/**
 * Inject project packages to ctx.data.
 * @param ctx - CommandContext.
 *
 * @internal
 */
export const packagesSetup = async <T extends ArgsDef>(ctx: CommandContext<T>) => {
  const res = await v.safeParseAsync(ArgsSchema, ctx.args)
  if (res.success) {
    mergeObject(ctx.args, res.output)

    const { packageManager, pattern, root } = res.output

    const manifest = await getLocalPackages({
      packageManager: packageManager as ExpectedPackageManager,
      patterns: pattern.split(',').map((s) => s.trim()),
      root
    })

    if (manifest.packages.length === 0) {
      consola.info('No packages found, exiting.')
      process.exit(0)
    }

    if (manifest.pnpmWorkspaceManifest !== undefined) {
      consola.info('Pnpm workspace manifest resolved.')
    }

    ctx.data = manifest
  }
}
