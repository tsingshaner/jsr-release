# JSR Release

<p align="center">
<a href="https://www.npmjs.com/@qingshaner/jsr-release" target="_blank"><img src="https://img.shields.io/npm/v/jsr-release" alt="NPM Version" /></a>
<img alt="LICENSE" src="https://img.shields.io/github/license/tsingshaner/typescript-lib">
<a href="https://github.com/tsingshaner/jsr-release/actions/workflows/ci.yml"><img src="https://github.com/tsingshaner/jsr-release/actions/workflows/ci.yml/badge.svg" alt="ci" /></a>
<a href="https://biomejs.dev"><img alt="Linted with Biome" src="https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome"></a>
<a href="https://biomejs.dev" target="_blank"><img alt="Static Badge" src="https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome"></a>
</p>

A CLI utility to release your project with ease.

## 🔨 CLI Usage

```bash
npx @qingshaner/jsr-release version --sync # sync version in package.json and jsr.json
npx @qingshaner/jsr-release publish # publish to jsr.io support pnpm workspaces
```

## 🚀 With Changeset Action

`.github/workflows/release.yml`
```yaml
# ...

jobs:
  release:
    # ...
    - steps:
      # ...
      - name: Create Release Pull Request
        id: changesets
        uses: changesets/action@v1
        with:
        commit: 'chore(release): update release & CHANGELOG.md'
        title: '📦 Update Packages Version'
        publish: pnpm changeset-publish
        version: pnpm changeset-version

```

`package.json`
```jsonc
{
  "scripts": {
    "changeset-version": "changeset version && pnpx @qingshaner/jsr-release --allowDirty version --sync",
    "changeset-publish": "changeset publish && pnpx @qingshaner/jsr-release publish"
  }
}

```

## 📄 License
ISC License © 2023-Present qingshaner

