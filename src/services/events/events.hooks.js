const onlyInternal = require('../../hooks/only-internal')
const setEventId = require('../../hooks/set-event-id')
const scrapeContractFromEvent = require('../../hooks/scrape-contract-from-event')
const sanitizeAddress = require('../../hooks/sanitize-address')
const { setNow } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [onlyInternal(), setNow('createdAt', 'updatedAt'), setEventId(), sanitizeAddress({ key: 'data.address' })],
    update: [onlyInternal(), setNow('updatedAt'), sanitizeAddress({ key: 'data.address' })],
    patch: [onlyInternal(), setNow('updatedAt'), sanitizeAddress({ key: 'data.address' })],
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
