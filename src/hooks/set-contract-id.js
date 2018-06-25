// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    context.data._id = context.data.address
    return context
  }
}
