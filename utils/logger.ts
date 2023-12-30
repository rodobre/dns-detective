export enum LogLevel {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

export const log = (message: string, level: LogLevel = LogLevel.Info): void => {
  const date = new Date().toLocaleString()
  let color: string

  switch (level) {
    case LogLevel.Error:
      color = '\x1b[31m' // Red
      break
    case LogLevel.Warning:
      color = '\x1b[33m' // Yellow (Orange might not be supported in all terminals)
      break
    case LogLevel.Info:
      color = '\x1b[36m' // Cyan (Light blue)
      break
    case LogLevel.Debug:
      color = '\x1b[35m' // Cyan (Light blue)
      break
    default:
      color = '\x1b[0m' // Reset
      break
  }

  if (level === LogLevel.Error) {
    console.error(
      `[${date}] [${color}${level.toUpperCase()}\x1b[0m] ${message}`
    )
    return
  }

  console.log(`[${date}] [${color}${level.toUpperCase()}\x1b[0m] ${message}`)
}
