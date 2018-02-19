'use strict'
/*jshint expr: true*/

const chai = require('chai')
const fs = require('fs')
const Api = require('../handler.js')
const config = require('./config.json')
const assert = chai.assert
const cartoRes = require('./apires1.json')
const util = require('util')
const inspect = (obj) => {
  console.log(util.inspect(obj, {depth: null, colors: true}))
}
const component = Object.assign({}, config.regions[1].children[0])
const resource = Object.assign({}, config.dataResources[0])

describe('Carto res object is valid for testing', () => {
  it('Loads valid object',() => {
    assert.isObject(cartoRes)
  })
})

describe('Make sure config obj has valid component', () => {
  it ('looks sane', () => {
    assert.isObject(component)
  })
})

describe('Make sure config object has a valid resource', () => {
  it('looks sane', () => {
    assert.isObject(resource)
    assert.equal(resource.resourceType, 'cartodb')
  })
})


describe('Test fetch carto resource returns data', () => {
  it('_fetchResource should return a valid res', () => {
    return Api._fetchResource(resource).then(res => {
        assert.isObject(res, 'response is an object')
        assert.isObject(res.data, 'response data is an object')
        assert(res.data.rows.length > 0, 'data has rows')
      })
  })
})

describe('Trying to fetch resource with invalid dataType should fail friendly', () => {
  it('_fetchResource should return a valid res', () => {
    assert.isOk(true, "@@TODO")
  })
})

describe('Trying to fetch resource with missing dataType should fail friendly', () => {
  it('_fetchResource should return a valid res', () => {
    assert.isOk(true, "@@TODO")
  })
})

describe('Test fetch resources', () => {
  return it('_fetchDataResources should return a valid res', () => {
    Api._fetchDataResources(config).then(res => {
      assert.isArray(res, "dataResources is array")
      assert.isObject(res[0].data, "first resource has data object")
      assert.isOk(res[0].data.rows.length > 0, "first resource has rows")
      })
  })
})

describe('Test mapComponentData', () => {
  return it('_fetchDataResources should return a valid res', () => {
     Api._fetchDataResources(config).then(res => {
        // mock:
        const dashWithData = Object.assign(config, {dashboardData: res})
        const updatedDashboardObject = Api._mapComponentData(dashWithData)
        inspect(updatedDashboardObject)
        assert.isObject(updatedDashboardObject)
        fs.writeFile('dashFromTest.json', JSON.stringify(updatedDashboardObject), 'utf8')
      })
  })
})
