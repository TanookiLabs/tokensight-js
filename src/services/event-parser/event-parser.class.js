/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {}
    this.app = null
  }

  async find(params) {
    return this.app.service('events').find(params)
  }

  async get(id, params) {
    return this.app.service('events').get(id, params)
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function(options) {
  return new Service(options)
}

module.exports.Service = Service
