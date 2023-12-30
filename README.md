# dns-detective

## How to use

```
Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -d, --domain      The domain to enumerate subdomains for   [string] [required]
  -o, --outputPath  The output file with the found subdomains[string] [required]
```

Usage: `bun run index.ts -d google.com -o results.txt`

**NOTE:** Setting the appropriate API keys for each provider provides the best enumeration results

## Installation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
