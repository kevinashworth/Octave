import log from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

prefix.reg(log)
log.setLevel(log.levels.DEBUG)
prefix.apply(log, {
  format () {
    return '[KA]'
  }
})
