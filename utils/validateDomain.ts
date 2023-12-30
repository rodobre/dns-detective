import { z } from 'zod'

export const validateDomain = (domain: string) =>
  z
    .string()
    .regex(/^[A-Za-z0-9-_\.]+$/, 'Invalid domain format')
    .parse(domain)

export const validateDomainSafe = (domain: string) =>
  z
    .string()
    .regex(/^[A-Za-z0-9-_\.]+$/, 'Invalid domain format')
    .safeParse(domain).success
    ? domain
    : false
