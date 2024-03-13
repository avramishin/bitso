Ext.define('SS.parameters.GridModel', {
  extend: 'Ext.data.Model',
  idProperty: 'name',
  fields: [
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'value',
      type: 'string',
    },
  ],
  proxy: {
    type: 'rest',
    format: '',
    appendId: false,
    url: 'v1/parameters',
    reader: {
      type: 'json',
      root: 'items',
      totalProperty: 'total',
    },
  },
});
