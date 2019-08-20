const logger = (process.env.NODE_ENV === 'production' ? null : (() => {
  let inGroup = false
  const methodToColorMap = {
    debug: `#7f8c8d`, // grey
    log: `#2ecc71`, // green
    warn: `#f39c12`, // yellow
    error: `#c0392b`, // red
    groupCollapsed: `#3498db`, // blue
    groupEnd: null
  }
  const print = function (method, args) {
    if (method === 'groupCollapsed') {
      // Safari doesn't print all console.groupCollapsed() arguments: https://bugs.webkit.org/show_bug.cgi?id=182754
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args)
        return
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ]
    // When in a group, the prefix is not displayed.
    const logPrefix = inGroup ? [] : ['%cV8', styles.join(';')]
    console[method](...logPrefix, ...args)
    if (method === 'groupCollapsed') {
      inGroup = true
    }
    if (method === 'groupEnd') {
      inGroup = false
    }
  }
  const api = {}
  const loggerMethods = Object.keys(methodToColorMap)
  for (const key of loggerMethods) {
    const method = key
    api[method] = (...args) => {
      print(method, args)
    }
  }
  return api
})())
export { logger }
