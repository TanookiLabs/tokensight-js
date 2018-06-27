const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

app.service('web3').on('connected', async web3 => {
  const _lastBlock = await getLastStoredEventBlock(app)
  const lastBlock = _lastBlock === 0 ? 0 : _lastBlock - 10
  console.log(`Starting listening from block: ${lastBlock}`)
  app.service('event-scrapper').create({
    web3: web3,
    name: 'Transaction',
    topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    options: {
      fromBlock: `0x${lastBlock.toString(16)}`,
      toBlock: 'latest'
    },
    network: 'rinkeby'
  })
})

const getLastStoredEventBlock = async app => {
  const events = await app.service('events').find({
    query: {
      $sort: {
        'data.blockNumber': -1
      },
      $select: ['data.blockNumber'],
      $limit: 1
    }
  })
  const result = events.data[0]
  if (result) {
    const blockNumber = result.data.blockNumber
    return Number(blockNumber)
  }
  return 0
}

module.exports = app
