const TransferEvent = require('../contracts/TransferEvent.json')

module.exports = function(event, web3, abi = TransferEvent.abi) {
  let error
  let result

  try {
    result = web3.eth.abi.decodeLog(abi, event.data.data, event.data.topics)
  } catch (_error) {
    error = _error
    try {
      result = web3.eth.abi.decodeLog(TransferEvent.nonIndexedABI, event.data.data, event.data.topics)
    } catch (__error) {
      try {
        result = web3.eth.abi.decodeLog(TransferEvent.allIndexedABI, event.data.data, event.data.topics)
      } catch (___error) {
        throw error
      }
    }
  }

  return {
    transactionHash: event.data.transactionHash,
    from: result.from,
    to: result.to,
    tokenId: Number(result.tokenId)
  }
}
