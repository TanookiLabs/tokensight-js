const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const disablePagination = require('../../src/hooks/disable-pagination')

describe.skip("'disable-pagination' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    app.use('/dummy', {
      async get(id) {
        return { id }
      }
    })

    app.service('dummy').hooks({
      find: disablePagination()
    })
  })

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test')

    assert.deepEqual(result, { id: 'test' })
  })
})
