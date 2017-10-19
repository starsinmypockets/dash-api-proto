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
      }
    },
  },

  // generated metadata for all tracked data resources
  dataResourceMetadata: {
    format: "string",
    definition: "dataResourceDefinition",
    id: "uuid",
    revisionId: "uuid",
    imported: "maybe date",
    updated: "maybe date",
    location: {
      type: "string",
      format: "uri"
    },
    description: "maybe string",
    sizeMB: "maybe number",
    records: "maybe number",
    nativeMetadata: "json string"
  }
}
