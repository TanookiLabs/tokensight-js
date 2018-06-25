const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const parseEvent = require('../../src/hooks/parse-event')
const createWeb3Service = require('../../src/services/web3/web3.class')

describe("'parse-event' hook", () => {
  let app

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

  beforeEach(() => {
    app = feathers()

    const web3Service = app.use('/web3', createWeb3Service({}))
    web3Service.setup(app)

    app.use('/dummy', {
      async find(params) {
        if (params.pagination === true) {
          return {
            total: 664,
            limit: 10,
            skip: 0,
            data: [event]
          }
        }
        return event
      },

      async get(id) {
        return event
      }
    })

    app.service('dummy').hooks({
      after: {
        find: parseEvent(),
        get: parseEvent()
      }
    })
  })

  const getWeb3 = async () => {
    return new Promise(resolve => {
      if (app.service('web3').web3) {
        resolve(app.service('web3').web3)
      } else {
        app.service('web3').on('connected', web3 => {
          resolve(web3)
        })
      }
    })
  }

  it('parses the provided event without pagination', async () => {
    const web3 = await getWeb3()
    const result = await app.service('dummy').find()
    assert.deepEqual(result, {
      transactionHash: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954',
      from: '0xFC378dAA952ba7f163c4a11628f55a4df523b3EF',
      to: '0xCf0E9b4746cfB97bAE329FE5F696969F6564566a',
      tokenId: 2314
    })
  })

  it('parses the provided event with pagination', async () => {
    const web3 = await getWeb3()
    const result = await app.service('dummy').find({ pagination: true })
    assert.deepEqual(result, {
      total: 664,
      limit: 10,
      skip: 0,
      data: [
        {
          transactionHash: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954',
          from: '0xFC378dAA952ba7f163c4a11628f55a4df523b3EF',
          to: '0xCf0E9b4746cfB97bAE329FE5F696969F6564566a',
          tokenId: 2314
        }
      ]
    })
  })

  it('parses the provided event without pagination on get', async () => {
    const web3 = await getWeb3()
    const result = await app.service('dummy').get(1)
    assert.deepEqual(result, {
      transactionHash: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954',
      from: '0xFC378dAA952ba7f163c4a11628f55a4df523b3EF',
      to: '0xCf0E9b4746cfB97bAE329FE5F696969F6564566a',
      tokenId: 2314
    })
  })
})
