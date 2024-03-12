Ext.define('SS.common.PaymentTypeSelector', {
  extend: 'Ext.form.ComboBox',
  fieldLabel: 'Payment Type',
  alias: 'widget.common.PaymentTypeSelector',
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
          value: '',
          title: 'All',
        },
        {
          value: 'deposit',
          title: 'Deposit',
        },
        {
          value: 'withdrawal',
          title: 'Withdrawal',
        },
      ],
    });
    me.callParent(arguments);
  },
});
