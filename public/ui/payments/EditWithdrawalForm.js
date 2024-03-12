Ext.define('SS.payments.EditWithdrawalForm', {
  extend: 'Ext.form.Panel',
  bodyPadding: 5,
  window: null,
  layout: 'anchor',
  border: 0,
  defaultType: 'textfield',

  fieldDefaults: {
    labelAlign: 'top',
    labelWidth: 130,
    msgTarget: 'qtip',
  },

  requires: [
    'SS.common.ExchangeSelector',
    'SS.common.ExchangeUserSelector',
    'SS.common.ExchangeCurrencySelector',
    'SS.common.PaymentMethodSelector',
    'SS.common.PaymentStatusSelector',
  ],

  initComponent: function () {
    const me = this;

    me.items = [
      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            xtype: 'common.ExchangeSelector',
            fieldLabel: 'Exchange',
            name: 'exchange',
            flex: 1,
            labelSeparator: '',
            itemId: 'exchangeSelector',
            allowBlank: false,
          },
          {
            xtype: 'common.ExchangeUserSelector',
            fieldLabel: 'Trader',
            name: 'exchange_user_id',
            flex: 2,
            labelSeparator: '',
            margins: '0 0 0 6',
            itemId: 'exchangeUserSelector',
            allowBlank: false,
          },
        ],
      },
      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'Amount',
            name: 'amount',
            labelSeparator: '',
            flex: 1,
            allowBlank: false,
          },
          {
            xtype: 'common.ExchangeCurrencySelector',
            fieldLabel: 'Currency',
            name: 'currency',
            labelSeparator: '',
            margins: '0 0 0 6',
            flex: 1,
            allowBlank: false,
          },
        ],
      },
      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            xtype: 'common.PaymentMethodSelector',
            fieldLabel: 'Method',
            name: 'method_name',
            labelSeparator: '',
            flex: 1,
            allowBlank: false,
          },
          {
            xtype: 'common.PaymentStatusSelector',
            fieldLabel: 'Status',
            name: 'status',
            labelSeparator: '',
            margins: '0 0 0 6',
            flex: 1,
            allowBlank: false,
          },
        ],
      },
      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'Registro Federal de Contribuyentes (RFC)',
            name: 'rfc',
            labelSeparator: '',
            flex: 1,
            allowBlank: false,
          },
          {
            xtype: 'textfield',
            fieldLabel: 'Clave Bancaria Estandarizada (CLABE)',
            name: 'clabe',
            labelSeparator: '',
            flex: 1,
            allowBlank: false,
            margins: '0 0 0 6',
          },
        ],
      },

      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            xtype: 'textfield',
            fieldLabel: 'Bank (Identifier of the Bank)',
            labelSeparator: '',
            name: 'bank_name',
            flex: 1,
            allowBlank: false,
          },
          {
            fieldLabel: 'Beneficiary Full name',
            xtype: 'textfield',
            labelSeparator: '',
            name: 'beneficiary',
            flex: 1,
            margins: '0 0 0 6',
            allowBlank: false,
          },
        ],
      },

      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            fieldLabel: 'Numeric Ref',
            name: 'numeric_ref',
            labelSeparator: '',
            xtype: 'textfield',
            flex: 1,
            allowBlank: true,
          },
          {
            fieldLabel: 'Notes Ref',
            name: 'notes_ref',
            labelSeparator: '',
            xtype: 'textfield',
            margins: '0 0 0 6',
            flex: 1,
            allowBlank: true,
          },
        ],
      },

      {
        xtype: 'container',
        layout: 'hbox',
        margin: '0 0 5 0',
        items: [
          {
            fieldLabel: 'Exchange Payment ID',
            xtype: 'textfield',
            labelSeparator: '',
            flex: 1,
            name: 'exchange_payment_id',
            allowBlank: true,
          },
          {
            fieldLabel: 'Bitso Payment ID',
            xtype: 'textfield',
            labelSeparator: '',
            flex: 1,
            name: 'bitso_payment_id',
            margins: '0 0 0 6',
            allowBlank: true,
          },
        ],
      },
      {
        xtype: 'hiddenfield',
        itemid: 'id',
        name: 'id',
      },
    ];

    me.buttons = [
      {
        text: 'Cancel',
        handler: function () {
          me.window.close();
        },
      },
      {
        text: 'Save',
        formBind: true,
        handler: function () {
          var form = me.getForm();
          me.setLoading('Saving changes ... pls wait');
          if (form.isValid()) {
            const record = form.getValues();
            Ext.Ajax.request({
              url: 'v1/payments/withdrawal',
              method: record.id ? 'PATCH' : 'POST',
              jsonData: record,
              success: function () {
                me.setLoading(false);
                me.window.close();
              },
              failure: function (data) {
                me.setLoading(false);
                Ext.Msg.alert(
                  'Error while saving',
                  JSON.parse(data.responseText).message,
                );
              },
            });
          }
        },
      },
    ];

    me.callParent(arguments);

    me.getForm().setValues(me.window.record);

    me.exchangeSelector = me.down('#exchangeSelector');
    me.exchangeUserSelector = me.down('#exchangeUserSelector');

    if (me.window.record.exchange) {
      me.exchangeUserSelector.exchange = me.window.record.exchange;
    }

    me.exchangeSelector.on('change', function (combo, value) {
      me.exchangeUserSelector.exchange = value;
    });
  },
});
