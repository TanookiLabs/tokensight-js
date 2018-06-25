const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const onlyInternal = require('../../src/hooks/only-internal')

describe("'only-internal' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id, params) {
        return { id }
      }
    })

    app.service('dummy').hooks({
      before: onlyInternal()
    })
  })

  it('returns when called internally', async () => {
    const result = await app.service('dummy').get('test', { provider: null })
    assert.deepEqual(result, { id: 'test' })
  })

  it('throws when called via rest', async () => {
    try {
      await app.service('dummy').get('test', { provider: 'rest' })
    } catch (error) {
      assert.ok(error)
    }
  })

  it('throws when called via socketio', async () => {
    try {
      await app.service('dummy').get('test', { provider: 'socketio' })
    } catch (error) {
      assert.ok(error)
    }
  })

  it('throws when called via primus', async () => {
    try {
      await app.service('dummy').get('test', { provider: 'primus' })
    } catch (error) {
      assert.ok(error)
    }
  })
})
