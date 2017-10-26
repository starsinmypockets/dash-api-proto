'use strict'

const fetch = require('node-fetch')
const _ = require('lodash')
const AWS = require('aws-sdk')
const {reduce, map, filter} = require('async')
const s3 = new AWS.S3()

const _validateSchema = module.exports._validateSchema = (payload, validator) => {
  const Validator = require('jsonschema')
  const v = new Validator.Validator()
  return v.validate(payload, validator)
}

const _fetchResource = module.exports._fetchResource = (resource, callback) => {
    switch (resource.resourceType) {
      case 'cartodb':
        if (resource.query) {
          const url = resource.url + resource.query
          fetch(url).then(res => {
            return res.json()
          }).then(json => {
            // return the resource with data attached
            callback(null, Object.assign({
              data: json
            }, resource))
          }).catch(err => {
            callback(err)
          })
        }
        break
      case 'csv':
        return {}
        break
        // handle
      default:
        return {}
        break
        // umm fail
    }
}

const _fetchDataResources = module.exports._getResource = (event, callback) => {
  map(event.dataResources, _fetchResource, callback)
}

const _getDashboard = module.exports._getDashboard = (event, callback) => {
  _fetchDataResources(event, (err, data) => {
    const dashObj = Object.assign({data: data}, event)
    const _regions = Object.assign(dashObj.reqions, {})
    const regions = map(_regions, region => {
      const children = map(region.children, _getComponentData.bind({dashboardData: data}))
      return Object.assign(region, {children: children} )
    })
    const newDashObj = Object.assign(dashObj, regions)
    callback(null, newDashObj)
  })
}

// dashboardData = cartoDB sql api return datasets
const _getComponentData = module.exports._getComponentData = (component, dashboardData, callback) => {
  // each case in this switch represents an adaptor to a component
  // these will generate data of a certain shape
  switch (component.dataType) {
    // [ { FIELDNAME : VALUE, ...} , ...]
    case 'NVD3Series':
      const fieldArrays = _.map(component.dataFields, dataField => {
        const resourceField = dataField.dataResourceField
        const componentField = dataField.fieldName

        // get the appropriate dataResource
        const dataResource = _.filter(dashboardData, resource => resource.resourceHandle === dataField.dataResource)[0]
        
        // get an array of field values for the desired field
        const fieldArray = _.map(dataResource.data.rows, row => {
          const val = row[resourceField] ? row[resourceField] : null
          let fieldRow = {}
          fieldRow[componentField] = val
          return fieldRow
        })

        return fieldArray

      })
      
      //merge dataFields into array of objects with required fields 
      const componentData = _.zipWith(...fieldArrays, Object.assign)
      
      return Object.assign(component, {data: componentData})

    case 'scalarValue':
      break
    
    default:
      break
  }
}

module.exports.validateSchema = (event, context, callback) => {
  const res = _validateSchema(event.payload, event.validator)
  callback(null, res)
}

module.exports.getDashboard = (event, context, callback) => {
  _getDashboard(event, callback)
}
