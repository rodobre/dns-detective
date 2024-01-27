import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { getRecursiveSubdomains, getSubdomains } from './aggregation'
import { log } from './utils/logger'
import { getPerformanceTimeDelta } from './utils/getPerformanceTimeDelta'

interface Args {
  domain: string
  outputPath: string
  domainFile: string
  concurrency: number
}

async function main() {
  let argv = yargs(hideBin(process.argv))
    .option('domain', {
      alias: 'd',
      describe: 'The domain to enumerate subdomains for',
      type: 'string',
    })
    .option('outputPath', {
      alias: 'o',
      describe: 'The output file with the found subdomains',
      type: 'string',
      demandOption: true,
    })
    .option('domainFile', {
      alias: 'f',
      decsribe:
        'A file with domains separated by line breaks (for recursive enumeration)',
      type: 'string',
    })
    .option('concurrency', {
      alias: 'c',
      describe: 'Number of concurrent coroutines',
      type: 'number',
      default: 4,
    })
    .parseSync() as Args

  let results: string[] = []
  const { outputPath } = argv

  if (Object.prototype.hasOwnProperty.call(argv, 'domain') && argv.domain) {
    const { domain } = argv

    const timeAtStart = performance.now()
    log(`Enumerating subdomains for [${domain}]`)
    results = await getSubdomains(domain)
    const timeAtEnd = performance.now()
    log(
      `Subdomain enumeration completed - ${getPerformanceTimeDelta(
        timeAtEnd,
        timeAtStart
      )}`
    )
  } else if (
    Object.prototype.hasOwnProperty.call(argv, 'domainFile') &&
    argv.domainFile
  ) {
    const { domainFile, concurrency } = argv
    const domains = (await Bun.file(domainFile).text()).split('\n')
    const timeAtStart = performance.now()
    log(`Enumerating recursive subdomains for input file [${domainFile}]`)
    results = await getRecursiveSubdomains(domains, concurrency)
    const timeAtEnd = performance.now()
    log(
      `Recursive subdomain enumeration completed - ${getPerformanceTimeDelta(
        timeAtEnd,
        timeAtStart
      )}`
    )
  }

  await Bun.write(outputPath, results.join('\n'))
}

main()
