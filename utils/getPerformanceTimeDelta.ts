export const getPerformanceTimeDelta = (a: number, b: number) =>
  `${((a - b) / 1000).toFixed(2)}s`
