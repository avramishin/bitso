Ext.define('SS.parameters.GridStore', {
  extend: 'Ext.data.Store',
  model: 'SS.parameters.GridModel',
  remoteSort: true,
  pageSize: 100,
  sorters: [
    {
      property: 'id',
      direction: 'DESC',
    },
  ],
});
