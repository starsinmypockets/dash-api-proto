'use strict'

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}

module.exports.validateSchema = (event, context, callback) => {
  const Validator = require('jsonschema')
  const v = new Validator.Validator()
  const result = v.validate(event.payload, event.validator)
  
  callback(null, result)
}
