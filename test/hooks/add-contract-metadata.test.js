const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const addContractMetadata = require('../../src/hooks/add-contract-metadata')
const memory = require('feathers-memory')
const createWeb3Service = require('../../src/services/web3/web3.class')
require('../../src/utils/objectUtils')

describe("'add-contract-metadata' hook", () => {
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

    const web3Service = app.use('/web3', createWeb3Service({}))
    web3Service.setup(app)

    app.use('/contracts', memory(options))

    app.service('contracts').hooks({
      after: {
        create: addContractMetadata()
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

  it('adds name for contract', async () => {
    await getWeb3()
    const result = await app.service('contracts').create({
      address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
      isERC721: null,
      _id: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6'
    })
    assert(result.name === 'Dentacoin')
  })

  it('adds symbol for contract', async () => {
    await getWeb3()
    const result = await app.service('contracts').create({
      address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
      isERC721: null,
      _id: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6'
    })
    assert(result.symbol === '٨')
  })
})
