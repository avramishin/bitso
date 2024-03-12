Ext.define('SS.payments.GridStore', {
  extend: 'Ext.data.Store',
  model: 'SS.payments.GridModel',
  remoteSort: true,
  pageSize: 100,
  sorters: [
    {
      property: 'id',
      direction: 'DESC',
    },
  ],
});
