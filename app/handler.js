'use strict'

const fetch = require('node-fetch')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

///////////////////////
// Units for testing /
/////////////////////

const _validateSchema = module.exports._validateSchema = (payload, validator) => {
  const Validator = require('jsonschema')
  const v = new Validator.Validator()
  return v.validate(payload, validator)
}

/**
 * @return valid dashboard object
 *
 **/
const _getDashboard = module.exports._getDashboard = (event, callback) => {
  // validate request against request schema
  
  switch (event.backend) {
    case 'cartodb':
      if (event.query) {
        const url = event.url + event.query
        console.log("URL", url)
        fetch(url).then(res => {
          return res.json()
        }).then(json => {
          callback(null, json)
        }).catch(err => {
          console.log('ERR', err)
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

////////////////////
// nodejs Exports /
//////////////////

/**
 * Validate a schema using nodejs JSONSchema implementation
 **/
module.exports.validateSchema = (event, context, callback) => {
  const res = _validateSchema(event.payload, event.validator)

  callback(null, res)
}

/**
 * Fetch a resource using aws sdk and 
 * upload to specified s3 bucket
 **/
module.exports.fetchToS3 = (event, context, callback) => {
  fetch(event.url)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(new Error(
        `Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
    })
    .then(response => response.buffer())
    .then(buffer => (
      s3.putObject({
        Bucket: event.bucket,
        Key: event.key,
        Body: buffer,
      }).promise()
    ))
    .then(v => callback(null, v), callback);
};

/**
 * Given a valid tag get s3 metadata for a dataResource
 *
 */
module.exports.getS3ResourceInfo = (event, context, callback) => {
  // grab it
}

module.exports.getDashboard = (event, context, callback) => {
  _getDashboard(event, callback)
}
