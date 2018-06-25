const checkContext = require('./check-context')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return function(context) {
    checkContext(context, 'before', ['find'], 'disablePagination')
    const $limit = (context.params.query || {}).$limit

    if ($limit === '-1' || $limit === -1) {
      context.params.paginate = false
      delete context.params.query.$limit
    }

    return context
  }
}
