import { getOneForAllResults } from '../integrations/one-for-all'
import { getSecurityTrailsResults } from '../integrations/securitytrails'
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
    .filter(Boolean)
}
