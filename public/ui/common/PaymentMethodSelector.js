Ext.define('SS.common.PaymentMethodSelector', {
  extend: 'Ext.form.ComboBox',
  fieldLabel: 'Method',
  alias: 'widget.common.PaymentMethodSelector',
  queryMode: 'local',
  displayField: 'title',
  valueField: 'value',
  editable: false,
  value: '',

  initComponent: function () {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields: ['value', 'title'],
      data: [
        {
          value: 'SPEI',
          title: 'SPEI',
        },
        {
          value: 'Debit Card',
          title: 'Debit Card',
        },
        {
          value: 'Phone number',
          title: 'Phone number',
        },
      ],
    });
    me.callParent(arguments);
  },
});
