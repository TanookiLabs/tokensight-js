// Application hooks that run for every service
const log = require('./hooks/log')
const disablePagination = require('./hooks/disable-pagination')

module.exports = {
  before: {
    all: [log()],
    find: [disablePagination()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [log()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
