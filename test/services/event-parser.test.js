const assert = require('assert')
const app = require('../../src/app')

describe("'EventParser' service", () => {
  it('registered the service', () => {
    const service = app.service('event-parser')

    assert.ok(service, 'Registered the service')
  })
})
