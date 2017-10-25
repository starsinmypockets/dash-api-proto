"use strict"

const chai = require('chai')
const assert = chai.assert // we are using the "expect" style of Chai
const validateSchema = require('../handler.js')._validateSchema
const schemas = require('../schemas.js').schema

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
    "lines": ["1600 Pennsylvania Avenue Northwest"],
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
    "lines": ["1600 Pennsylvania Avenue Northwest"],
    "zip": "DC 20500",
    "city": "Washington",
    "country": "USA"
  },
  "votes": "lots"
};

describe('Tests work', function() {
  it('10 should equal 10', function() {
    assert.equal(10, 10);
  })
})

describe('validateSchema should work for simple object', () => {
  const validated = validateSchema(barack, simpleSchema)

  it('Should return an object', () => {
    assert.isObject(validated)
  })

  it('Should not have any errors', () => {
    assert.isEmpty(validated.errors)
  })
})

describe('validateSchema should fail when field type is wrong', () => {
  const validated = validateSchema(badBarack, simpleSchema)

  it('Should return an object', () => {
    assert.isObject(validated)
  })

  it('Should have one error', () => {
    assert.equal(1, validated.errors.length)
  })
})

describe('single field validator works', () => {
  const schema = {
    type: "string"
  }
  it('Should pass when passed string', () => {
    const validated = validateSchema("a string", schema)
    assert.isObject(validated)
    assert.equal(validated.errors.length, 0)
  })

  it('Should fail when passed an integer', () => {
    const validated = validateSchema(11, schema)
    assert.isObject(validated)
    assert.equal(validated.errors.length, 1)
  })
})

describe('Validate schema should pass for a valid dataResource config object -- CKAN example', () => {
  const CKANResourceConfig = {
    title: "A title",
    identifier: "123",
    dataFormat: "ckan",
    metadataFormat: "ckan",
    metadataLocation: "a url",
    resourceLocation: "a url"
  }
  const dataResourceSchema = schemas.dataResourceDefinition

  const validated = validateSchema(CKANResourceConfig, dataResourceSchema)

  it('Should return a validator response object', () => assert.isObject(validated))

  it('Validator response object should have an instance object', () => assert.isObject(validated.instance))

  it('Should have an empty error array', () => assert.equal(validated.errors.length, 0))
})

describe('Validate schema should fail for an invalid dataResource config object -- CKAN example', () => {
  const CKANResourceConfig = {
    title: "A title",
    // identifier: "123",     <-- required field missing
    dataFormat: "no", //      <-- fails enum test
    metadataFormat: "no", //  <-- fails enum test
    metadataLocation: "a url",
    resourceLocation: "a url"
  }
  const dataResourceSchema = schemas.dataResourceDefinition
  const validated = validateSchema(CKANResourceConfig, dataResourceSchema)

  it('Should return a validator response object', () => assert.isObject(validated))

  it('Validator object should contain three errors', () => {
    assert.equal(validated.errors.length, 3)
  })
})

describe('Valid dataResourceMetadata object should pass validation', () => {
  const now = Date.now()
  const schema = schemas.dataResourceMetadata
  const resourceObject = {
    id: "9a50711e-b50f-11e7-abc4-cec278b6b50a",
    imported: now,
    location: "some url here",
    description: "What a beautiful piece of data",
    sizeMB: 2046
  }
  const validated = validateSchema(resourceObject, schema)

  it('Should return a validator response object', () => assert.isObject(validated))

  it('Validator object should contain 0 errors', () => {
    assert.equal(validated.errors.length, 0)
  })
})

describe('Invalid dataResourceMetadata object should fail validation', () => {
  const now = Date.now()
  const schema = schemas.dataResourceMetadata
  const resourceObject = {
    id: "9a50711e-b50f-11e7-abc4-cec278b6b50a",
    // imported: now,  <-- required field missing
    location: "some url here",
    description: "What a beautiful piece of data",
    sizeMB: "invalid type"
  }
  const validated = validateSchema(resourceObject, schema)

  it('Should return a validator response object', () => assert.isObject(validated))

  it('Validator object should contain 2 errors', () => {
    assert.equal(validated.errors.length, 2)
  })
})
