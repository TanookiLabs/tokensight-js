const onlyInternal = require('../../hooks/only-internal')
const validateWeb3Provider = require('../../hooks/validate-web-3-provider')

module.exports = {
  before: {
    all: [onlyInternal()],
    find: [],
    get: [],
    create: [validateWeb3Provider()],
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
