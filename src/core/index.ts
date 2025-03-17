export { getLocalPackages, type GetLocalPackagesOptions, type ProjectManifests } from './local-packages'
export { mergeProjectManifest } from './pnpm-version-protocol'
export { syncLocalJSRVersions } from './sync-version'
export { detectPackageManager, type ExpectedPackageManager, isExpectedPackageManger, isGitClean } from './utils'
