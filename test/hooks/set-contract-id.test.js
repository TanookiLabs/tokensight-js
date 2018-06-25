const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const setContractId = require('../../src/hooks/set-contract-id')

describe("'set-contract-id' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async create(data) {
        return data
      }
    })

    app.service('dummy').hooks({
      before: {
        create: setContractId()
      }
    })
  })

  it('sets the _id property as the contract address', async () => {
    const contract = {
      address: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e',
      isERC721: null
    }

    const result = await app.service('dummy').create(contract)

    assert.deepEqual(result, {
      address: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e',
      isERC721: null,
      _id: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e'
    })
  })
})
