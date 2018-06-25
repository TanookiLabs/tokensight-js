const assert = require('assert')
const feathers = require('@feathersjs/feathers')
const memory = require('feathers-memory')
const includeEventsForContract = require('../../src/hooks/include-events-for-contract')

describe.skip("'include-events-for-contract' hook", () => {
  let app

  beforeEach(() => {
    app = feathers()

    const options = {
      paginate: {
        default: 10,
        max: 50
      },
      id: '_id'
    }

    app.use('/events', memory(options))

    app.use('/dummy', {
      async get(id) {
        return { id }
      }
    })

    app.service('dummy').hooks({
      after: includeEventsForContract()
    })
  })

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test')

    assert.deepEqual(result, { id: 'test' })
  })
})
