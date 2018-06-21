const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const app = express(feathers())

const Web3 = require('web3')
const wsProvider = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/_ws')
const web3 = new Web3(wsProvider)

wsProvider.on('connect', function() {
  console.log('Connected to Web3!')
})

const TransferEventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const contracts = new Set()

web3.eth.subscribe(
  'logs',
  { fromBlock: 'latest', toBlock: 'pending', topics: [TransferEventTopic] },
  (error, result) => {
    if (error) console.log(error)
    console.log(result)
    if (result.address) {
      contracts.add(result.address)
    }
  }
)

app.use(express.json()) // Turn on JSON body parsing for REST services
app.use(express.urlencoded({ extended: true })) // Turn on URL-encoded body parsing for REST services
app.configure(express.rest()) // Set up REST transport using Express
app.use(express.errorHandler()) // Set up an error handler that gives us nicer errors

app.use('contracts', {
  async get(name) {
    return [...contracts]
  }
})

app.listen(3030)
