const { BadRequest } = require('@feathersjs/errors')

// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    const { data } = context

    if (!data.web3) throw new BadRequest('Web3 object is required')

    if (!data.name) throw new BadRequest('Event name is required')
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      throw new BadRequest('Event name is invalid')
    }

    if (!data.topic) throw new BadRequest('Event topic is required')
    if (typeof data.topic !== 'string' || data.topic.trim() === '') {
      throw new BadRequest('Event topic is invalid')
    }

    if (!data.network) throw new BadRequest('Event network is required')
    if (typeof data.network !== 'string' || data.topic.trim() === '') {
      throw new BadRequest('Event network is invalid')
    }

    context.data = {
      web3: data.web3,
      name: data.name,
      topic: data.topic,
      options: parseOptions(data.options),
      network: data.network
    }

    return context
  }
}

const parseOptions = (options = { fromBlock: 'latest', toBlock: 'pending' }) => {
  const defaultOptions = { fromBlock: 'latest', toBlock: 'pending' }

  return {
    fromBlock: options.fromBlock || defaultOptions.fromBlock,
    toBlock: options.toBlock || defaultOptions.toBlock
  }
}
