const onlyInternal = require('../../hooks/only-internal')
const parseEvent = require('../../hooks/parse-event')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [onlyInternal()],
    update: [onlyInternal()],
    patch: [onlyInternal()],
    remove: [onlyInternal()]
  },

  after: {
    all: [],
    find: [parseEvent()],
    get: [parseEvent()],
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
