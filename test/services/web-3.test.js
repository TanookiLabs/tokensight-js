const assert = require('assert')
const app = require('../../src/app')

describe("'web3' service", () => {
  it('registered the service', () => {
    const service = app.service('web3')

    assert.ok(service, 'Registered the service')
  })
})
