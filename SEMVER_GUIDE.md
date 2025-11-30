# Semantic Versioning (SemVer) Guide & GitHub Integration

## 📌 What is SemVer?

Semantic Versioning (SemVer) is a versioning scheme that uses a three-part number: `MAJOR.MINOR.PATCH` (e.g., `2.4.1`). Each segment indicates a specific type of change:

- **MAJOR (X.0.0)**: Incremented for incompatible API changes
- **MINOR (1.Y.0)**: Incremented for backwards-compatible feature additions
- **PATCH (1.0.Z)**: Incremented for backwards-compatible bug fixes

Additional labels (e.g., `-beta.1`, `-alpha.2`) can be used for pre-release versions.

## 🔧 Integrating SemVer Into Your Project

### package.json Configuration

Your `package.json` already contains a version field. Update it manually or via npm scripts:

```json
{
  "name": "astro-enterprise-boilerplate",
  "version": "1.0.0", // <-- Your SemVer version
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

### Git Tagging & GitHub Releases

**Create a version tag:**

```bash
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0
```

**Create a GitHub Release:**

1. Go to GitHub → "Releases" → "Draft a new release"
2. Enter tag version: `v1.2.0`
3. GitHub can auto-generate release notes from commits

### Automated Versioning (Recommended)

Use Changesets or semantic-release for automation:

```bash
# Install Changesets
pnpm add -D @changesets/cli

# Initialize
pnpm changeset init
```
