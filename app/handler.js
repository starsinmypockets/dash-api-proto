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
              const fetchedData = Object.assign(resource, {data: json})
              resolve(fetchedData)
            }).catch(err => {
              reject(err)
            })
          })
        }

        break
      case 'csv':
        return Promise.reject("Cannot fetch resource, resourceType - CSV not yet supported")
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

// @@TODO this should be _getNVD3PieChartSeries
// [ { FIELDNAME : VALUE, ...} , ...]
const _getNVD3Series = module.exports._getNVD3Series = (component, dashboardObject) => {
  const fieldArrays = component.dataFields.map(dataField => {
    
    const resourceField = dataField.dataResourceField
    const componentField = dataField.fieldName

    // get the appropriate dataResource
    const dataResource = _.filter(dashboardObject.dashboardData, resource => resource.resourceHandle === dataField.dataResource)[0]
    
    if (dataResource) {
      // get an array of field values for the desired field
      const fieldArray = dataResource.data.rows.map(row => {
        const val = row[resourceField] ? row[resourceField] : null
        let fieldRow = {}
        fieldRow[componentField] = val
        return fieldRow
      })

      return fieldArray
    } else {
      console.log('No dataResource matching settings', component, dashboardObject.data)
    }
  })
  
  //merge dataFields into array of objects with required fields 
  const componentData = _.zipWith(...fieldArrays, Object.assign)
  
  return Object.assign(component, {data: componentData})
}

// dashboardData = cartoDB sql api return datasets
const _getComponentData = module.exports._getComponentData = (component, dashboardObject) => {
  switch (component.dataType) {
    case 'NVD3Series':
      return _getNVD3Series(component, dashboardObject)
    case 'scalarValue':
      break
    default:
      return component
      break
  }
}

const _mapComponentData = module.exports._mapComponentData = (dashboardObject) => {

  const regions = dashboardObject.regions.map(region => {
    const children = region.children.map(component => {
      
      return _getComponentData(component, dashboardObject)
    })
    const newRegion = Object.assign(region, {children: children})
  })
  const updatedDashboardObject = Object.assign(dashboardObject, regions)
  return updatedDashboardObject
}

module.exports.hello = (event, context, callback) => {
  const res = JSON.stringify({hello: "world"});
  callback(null, res)
}

module.exports.validateSchema = (event, context, callback) => {
  const res = _validateSchema(event.payload, event.validator)
  callback(null, res)
}

module.exports.getDashboard = (event, context, callback) => {
  _fetchDataResources(event)
    .then(data => {
      const dashboardObject = Object.assign(event, {dashboardData: data}) 
      const newDashboard = _mapComponentData(dashboardObject)
      callback(null, newDashboard)
    })
    .catch(err => {
      callback(err, event)
    })
}
