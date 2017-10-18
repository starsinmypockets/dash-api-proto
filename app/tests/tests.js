const chai = require('chai')
const assert = chai.assert // we are using the "expect" style of Chai
const validateSchema = require ('../handler.js')._validateSchema

  const simpleSchema = {
			"title": "Person",
			"type": "object",
			"properties": {
					"firstName": {
							"type": "string"
					},
					"lastName": {
							"type": "string"
					},
					"age": {
							"description": "Age in years",
							"type": "integer",
							"minimum": 0
					}
			},
			"required": ["firstName", "lastName"]
	}
 
  const barack = {
    "firstName": "Barack", 
		"lastName": "Obama",
	  "age": 66,	
    "address": {
      "lines": [ "1600 Pennsylvania Avenue Northwest" ],
      "zip": "DC 20500",
      "city": "Washington",
      "country": "USA"
    },
    "votes": "lots"
  };
  
  const badBarack = {
    "firstName": "Barack", 
		"lastName": "Obama",
	  "age": "not an age",	
    "address": {
      "lines": [ "1600 Pennsylvania Avenue Northwest" ],
      "zip": "DC 20500",
      "city": "Washington",
      "country": "USA"
    },
    "votes": "lots"
  };

describe('basiSchema', function () {
  it('10 should equal 10', function () {
    assert.equal(10,10);
  })
})

describe ('validateSchema should work for simple object', () => {
  const validated = validateSchema(barack, simpleSchema)
  console.log(0, validated)

  it('Should return an object', () => {
    assert.isObject(validated)
  })

  it('Should not have any errors', () => {
    assert.isEmpty(validated.errors)
  })
})

describe ('validateSchema should fail when field type is wrong', () => {
  const validated = validateSchema(badBarack, simpleSchema)
  console.log(1, validated)

  it('Should return an object', () => {
    assert.isObject(validated)
  })

  it('Should have one error', () => {
    assert.equal(1, validated.errors.length)
  })
})
