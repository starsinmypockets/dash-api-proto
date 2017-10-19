module.exports.schema = {
  // configuration options for dataResources to be imported
  dataResourceDefinition: {
    dataFormat: "string",
    metaDataFormat: "string",
    location: "url"
  },
  // generated metadata for all tracked data resources
  dataResourceMetadata: {
    format: "string",
    definition: "dataResourceDefinition",
    id: "uuid",
    revisionId: "uuid",
    imported: "maybe date",
    updated: "maybe date",
    location: "url",
    description: "maybe string",
    sizeMB: "maybe number",
    records: "maybe number",
    nativeMetadata: "json string"
  }
}
