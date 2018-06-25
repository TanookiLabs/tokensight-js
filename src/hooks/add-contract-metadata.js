const NamedContract = require('../contracts/NamedContract.json')
const SymbolContract = require('../contracts/SymbolContract.json')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const web3 = context.app.service('web3').web3
    const contracts = context.app.service('contracts')
    const address = context.result.address

    const namedContract = new web3.eth.Contract(NamedContract.abi, address)
    const symbolContract = new web3.eth.Contract(SymbolContract.abi, address)

    try {
      const name = await namedContract.methods.name().call()
      const symbol = await symbolContract.methods.symbol().call()
      const result = Object.removingUndefined({ name, symbol })
      if (Object.keys(result).length > 0) {
        context.result = await contracts.patch(context.result._id, result)
      }
    } catch (error) {
      console.log(error)
    }

    return context
  }
}
