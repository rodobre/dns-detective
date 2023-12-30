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

## Enumeration example

```
bun run index.ts -d google.com -o results-google.txt
[12/30/2023, 12:05:46 PM] [INFO] Enumerating subdomains for [google.com]
[12/30/2023, 12:05:46 PM] [INFO] Preparing domain [google.com] for DNS enumeration via provider [OneForAll]...
[12/30/2023, 12:05:46 PM] [INFO] Preparing domain [google.com] for DNS enumeration via provider [SecurityTrails]...
[12/30/2023, 12:05:47 PM] [INFO] Domain [google.com] finished DNS enumeration via provider [SecurityTrails] - 1.21s
[12/30/2023, 12:06:29 PM] [INFO] Domain [google.com] finished DNS enumeration via provider [OneForAll] - 42.33s
[12/30/2023, 12:06:29 PM] [INFO] Subdomain enumeration completed - 42.35s
```
