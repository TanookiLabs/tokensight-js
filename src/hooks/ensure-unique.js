const logger = require('../logger')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const { key } = options
    if (!key) throw new Error('Key value is required for EnsureUnique hook')

    if (typeof key !== 'string' || key.trim() === '') {
      throw new Error('Key value for EnsureUnique hook is invalid')
    }

    const value = Object.byString(context.data, key)
    const query = {
      query: {
        [key]: value
      }
    }

    const objects = await context.service.find(query)

    if (objects.total > 0) {
      throw new Error(
        `[INFO] Skipping insertion: Unique key already exists - Path => ${
          context.path
        } - Key => ${key} - Value => ${value}`
      )
      // return require('@feathersjs/feathers').SKIP
    }

    return context
  }
}
