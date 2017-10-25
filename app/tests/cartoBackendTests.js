'use strict'
/*jshint expr: true*/

const chai = require('chai')
const _getComponentData = require('../handler.js')._getComponentData
const assert = chai.assert
const cartoRes = require('./cartores1.json')
const util = require('util')
const inspect = (obj) => {
  console.log(util.inspect(obj, {depth: null, colors: true}))
}

describe('Carto res object is valid for testing', () => {
  it('Loads valid object',() => {
    assert.isObject(cartoRes)
  })
})

describe('carto to nvd3 piechart series works', () => {
  const dashboardData = cartoRes.data
  const component = cartoRes.regions[0].children[0]
  const componentData = _getComponentData(component, dashboardData)
    console.log('component')
    inspect(componentData)
  it('Piechart series object is array', () => {
    assert.isArray(componentData)
  })
  it('Piechart series object has expected fields', () => {
    assert.isDefined(componentData[0].x)
    assert.isDefined(componentData[0].y)
  })
})
