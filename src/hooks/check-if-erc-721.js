const ERC721 = require('../contracts/ERC721.json')
const ERC20 = require('../contracts/ERC20.json')
const parseEvent = require('../utils/parseEvent')
const logger = require('../logger')
require('../../src/utils/objectUtils')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const web3 = context.app.service('web3').web3
    const contracts = context.app.service('contracts')

    const address = context.result.address
    const events = await context.app.service('events').find({
      query: {
        'data.address': address,
        $limit: 1
      }
    })

    const event = events.data[0]

    let parsedEvent
    try {
      parsedEvent = parseEvent(event, web3)
    } catch (error) {
      // Not a Transfer event
      logger.error('Unable to parse TransferEvent', event, error)
      context.result = await contracts.patch(context.result._id, { isERC721: false })
      return context
    }

    const isERC721 = await testForERC721Interface(web3, address, parsedEvent)

    if (isERC721 !== null) {
      context.result = await contracts.patch(context.result._id, { isERC721 })
    } else {
      // TODO: Move this into a separate hook
      const isERC20 = await testForERC20Interface(web3, address, parsedEvent)

      if (isERC20 !== null) {
        const _isERC721 = isERC20 === true ? false : isERC721
        context.result = await contracts.patch(
          context.result._id,
          Object.removingUndefined({ isERC721: _isERC721, isERC20 })
        )
      }
    }

    return context
  }
}

// TODO: Move these into their own module

const testForERC721Interface = async (web3, address, event) => {
  const contract = new web3.eth.Contract(ERC721.abi, address)
  try {
    const tokenURI = await contract.methods.tokenURI(event.tokenId).call()

    if (typeof tokenURI !== 'string' || tokenURI.trim() === '') {
      // Unable to determine if it's ERC721 based on metadata
      return null
    }
    return true
  } catch (error) {
    // Unable to determine if it's ERC721 due to error
    // This might mean that the contract is not an ERC721, or that something else happened
    return null
  }
}

// eslint-disable-next-line no-unused-vars
const testForERC20Interface = async (web3, address, event) => {
  const contract = new web3.eth.Contract(ERC20.abi, address)
  try {
    const response = await contract.methods.decimals().call()
    const decimals = Number(response)
    if (isNaN(decimals)) {
      // Most likely not an ERC20 contract
      return false
    }
    if (decimals >= 0) {
      // Most likely an ERC20 contract
      return true
    }
  } catch (error) {
    // Unable to determine if it's ERC20 due to error
    // This might mean that the contract is not an ERC20, or that something else happened
    return null
  }
}
