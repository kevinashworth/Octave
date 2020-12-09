const fs = require('fs')
const path = require('path')
const winston = require('winston')
const { createLogger, format, transports } = winston

// Meteor ruins __dirname. Best method I can find so far.
// See https://stackoverflow.com/questions/20313406/meteor-js-how-to-write-a-file-to-disk-from-the-server
const logFolder = path.join(fs.realpathSync('.'), '../../../../../logs')

const prettyJson = format.printf(info => {
  if (typeof info.message === 'object') {
    info.message = JSON.stringify(info.message, null, 2)
  }
  return `${info.level}: ${info.timestamp} ${info.message}`
})

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.simple(),
    prettyJson
  ),
  transports: [
    new transports.File({
      filename: path.join(logFolder, 'winston-error.log'),
      level: 'error'
    }),
    new transports.File({
      filename: path.join(logFolder, 'winston-info.log'),
      level: 'info'
    })
    // new transports.Stream({
    //   stream: fs.createWriteStream(path.join(logPath, 'winston-stream.log'))
    // })
  ]
})

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new transports.Console())
// }

logger.log({
  level: 'error',
  message: 'Hello, winston-error.log'
})
logger.log({
  level: 'info',
  message: 'Hello, winston-info.log'
})

module.exports = {
  logger
}
