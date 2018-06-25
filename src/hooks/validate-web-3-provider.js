const { BadRequest } = require('@feathersjs/errors')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const { data } = context

    if (!data.provider) throw new BadRequest('Web3 provider is required')

    context.data = { provider: data.provider }

    return context
  }
}
