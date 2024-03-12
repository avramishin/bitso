Ext.define('SS.payments.EditWithdrawalWindow', {
  extend: 'Ext.window.Window',
  iconCls: 'html-icon',
  requires: ['SS.payments.EditWithdrawalForm'],
  width: 640,
  height: 540,
  autoHeight: true,
  layout: 'fit',
  closable: true,
  modal: true,
  record: {
    exchange: 'DEV',
  },

  initComponent: function () {
    var me = this;

    me.form = Ext.create('SS.payments.EditWithdrawalForm', {
      window: me,
    });

    me.items = [me.form];

    me.callParent(arguments);

    if (me.record.id) {
      me.setTitle('Edit Withdrawal');
      me.form.setLoading(true);
    } else {
      me.setTitle('Create Withdrawal');
    }
  },
});
