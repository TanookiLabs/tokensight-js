const Web3 = require('web3')

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {}
    this.isInitialized = false
    this.web3 = null
  }

  async create(data) {
    if (this.isInitialized) throw new Error('Web3 Service already initialized')
    this.isInitialized = true
    if (this.web3) throw new Error('Web3 object already created')
    this.setupProvider(data.provider)
    this.web3 = new Web3(data.provider)
    console.log(`Web3 initialized`)
    return this.web3
  }

  setup(app) {
    this.create({ provider: new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/_ws') })
  }

  setupProvider(provider) {
    if (!provider) throw new Error('Missing provider parameter')

    provider.on('connect', () => {
      console.log('Connected to Web3!')
      this.emit('connected', this.web3)
    })

    provider.on('end', () => {
      console.log('Disconnected from Web3')
      this.emit('disconnected', this.web3)
    })

    provider.on('error', error => {
      console.log('Received Web3 Error', error)
      this.emit('error', error)
    })
  }
}

module.exports = function(options) {
  return new Service(options)
}

module.exports.Service = Service
