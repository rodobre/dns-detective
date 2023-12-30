export type DNSEnumerationResult = {
  method: 'api' | 'process'
  results: Promise<string[]>
}
