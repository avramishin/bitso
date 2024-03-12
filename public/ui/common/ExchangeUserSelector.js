Ext.define('SS.common.ExchangeUserSelector', {
  extend: 'Ext.form.field.ComboBox',
  fieldLabel: 'User',
  valueField: 'user_id',
  displayField: 'email',
  minChars: 3,
  autoSelect: false,
  typeAhead: true,
  editable: true,
  alias: 'widget.common.ExchangeUserSelector',
  exchange: '',
  initComponent: function () {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields: ['user_id', 'email'],
      proxy: {
        type: 'ajax',
        url: 'v1/exchanges/users',
        reader: {
          type: 'json',
          root: 'items',
        },
      },
      autoLoad: true,
    });

    me.store.on({
      beforeload: function (store, options) {
        options.params || (options.params = {});

        Ext.apply(options.params, {
          exchange: me.exchange,
        });

        if (me.getValue()) {
          Ext.apply(options.params, {
            query: me.getValue(),
          });
        }
      },
    });

    me.callParent(arguments);
  },
});
