const web3 = require('./web3/web3.service.js')
const eventScrapper = require('./event-scrapper/event-scrapper.service.js')
const events = require('./events/events.service.js')
const eventParser = require('./event-parser/event-parser.service.js')
const contracts = require('./contracts/contracts.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(web3)
  app.configure(eventScrapper)
  app.configure(events)
  app.configure(eventParser)
  app.configure(contracts)
}
