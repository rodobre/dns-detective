import { getOneForAllResults } from '../integrations/one-for-all'
import { getSecurityTrailsResults } from '../integrations/securitytrails'
import { log } from '../utils/logger'
import { validateDomainSafe } from '../utils/validateDomain'

export const removeDuplicates = (results: string[][]): string[] => {
  const uniqueResults = new Set()
  results.forEach((subdomains) => {
    subdomains.forEach((subdomain) => {
      uniqueResults.add(subdomain)
    })
  })

  return Array.from(uniqueResults).sort() as string[]
}

export const getSubdomains = async (domain: string) => {
  log(`Searching for subdomains of [${domain}]`)

  const results = await Promise.all(
    (
      await Promise.all([
        getOneForAllResults(domain),
        getSecurityTrailsResults(domain),
      ])
    ).map((result) => result.results)
  )

  return removeDuplicates(results)
    .map((result) => validateDomainSafe(result))
    .filter(Boolean) as string[]
}

export const getRecursiveSubdomains = async (
  targetDomains: string[],
  concurrency: number
): Promise<string[]> => {
  let semaphore = concurrency
  let domainQueue = [...targetDomains]
  let results: string[] = [...targetDomains]
  let exit = 0

  const subdomainConsumer = async () => {
    semaphore -= 1
    log('THIS TASK, DOMAIN QUEUE IS:' + JSON.stringify(domainQueue, null, 2))
    const subdomain = domainQueue.pop()

    if (!subdomain) {
      log(`Exited subdomain consumer, no subdomains for [${subdomain}]`)
      semaphore += 1
      return
    }

    const domains = (await getSubdomains(subdomain)).filter(
      (resultDomain: string) =>
        resultDomain !== subdomain && resultDomain !== `www.${subdomain}`
    )
    log('Returned domains' + JSON.stringify(domains, null, 2))
    log(`Found [${domains.length}] subdomains for domain [${subdomain}]`)

    domainQueue = domainQueue.concat(domains)
    results = results.concat(domains)
    semaphore += 1
  }

  const promises: Promise<void>[] = []

  const isFinished = () => domainQueue.length === 0 && semaphore === concurrency

  const processQueue = async () => {
    if (isFinished()) {
      exit = 1
      clearInterval(recurringInterval)
      return
    }

    if (semaphore !== 0) {
      console.log('isFinished', isFinished())
      console.log('semaphore', semaphore)
      promises.push(subdomainConsumer())
    }
  }

  const recurringInterval = setInterval(processQueue, 10)

  while (exit !== 1) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  await Promise.all(promises)
  return results
}
