const onlyInternal = require('../../hooks/only-internal')
const setEventId = require('../../hooks/set-event-id')
const scrapeContractFromEvent = require('../../hooks/scrape-contract-from-event')
const sanitizeAddress = require('../../hooks/sanitize-address')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [onlyInternal(), setEventId(), sanitizeAddress({ key: 'data.address' })],
    update: [onlyInternal(), sanitizeAddress({ key: 'data.address' })],
    patch: [onlyInternal(), sanitizeAddress({ key: 'data.address' })],
    remove: [onlyInternal()]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [scrapeContractFromEvent()],
    update: [scrapeContractFromEvent()],
    patch: [scrapeContractFromEvent()],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
