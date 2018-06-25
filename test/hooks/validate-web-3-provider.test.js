const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const validateWeb3Provider = require('../../src/hooks/validate-web-3-provider')

describe("'validate-web3-provider' hook", () => {
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
        create: validateWeb3Provider()
      }
    })
  })

  it('requires a provider object', async () => {
    const options = {}

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('uses the provided provider object', async () => {
    const options = { provider: 'MYPROVIDER' }

    const result = await app.service('dummy').create(options)

    assert.deepEqual(result, {
      provider: 'MYPROVIDER'
    })
  })
})
