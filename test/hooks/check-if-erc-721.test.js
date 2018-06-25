const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const checkIfErc721 = require('../../src/hooks/check-if-erc-721')
const memory = require('feathers-memory')
const createWeb3Service = require('../../src/services/web3/web3.class')

describe("'check-if-erc721' hook", () => {
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
    app.use('/events', memory(options))

    app.service('contracts').hooks({
      after: {
        create: checkIfErc721()
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

  const createContractFromEvent = async event => {
    await app.service('events').create(event)
    const contract = await app.service('contracts').create({
      address: event.data.address,
      isERC721: null,
      _id: event.data.address
    })
    return contract
  }

  it('sets true for ERC721 contract', async () => {
    await getWeb3
    const contract = await createContractFromEvent(ERC721)
    assert(contract.isERC721 === true)
  })

  it('sets false for ERC20 contract', async () => {
    await getWeb3
    const contract = await createContractFromEvent(ERC20)
    assert(contract.isERC721 === false)
    // TODO: Move this into a separate test hook
    assert(contract.isERC20 === true)
  })

  it('sets null for ambiguous contract', async () => {
    await getWeb3
    const contract = await createContractFromEvent(ERC721_nonCompliant_nonIndexed)
    assert(contract.isERC721 === null)
  })
})

const ERC721 = {
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
  }
}

const ERC20 = {
  name: 'Transaction',
  topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  data: {
    address: '0x08d32b0da63e2C3bcF8019c9c5d849d7a9d791e6',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x000000000000000000000000fb7442ac247ae842238b3e060cd8a5798c1969e3',
      '0x0000000000000000000000005789a8442d990a50da3df2e21164bc3e9798e67e'
    ],
    data: '0x0000000000000000000000000000000000000000000000000000000000000d47',
    blockNumber: 5831192,
    transactionHash: '0x9ce1a6a866d94f4e28216e49102f3ffd05ed8b31db02ce45b03577c834830954',
    transactionIndex: 174,
    blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    logIndex: 79,
    removed: false,
    id: 'log_827937ca'
  }
}

// CryptoKitties
const ERC721_nonCompliant_nonIndexed = {
  name: 'Transaction',
  topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  data: {
    address: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
    data:
      '0x000000000000000000000000b1690c08e213a35ed9bab7b318de14420fb57d8c00000000000000000000000085367b6d3816afc5479cd4fe7e360d235ca20cd100000000000000000000000000000000000000000000000000000000000c69b7',
    blockNumber: 5831410,
    transactionHash: '0x01504b006e17c5b3a59dfae1344a0c50cd7562b946bf97145feb98c48f7d9622',
    transactionIndex: 44,
    blockHash: '0x822a5f341bf814a5a74ffd1204e973d6aada940c16babae7aef6d577c307dcde',
    logIndex: 39,
    removed: false,
    id: 'log_b717669a'
  },
  _id: '0x01504b006e17c5b3a59dfae1344a0c50cd7562b946bf97145feb98c48f7d9622'
}
