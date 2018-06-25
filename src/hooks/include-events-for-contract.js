// eslint-disable-next-line no-unused-vars
module.exports = function(options = {}) {
  return async context => {
    if (context.result && context.result.data) {
      const contractQueries = await context.result.data.map(async contract => {
        const address = contract.address
        const events = await context.app.service('events').find({
          query: {
            $limit: -1,
            'data.address': contract.address
          }
        })
        return { ...contract, events }
      })
      const contractWithEvents = await Promise.all(contractQueries)
      context.result.data = contractWithEvents
    }

    return context
  }
}
