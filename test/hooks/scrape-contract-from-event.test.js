const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const memory = require('feathers-memory')
const scrapeContractFromEvent = require('../../src/hooks/scrape-contract-from-event')

describe("'scrape-contract-from-event' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    const options = {
      paginate: {
        default: 10,
        max: 50
      },
      id: '_id'
    }

    app.use('/contracts', memory(options))

    app.use('/dummy', {
      async create(data) {
        return data
      }
    })

    app.service('dummy').hooks({
      after: {
        create: scrapeContractFromEvent()
      }
    })
  })

  it('creates a contract after adding a new event', async () => {
    const event = {
      name: 'Transaction',
      topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      data: {
        address: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e',
        topics: [
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
          '0x000000000000000000000000cf0e9b4746cfb97bae329fe5f696969f6564566a',
          '0x00000000000000000000000078997e9e939daffe7eb9ed114fbf7128d0cfcd39'
        ],
        data: '000000000000000000000000000000000000000000000000000000000000090a',
        blockNumber: 5831192,
        transactionHash: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954',
        transactionIndex: 174,
        blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        logIndex: 79,
        removed: false,
        id: 'log_827937ca'
      },
      _id: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954'
    }

    await app.service('dummy').create(event)

    const contracts = await app.service('contracts').find({
      query: {
        address: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e'
      }
    })

    assert.deepEqual(contracts.data[0], {
      address: '0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e',
      isERC721: null,
      _id: 0
    })
  })
})
