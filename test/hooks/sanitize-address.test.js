const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const sanitizeAddress = require('../../src/hooks/sanitize-address')
require('../../src/utils/objectUtils')

describe("'sanitize-address' hook", () => {
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
        create: sanitizeAddress({ key: 'data.address' })
      }
    })
  })

  it('should sanitize the address of an event log', async () => {
    const event = {
      name: 'Transaction',
      topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      data: {
        address: '  0xdCAad9Fd9a74144d226DbF94ce6162ca9f09ED7e ',
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

    const result = await app.service('dummy').create(event)

    assert.deepEqual(result, {
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
    })
  })

  it('should pass the address of the event log if correct', async () => {
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

    const result = await app.service('dummy').create(event)

    assert.deepEqual(result, {
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
    })
  })
})
