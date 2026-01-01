# Publishing Guide for @b3008/pulse-cli-core

This document outlines how to publish the package to npm under your `@b3008` scope.

## Prerequisites

1. **npm Account**: Ensure you have an npm account
2. **npm Login**: Log in to npm on your machine:
   ```bash
   npm login
   ```

3. **Scope Access**: Verify you have access to the `@b3008` scope:
   ```bash
   npm whoami
   ```

## Pre-Publication Checklist

- [ ] All tests pass: `npm test` (135 tests passing ✅)
- [ ] Package builds successfully: `npm run build`
- [ ] Version number updated in `package.json`
- [ ] CHANGELOG updated (if applicable)
- [ ] README is accurate and complete

## Publishing Steps

### 1. Verify Package Contents

See what will be published:

```bash
npm pack --dry-run
```

This should include:
- `dist/` directory with built files
- `README.md`
- `package.json`
- `LICENSE` (if you have one)

### 2. Build the Package

The `prepublishOnly` script will automatically run tests and build:

```bash
npm run build
```

Or let it run automatically during publish.

### 3. Publish to npm

For a scoped package, you need to specify public access:

```bash
npm publish --access public
```

The package will be published as: **@b3008/pulse-cli-core**

### 4. Verify Publication

Check that it's published:

```bash
npm view @b3008/pulse-cli-core
```

Or visit: https://www.npmjs.com/package/@b3008/pulse-cli-core

## Version Management

### Patch Release (bug fixes)
```bash
npm version patch
npm publish --access public
```

### Minor Release (new features, backward compatible)
```bash
npm version minor
npm publish --access public
```

### Major Release (breaking changes)
```bash
npm version major
npm publish --access public
```

The `npm version` command will:
1. Update version in package.json
2. Create a git commit
3. Create a git tag

## Using the Published Package

### In a React Project

```bash
npm install @b3008/pulse-cli-core
```

```tsx
import '@b3008/pulse-cli-core';

function App() {
  return <pulse-terminal prompt="$" />;
}
```

### In a Vue Project

```bash
npm install @b3008/pulse-cli-core
```

```vue
<script setup>
import '@b3008/pulse-cli-core';
</script>

<template>
  <pulse-terminal prompt=">" />
</template>
```

### Headless Usage

```typescript
import { CommandRegistry } from '@b3008/pulse-cli-core';

const registry = new CommandRegistry();
// Use the registry without any UI
```

## Local Testing Before Publishing

### Option 1: npm link

In the pulse-core directory:
```bash
npm link
```

In your test project:
```bash
npm link @b3008/pulse-cli-core
```

### Option 2: Local Path

In your test project's package.json:
```json
{
  "dependencies": {
    "@b3008/pulse-cli-core": "file:../pulseCLI/projects/pulse-core"
  }
}
```

## Troubleshooting

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- Verify scope ownership: You must own the `@b3008` scope

### "Package name too similar to existing package"
- The `@b3008` scope prevents naming conflicts
- As long as you own the scope, you can publish

### Build Errors
```bash
npm run test     # Ensure tests pass
npm run build    # Check for build errors
```

## Package Statistics

- **Size**: ~56KB (CommonJS), ~50KB (ESM)
- **Tests**: 135 passing
- **TypeScript**: Fully typed with .d.ts files
- **Formats**: CJS + ESM + TypeScript declarations
- **Dependencies**: Zero runtime dependencies

## Support

For issues or questions:
- GitHub: https://github.com/b3008/pulseCLI/issues
- npm: https://www.npmjs.com/package/@b3008/pulse-cli-core
