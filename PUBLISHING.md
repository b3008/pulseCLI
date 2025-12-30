# Publishing PulseCLI to npm

This guide provides detailed instructions for publishing the PulseCLI package to npm.

## Prerequisites

1. An npm account (create one at [npmjs.com](https://www.npmjs.com/signup))
2. npm CLI installed (comes with Node.js)
3. Login to npm from command line: `npm login`

## Pre-Publishing Checklist

Before publishing, update the following in [projects/pulse-cli/package.json](projects/pulse-cli/package.json):

### 1. Update Package Information

```json
{
  "name": "pulse-cli",
  "version": "0.0.1",  // Increment this for each release
  "description": "An Angular CLI-style terminal component library with command registry and markdown support",
  "author": "Your Name <your.email@example.com>",  // Update with your info
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/pulseCLI.git"  // Update with your repo
  }
}
```

### 2. Version Numbering

Follow [Semantic Versioning](https://semver.org/):
- **Patch** (0.0.X): Bug fixes
- **Minor** (0.X.0): New features, backward compatible
- **Major** (X.0.0): Breaking changes

### 3. Check Your README

The library includes a README.md that will be displayed on npm. Make sure it's up to date.

## Publishing Steps

### 1. Build the Library

```bash
ng build pulseCLI
```

This creates a production-ready package in `dist/pulse-cli/`.

### 2. Verify the Build

Check that the build completed successfully:

```bash
ls -la dist/pulse-cli/
```

You should see:
- `package.json` - Package manifest with your metadata
- `bin/` - CLI scripts directory
- `fesm2022/` - ES module bundles
- `lib/` - Type definitions and source
- `README.md` - Package documentation

### 3. Test Locally (Optional but Recommended)

Before publishing, test the package locally:

```bash
cd dist/pulse-cli
npm link
```

Then in a test project:

```bash
npm link pulse-cli
pulse-cli init
```

When done testing:

```bash
npm unlink pulse-cli
```

### 4. Publish to npm

Navigate to the built package:

```bash
cd dist/pulse-cli
```

For a public package:

```bash
npm publish
```

For a scoped package (e.g., `@yourusername/pulse-cli`):

```bash
npm publish --access public
```

### 5. Verify Publication

Check your package on npm:

```
https://www.npmjs.com/package/pulse-cli
```

## Using the Published Package

Once published, users can install it:

```bash
npm install pulse-cli
```

And use the CLI tool:

```bash
npx pulse-cli init
```

## CLI Features

The package includes a CLI command that helps users get started:

```bash
pulse-cli init
```

This command creates:
- `src/app/app.component.ts` - Main component with PulseCLI integration
- `src/app/app.component.html` - Template with PulseCLI component
- `src/app/app.component.scss` - Component styles
- `src/app/about/` - Example about component

## Updating the Package

When you need to publish a new version:

1. Make your changes
2. Update the version in `projects/pulse-cli/package.json`
3. Rebuild: `ng build pulseCLI`
4. Publish: `cd dist/pulse-cli && npm publish`

## Unpublishing (Use with Caution)

If you need to unpublish a version within 72 hours:

```bash
npm unpublish pulse-cli@0.0.1
```

To unpublish the entire package:

```bash
npm unpublish pulse-cli --force
```

**Warning**: Unpublishing can break projects that depend on your package. Only do this if absolutely necessary.

## Best Practices

1. **Always test locally** before publishing
2. **Use semantic versioning** consistently
3. **Keep a CHANGELOG** to track changes between versions
4. **Tag releases** in git: `git tag v0.0.1 && git push --tags`
5. **Test the CLI** after each publish to ensure it works
6. **Document breaking changes** prominently in release notes

## Troubleshooting

### "You must be logged in to publish packages"

Run `npm login` and enter your credentials.

### "You do not have permission to publish"

The package name might be taken. Choose a different name or use a scoped package: `@yourusername/pulse-cli`.

### "ENEEDAUTH" error

Your authentication token expired. Run `npm login` again.

### CLI command not found after installation

Make sure the `bin` field in package.json points to the correct file and that the file has a shebang (`#!/usr/bin/env node`) at the top.

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm package.json fields](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Angular Library Guide](https://angular.io/guide/creating-libraries)
