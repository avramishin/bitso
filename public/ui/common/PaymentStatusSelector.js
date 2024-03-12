Ext.define('SS.common.PaymentStatusSelector', {
  extend: 'Ext.form.ComboBox',
  fieldLabel: 'Payment Type',
  alias: 'widget.common.PaymentStatusSelector',
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
          value: 'new',
          title: 'NEW',
        },
        {
          value: 'pending',
          title: 'PENDING',
        },
        {
          value: 'completed',
          title: 'COMPLETED',
        },
        {
          value: 'rejected',
          title: 'REJECTED',
        },
      ],
    });
    me.callParent(arguments);
  },
});
