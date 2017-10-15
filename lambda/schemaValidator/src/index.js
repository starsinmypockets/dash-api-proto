const Validator = require('jsonschema')
const v = new Validator()

exports.handler = function(event, context, callback) {
  const result = v.validate(event.payload, event.validator)
  callback(null, result)
}
