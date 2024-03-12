Ext.define('SS.payments.GridModel', {
  extend: 'Ext.data.Model',
  idProperty: 'id',
  fields: [
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'exchange',
      type: 'string',
    },
    {
      name: 'exchange_payment_id',
      type: 'string',
    },
    {
      name: 'exchange_user_id',
      type: 'string',
    },
    {
      name: 'bitso_payment_id',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'status',
      type: 'string',
    },
    {
      name: 'currency',
      type: 'string',
    },
    {
      name: 'amount',
      type: 'string',
    },
    {
      name: 'method_name',
      type: 'string',
    },
    {
      name: 'numeric_ref',
      type: 'string',
    },
    {
      name: 'notes_ref',
      type: 'string',
    },
    {
      name: 'rfc',
      type: 'string',
    },
    {
      name: 'clabe',
      type: 'string',
    },
    {
      name: 'bank_name',
      type: 'string',
    },
    {
      name: 'beneficiary',
      type: 'string',
    },
    {
      name: 'version',
      type: 'string',
    },
    {
      name: 'created_at',
      type: 'string',
    },
    {
      name: 'created_by',
      type: 'string',
    },
    {
      name: 'updated_at',
      type: 'string',
    },
    {
      name: 'updated_by',
      type: 'string',
    },
  ],
  proxy: {
    type: 'rest',
    format: '',
    appendId: false,
    url: 'v1/payments',
    reader: {
      type: 'json',
      root: 'items',
      totalProperty: 'total',
    },
  },
});
