# Data Schema
The data schema should, approximately, define our data at the following levels of detail.
Ideally, we can use an existing standard for this. We should be able to provide validation with an existing schema validator.

## Dataset
```json
{
  "schemaVersion" : "int",
  "metaData" : "metadataObject",
  "data" : "[dataResourceObject]"
}
```

## Metadata object
```json
{}
```

## Data resource object
```json
{
    "record" : "[dataField]"
}
```

## Field object
```json
{
    "uuid" : "uuid",
    "type" : "string",
    "emptyVal" : "fieldObject",
    "maxLength" : "int"
}
```

