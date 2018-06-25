const assert = require('assert')
const app = require('../../src/app')

describe("'EventScrapper' service", () => {
  it('registered the service', () => {
    const service = app.service('event-scrapper')

    assert.ok(service, 'Registered the service')
  })
})
