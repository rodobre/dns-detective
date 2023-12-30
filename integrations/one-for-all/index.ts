import { getPerformanceTimeDelta } from '../../utils/getPerformanceTimeDelta'
import { getTimestamp } from '../../utils/getTimestamp'
import { LogLevel, log } from '../../utils/logger'
import { randomHexString } from '../../utils/randomHexString'
import { validateDomain } from '../../utils/validateDomain'
import type { DNSEnumerationResult } from '../Types'
import * as child_process from 'child_process'
import * as path from 'path'

export const getOneForAllResults = async (
  domain: string
): Promise<DNSEnumerationResult> => {
  domain = validateDomain(domain)

  const timeAtStart = performance.now()
  log(
    `Preparing domain [${domain}] for DNS enumeration via provider [OneForAll]...`
  )

  const folder = path.join(
    path.sep,
    'tmp',
    `oneforall-results-${domain}-${getTimestamp()}-${randomHexString(6)}`
  )

  const joinedResultFiles = path.join(folder, 'temp', 'collected_*.txt')
  const cmd = `docker run --rm -v ${folder}:/OneForAll/results shmilylty/oneforall:latest --target ${domain} --req False --brute False run; cat ${joinedResultFiles} | sort | uniq`

  return {
    method: 'process',
    results: new Promise((resolve, reject) => {
      child_process.exec(
        cmd,
        (
          error: child_process.ExecException | null,
          stdout: string,
          stderr: string
        ) => {
          if (
            stderr &&
            !stdout &&
            !stderr.includes('The subdomain result for')
          ) {
            const timeAtEnd = performance.now()
            log(
              `Failed to enumerate domain [${domain}] via provider [OneForAll] - ${getPerformanceTimeDelta(
                timeAtEnd,
                timeAtStart
              )} ${stderr}`,
              LogLevel.Error
            )
            reject(stderr)
          } else {
            const timeAtEnd = performance.now()
            log(
              `Domain [${domain}] finished DNS enumeration via provider [OneForAll] - ${getPerformanceTimeDelta(
                timeAtEnd,
                timeAtStart
              )}`
            )
            resolve(stdout.split('\n'))
          }
        }
      )
    }),
  }
}
