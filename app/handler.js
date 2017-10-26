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

const _fetchResource = module.exports._fetchResource = (resource) => {
    switch (resource.resourceType) {
      case 'cartodb':
        
        // @@TODO this can be another function
        if (resource.query) {
          return new Promise((resolve, reject) => {
            const url = resource.url + resource.query
            fetch(url).then(res => {
              return res.json()
            }).then(json => {
              // return the resource with data attached
              const fetchedData = Object.assign({data: json}, resource)
              resolve(fetchedData)
            }).catch(err => {
              reject(err)
            })
          })
        }

        break
      case 'csv':
        return Promise.resolve({})
        break
        // handle
      default:
        return Promise.reject("Cannot fetch resource, invalid resourceType")
        break
        // umm fail
    }
}

const _fetchDataResources = module.exports._fetchDataResources = (dashboardObj) => {
  const promises = dashboardObj.dataResources.map(resource => {
    return _fetchResource(resource)
  })

  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// [ { FIELDNAME : VALUE, ...} , ...]
const _getNVD3Series = module.exports._getNVD3Series = (component, dashboardObject) => {
  const fieldArrays = _.map(component.dataFields, dataField => {
    const resourceField = dataField.dataResourceField
    const componentField = dataField.fieldName

    // get the appropriate dataResource
    const dataResource = _.filter(dashboardObject.data, resource => resource.resourceHandle === dataField.dataResource)[0]
    
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
  
  return Promise.resolve(Object.assign(component, {data: componentData}))
}

// dashboardData = cartoDB sql api return datasets
const _getComponentData = module.exports._getComponentData = (component, dashboardData) => {
  switch (component.dataType) {
    case 'NVD3Series':
      return _getNVD3Series(component, dashboardData)
    case 'scalarValue':
      break
    default:
      break
  }
}

const _getDashboard = module.exports._getDashboard = (dashboardObject) => {
  const _regions = Object.assign(dashboardObject.regions, {})
  
  const regionUpdates = _regions.map(region => {
    const componentUpdates = region.children.map(component => {
      return (_getComponentData(component, dashboardObject))
    })

    Promise.all(componentUpdates).then(updates => {
      Promise.resolve(updates)
    })
  })

  Promise.all(regionUpdates)
    .then(newDashObj => {
      Promise.resolve( newDashObj)
    })
}

module.exports.validateSchema = (event, context, callback) => {
  const res = _validateSchema(event.payload, event.validator)
  callback(null, res)
}

module.exports.getDashboard = (event, context, callback) => {
  _fetchDataResources(event)
    .then(data => {
      // fetch data
      const dashboardObject = Object.assign(event, {data: data}) 

      // map data to components and return
      _getDashboard(dashboardObject)
        .then(newDashboard => callback(null, newDashboard))
        .catch(err => {callback(err, event)})
    })
    .catch(err => {
      callback(err, event)
    })
}
