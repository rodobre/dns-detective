import { getPerformanceTimeDelta } from '../../utils/getPerformanceTimeDelta'
import { log } from '../../utils/logger'
import { validateDomain } from '../../utils/validateDomain'
import type { DNSEnumerationResult } from '../Types'

export const getSecurityTrailsResults = async (
  domain: string
): Promise<DNSEnumerationResult> => {
  domain = validateDomain(domain)

  const timeAtStart = performance.now()
  log(
    `Preparing domain [${domain}] for DNS enumeration via provider [SecurityTrails]...`
  )

  const results = fetch(
    `https://api.securitytrails.com/v1/domain/${encodeURIComponent(
      domain
    )}/subdomains?children_only=false&include_inactive=true`,
    {
      headers: {
        accept: 'application/json',
        apikey: process.env.SECURITY_TRAILS_API_KEY || '',
      },
    }
  )
    .then(
      (result) =>
        result.json() as Promise<{ subdomains: string[]; endpoint: string }>
    )
    .then((result) => {
      const timeAtEnd = performance.now()
      log(
        `Domain [${domain}] finished DNS enumeration via provider [SecurityTrails] - ${getPerformanceTimeDelta(
          timeAtEnd,
          timeAtStart
        )}`
      )
      return result.subdomains.map((subdomain) => `${subdomain}.${domain}`)
    })

  return {
    method: 'api',
    results,
  }
}
