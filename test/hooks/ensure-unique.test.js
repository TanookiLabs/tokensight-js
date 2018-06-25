const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const ensureUnique = require('../../src/hooks/ensure-unique')

describe.skip("'ensure-unique' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id) {
        return { id }
      }
    })

    app.service('dummy').hooks({
      before: ensureUnique()
    })
  })

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test')

    assert.deepEqual(result, { id: 'test' })
  })
})
