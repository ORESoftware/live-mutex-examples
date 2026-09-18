# Repository agent instructions

These instructions apply to `ORESoftware/live-mutex-examples` and all paths beneath it.

## Discover instructions hierarchically

Resolve `$PWD`, walk every ancestor to the filesystem root, and apply every readable lowercase `agents.md` in root-to-leaf order. Do not search siblings. Deduplicate resolved paths and inodes, fail on symlink cycles, and report unreadable instruction files.

## Synchronize and merge safely

Start focused work from the latest remote default branch and preserve concurrent commits.

- avoid git rebase in favor of git merge.
- Never force-push, rewrite shared history, discard remote work, or bypass review and required checks without exact authorization.
- Resolve conflicts semantically by combining compatible behavior, examples, tests, documentation, and package contracts from both sides. Never choose `ours`, `theirs`, current, or incoming mechanically.
- After conflict resolution, reread affected files and scan the entire worktree for unresolved markers, excluding `.git`:

```sh
grep -RInE '^(<<<<<<<|=======|>>>>>>>)' --exclude-dir=.git .
```

## Preserve example intent

This repository contains small TypeScript reproductions and demonstrations for `live-mutex` broker/client behavior.

- Keep examples focused and independently understandable; do not convert a reproducer into a general application framework.
- Preserve lock acquisition, release, timeout, Unix-domain-socket, concurrency, and failure-observation semantics unless the change explicitly tests a different behavior.
- Do not silently upgrade dependencies, TypeScript targets, package metadata, or generated output while changing an example. Separate modernization from behavioral reproduction.
- Avoid committed credentials, machine-specific private paths, or customer data. `/tmp` socket examples must use bounded, clearly disposable names.
- When fixing a bug demonstration, retain a failing or historical reproduction when it remains useful and add a clearly named corrected example rather than erasing the evidence.

## Validate changes

Run the narrowest relevant example plus the repository scripts that still apply:

```sh
npm test
npm run tsc
```

The pinned reusable GitHub Action validates hierarchical discovery, tool pointers, merge policy, and repository-wide conflict markers in CI. Record any legacy dependency or runtime limitation rather than weakening validation silently.
