'use strict'

const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

////////////////////
// LAMBDA EXPORTS /
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

///////////////////////
// Units for testing /
/////////////////////
const _validateSchema = module.exports._validateSchema = (payload, validator) => {
  const Validator = require('jsonschema')
  const v = new Validator.Validator()
  return v.validate(payload, validator)
}
