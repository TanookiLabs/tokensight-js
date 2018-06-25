// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const { key } = options
    if (!key) throw new Error('Key value is required for EnsureUnique hook')

    if (typeof key !== 'string' || key.trim() === '') {
      throw new Error('Key value for EnsureUnique hook is invalid')
    }

    const address = Object.byString(context.data, key)
    Object.setValueByString(context.data, key, address.trim())

    return context
  }
}
