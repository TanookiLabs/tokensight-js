// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const event = context.result
    if (event && event.data && event.data.address) {
      await context.app.service('contracts').create({
        address: event.data.address,
        isERC721: null
      })
    }
    return context
  }
}
