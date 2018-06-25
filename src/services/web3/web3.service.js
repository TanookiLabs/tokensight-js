// Initializes the `web3` service on path `/web3`
const createService = require('./web3.class.js')
const hooks = require('./web3.hooks')

module.exports = function(app) {
  const options = {}

  // Initialize our service with any options it requires
  app.use('/web3', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('web3')

  service.hooks(hooks)
}
