dash delivery (working name)

## overview
Dash delivery is a tool for generating complex data visualizations that can easily configure with a json / yaml file. The dd ecosystem will provide a high level of configurability as well as out-of-the-box interoperability with common data formats (see "supported formats" below)

## supported formats
ckan
dkan
jsonSchema
csv
xml
streams`
...

## use cases
open data
research data
government and civic data
analytics
telemetry

## actors
### organization
### developer
### creator
### end user 

## workflow
external data --> import adaptors --> transform adaptors <--> api <--> embedable dashboard
     [data input to system]

## Key components

### back end
#### external data source
The data source could be a file (a csv file), a service (ckan / dkan), an api (weather api), or maybe even an aggregation function that gathers data (web scraper). The data source is external to the system, but represents an input to the system. 

Steps:
Sanitize input

#### import adaptors 
Import adaptors transform external data to the dash delivery data format

Steps:
Validate data
Attach type information
Format as json

#### transform adaptors
The execution engine takes the imported data and applies the configuration to it, providing a formatted subset of the data that is useful to the front end

#### api
The api delivers

### front end

#### creation ui
The creation ui outputs allows users to output a json configuration file which can be used to instantiate an embeddable dashboard

#### embedable dashboard
The react-dash library provides an embeddable javascript application to visualize data according to configuration, and to manage user interactions (filters)

## Technology
### Open Source Components
Software components (transformers, ui, embedable dashboard) should be open source

### High availability infrastructure
Infrastructure and wiring should allow for rapid and seamless deployment of data dashboards at scale

### Stateless
Aside from account information (contact & billing information, keys, etc) the whole system should remain stateless. All information required to run a data visualization pipeline should be encapsulated in configuration or core logic
