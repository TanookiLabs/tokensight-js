const onlyInternal = require('../../hooks/only-internal')
const validateEventScrapperOptions = require('../../hooks/validate-event-scrapper-options')

module.exports = {
  before: {
    all: [onlyInternal()],
    find: [],
    get: [],
    create: [validateEventScrapperOptions()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
