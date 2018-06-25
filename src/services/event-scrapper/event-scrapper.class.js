/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {}
    this.app = null
  }

  async create(data, params) {
    const { web3, name, topic, options } = data
    console.log(`Starting event scrapper for: ${name}`)

    const subscriptionOptions = { ...options, topics: [topic] }
    console.log(subscriptionOptions)

    const subscription = web3.eth.subscribe('logs', subscriptionOptions, (error, result) => {
      if (error) {
        console.log(error)
        throw error
      }
      console.log(result)
      this.app.service('events').create({ name: name, topic: topic, data: result })
    })

    subscription.on('error', error => {
      console.log(error)
      throw error
    })
  }

  setup(app) {
    this.app = app
  }
}

module.exports = function(options) {
  return new Service(options)
}

module.exports.Service = Service
