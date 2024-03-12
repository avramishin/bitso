Ext.define('SS.common.ExchangeCurrencySelector', {
  extend: 'Ext.form.field.ComboBox',
  fieldLabel: 'Currency',
  queryMode: 'local',
  valueField: 'currency',
  displayField: 'currency',
  editable: false,
  alias: 'widget.common.ExchangeCurrencySelector',
  initComponent: function () {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields: ['currency'],
      data: [
        {
          currency: 'ARS',
        },
        {
          currency: 'BRL',
        },
        {
          currency: 'COP',
        },
      ],
    });
    me.callParent(arguments);
  },
});
