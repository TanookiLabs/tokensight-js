const onlyInternal = require('../../hooks/only-internal')
const checkIfErc721 = require('../../hooks/check-if-erc-721')
const addContractMetadata = require('../../hooks/add-contract-metadata')
const setContractId = require('../../hooks/set-contract-id')
const includeEventsForContract = require('../../hooks/include-events-for-contract')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [onlyInternal(), setContractId()],
    update: [onlyInternal()],
    patch: [onlyInternal()],
    remove: [onlyInternal()]
  },

  after: {
    all: [], //[includeEventsForContract()],
    find: [],
    get: [],
    create: [checkIfErc721(), addContractMetadata()],
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
