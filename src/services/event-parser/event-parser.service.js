// Initializes the `EventParser` service on path `/event-parser`
const createService = require('./event-parser.class.js')
const hooks = require('./event-parser.hooks')

module.exports = function(app) {
  const paginate = app.get('paginate')

  const options = {
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/event-parser', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('event-parser')

  service.hooks(hooks)
}
