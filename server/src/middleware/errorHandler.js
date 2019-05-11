import chalk from 'chalk';

export function errorHandler() {
  return function(e, _req, res, _next) {
    if (e) {
      console.error(chalk.red(`[ErrorHandler] ${e.message}`))
      res.status(e.code || 500).send(e.message)
    }
  }
}
