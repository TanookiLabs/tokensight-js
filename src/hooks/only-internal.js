const { Forbidden } = require('@feathersjs/errors')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const isExternal = !!context.params.provider
    if (isExternal) throw new Forbidden('Unauthorized access')
    return context
  }
}
