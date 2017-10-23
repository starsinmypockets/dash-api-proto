'use strict'
/*jshint expr: true*/

const _fetchCarto = require('../handler.js')._fetchCarto
const chai = require('chai-as-promised')
const assert = chai.assert // we are using the "expect" style of Chai

describe('Tests work', function() {
  it('10 should equal 10', function() {
    assert.equal(10, 10);
  })
})

describe('_fetchCarto returns data given valid resource path', () => {
  const event = {
    url : 'https://starsinmypockets.carto.com/api/v2/sql',
    query: '?q=SELECT * FROM us_foreclosures_jan_2012_by_state_0'
  }
  
  it('Should fetch data', () => {
    return assert.eventually.isObject(_fetchCarto(event, {}))
  })
  
})
