# infra-org

## Release workflow

This repository uses GitHub Flow. All changes should enter through pull
requests into `master`.

Release Please runs on every push to `master`. When it finds releasable
Conventional Commits, it creates or updates a release pull request.

The release pull request is responsible for preparing the next release version,
including the Node package version and changelog updates handled by Release
Please.

When the release pull request is reviewed and merged into `master`, Release
Please publishes the GitHub Release for that version.

### Commit format

Use Conventional Commits so Release Please can determine the next version:

- `feat:` creates a minor release.
- `fix:` creates a patch release.
- `chore:` tracks maintenance changes.
- `docs:` tracks documentation-only changes.

Use a breaking-change footer when a change requires a major release:

```text
BREAKING CHANGE: describe the incompatible change
```

### Examples

Valid commit messages:

```text
feat: add core project module
fix: correct folder parent reference
chore: update pulumi dependencies
docs: update bootstrap instructions
```

### Release action

The release workflow is defined in
`.github/workflows/release-please.yml` and uses:

```yaml
googleapis/release-please-action@v4
release-type: node
```
