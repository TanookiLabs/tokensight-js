// Initializes the `contracts` service on path `/contracts`
const createService = require('feathers-nedb')
const createModel = require('../../models/contracts.model')
const hooks = require('./contracts.hooks')

module.exports = function(app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/contracts', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('contracts')

  service.hooks(hooks)
}
