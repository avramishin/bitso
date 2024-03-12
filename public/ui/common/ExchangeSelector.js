Ext.define('SS.common.ExchangeSelector', {
  extend: 'Ext.form.field.ComboBox',
  fieldLabel: 'Exchange',
  queryMode: 'local',
  valueField: 'exchange',
  displayField: 'exchange',
  editable: false,
  alias: 'widget.common.ExchangeSelector',
  initComponent: function () {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields: ['exchange'],
      proxy: {
        type: 'ajax',
        url: 'v1/exchanges',
        reader: {
          type: 'json',
          root: 'items',
        },
      },
      autoLoad: true,
    });
    me.callParent(arguments);
  },
});
