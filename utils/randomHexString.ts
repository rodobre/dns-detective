import * as crypto from 'crypto'

export const randomHexString = (length: number) =>
  crypto.randomBytes(length).toString('hex')
