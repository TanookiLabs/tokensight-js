// Initializes the `EventScrapper` service on path `/event-scrapper`
const createService = require('./event-scrapper.class')
const hooks = require('./event-scrapper.hooks')

module.exports = function(app) {
  const options = {}

  // Initialize our service with any options it requires
  app.use('/event-scrapper', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('event-scrapper')

  service.hooks(hooks)
}
