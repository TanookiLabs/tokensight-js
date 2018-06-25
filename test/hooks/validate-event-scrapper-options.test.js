const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const validateEventScrapperOptions = require('../../src/hooks/validate-event-scrapper-options')

describe("'validate-event-scrapper-options' hook", () => {
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
        create: validateEventScrapperOptions()
      }
    })
  })

  it('requires a web3 object', async () => {
    const options = {
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    }

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('requires a name object', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      topic: 'Topic',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    }

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('requires name not to be an empty string', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: '',
      topic: 'Topic',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    }

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('requires a topic object', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    }

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('requires topic not to be an empty string', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: '',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    }

    try {
      await app.service('dummy').create(options)
    } catch (error) {
      assert.ok(error)
    }
  })

  it('uses the provided options', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'FROMBLOCK',
        toBlock: 'TOBLOCK'
      }
    }

    const result = await app.service('dummy').create(options)
    assert.deepEqual(result, {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'FROMBLOCK',
        toBlock: 'TOBLOCK'
      }
    })
  })

  it('sets default options if none are provided', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic'
    }

    const result = await app.service('dummy').create(options)
    assert.deepEqual(result, {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'latest',
        toBlock: 'pending'
      }
    })
  })

  it('sets default options.fromBlock if none is provided', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        toBlock: 'TOBLOCK'
      }
    }

    const result = await app.service('dummy').create(options)
    assert.deepEqual(result, {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'latest',
        toBlock: 'TOBLOCK'
      }
    })
  })

  it('sets default options.toBlock if none is provided', async () => {
    const options = {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'FROMBLOCK'
      }
    }

    const result = await app.service('dummy').create(options)
    assert.deepEqual(result, {
      web3: { provider: 'web-3test' },
      name: 'Test',
      topic: 'Topic',
      options: {
        fromBlock: 'FROMBLOCK',
        toBlock: 'pending'
      }
    })
  })
})
