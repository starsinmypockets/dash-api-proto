{
  title: "Philly 311 Data Visualized",
  backend: "cartodb",
  dataResources: [
    {
      resourceHandle: "byServiceName",
      resourceType: "cartodb",
      url: "https://phl.carto.com/api/v2/sql",
      query: "?q=SELECT%20service_name,%20COUNT(cartodb_id)%20FROM%20public_cases_fc%20GROUP%20BY%20service_name"
    }
  ],
  regions: [
    {
      id: "region-1",
      className: "row",
      children: [
        {
          type: 'Chart',
          header: 'Request Type',
          className: 'col-md-6',
          iconClass: 'fa fa-tree',
          dataFields: [
            {
              fieldName: 'x',
              dataResource: 'byServiceName',
              dataResourceField: 'service_name'
            },
            {
              fieldName: 'y',
              dataResource: 'byServiceName',
              dataResourceField: 'count'
            },
          ],
          settings: {
            type: 'pieChart',
            x: 'x',
            y: 'y'
          }
        },
        {
          type: 'Chart',
          header: 'Request Type ][',
          className: 'col-md-6',
          iconClass: 'fa fa-car',
          dataFields: [
            {
              fieldName: 'x',
              dataResource: 'byServiceName',
              dataResourceField: 'service_name'
            },
            {
              fieldName: 'y',
              dataResource: 'byServiceName',
              dataResourceField: 'count'
            },
          ],
          settings: {
            type: 'pieChart',
            x: 'x',
            y: 'y'
          }
        },
      ]
    }
  ]
}
