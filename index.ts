import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { getSubdomains } from './aggregation'
import { log } from './utils/logger'
import { getPerformanceTimeDelta } from './utils/getPerformanceTimeDelta'

interface Args {
  domain: string
  outputPath: string
}

async function main() {
  let argv = yargs(hideBin(process.argv))
    .option('domain', {
      alias: 'd',
      describe: 'The domain to enumerate subdomains for',
      type: 'string',
      demandOption: true,
    })
    .option('outputPath', {
      alias: 'o',
      describe: 'The output file with the found subdomains',
      type: 'string',
      demandOption: true,
    })
    .parseSync() as Args

  const { domain, outputPath } = argv

  const timeAtStart = performance.now()
  log(`Enumerating subdomains for [${domain}]`)
  const results = await getSubdomains(domain)
  const timeAtEnd = performance.now()
  log(
    `Subdomain enumeration completed - ${getPerformanceTimeDelta(
      timeAtEnd,
      timeAtStart
    )}`
  )

  await Bun.write(outputPath, results.join('\n'))
}

main()
