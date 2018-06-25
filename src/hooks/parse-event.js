const parseEvent = require('../utils/parseEvent')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const app = context.app
    const web3 = app.service('web3').web3

    if (!context.result) return context

    if (Array.isArray(context.result.data)) {
      context.result.data = context.result.data.map(event => parseEvent(event, web3))
    } else {
      context.result = parseEvent(context.result, web3)
    }

    return context
  }
}
