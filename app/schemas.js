const uuid = module.exports.uuid = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"

module.exports.schema = {
  // configuration options for dataResources to be imported
  dataResourceDefinition: {
    title: "dataResourceDefinition",
    type: "object",
    properties: {
      title: {
        type: "string",
        required: true
      },
      identifier: {
        type: "string",
        required: true
      }, // unique
      dataFormat: {
        type: {
          enum: ["ckan", "dkan", "csv", "json"],
          required: true
        }
      },
      metadataFormat: {
        type: {
          enum: ["ckan", "dkan", "csv", "json"],
          required: true
        }
      },
      metadataLocation: {
        type: "string",
        required: true
      },
      resourceLocation: {
        type: "string",
        required: true
      },
      description: {
        type: "string"
      }
    },
  },

  // generated metadata for all tracked data resources
  dataResourceMetadata: {
    title: "dataResourceMetadata",
    properties: {
      dataResourceDefinition: {type: "string"}, 
      id: {
        type: "string",
        pattern: uuid,
        required: true
      },
      revisionId: {
        type: "string",
        pattern: uuid
      },
      imported: {
        type: "number",
        required: true
      },
      updated: {
        type: "number"
      },
      location: {
        type: "string",
        required: true
      },
      description: {
        type: "string"
      },
      sizeMB: {
        type: "number"
      },
      records: {
        type: "number"
      },
      nativeMetadata: {
        type: "string"
      }
    }
  }
}
