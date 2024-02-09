# Indexer Template

This template can be used to build indexer for cosmos chains.

## Build and Run

```bash
# install SubQuery CLI
pnpm i -g @subql/cli

# install dependencies
pnpm i

# Copy proto definitions
pnpm cp:proto

# generate typescript types
pnpm codegen

# build the project
pnpm build

# run with docker
pnpm start:docker
```
