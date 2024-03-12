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
        xtype: 'fieldset',
        title: 'Main Withdrawal Details',
        layout: 'anchor',
        defaults: {
          anchor: '100%',
        },
        items: [
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
                // labelSeparator: '',
                labelAlign: 'right',
                labelWidth: 80,
                itemId: 'exchangeSelector',
                allowBlank: false,
              },
              {
                xtype: 'common.ExchangeUserSelector',
                fieldLabel: 'Trader',
                name: 'exchange_user_id',
                flex: 1,
                // labelSeparator: '',
                labelAlign: 'right',
                labelWidth: 80,
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
                labelWidth: 80,
                name: 'amount',
                //labelSeparator: '',
                labelAlign: 'right',
                flex: 1,
                allowBlank: false,
              },
              {
                xtype: 'common.ExchangeCurrencySelector',
                fieldLabel: 'Currency',
                labelWidth: 80,
                name: 'currency',
                // labelSeparator: '',
                labelAlign: 'right',
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
                labelWidth: 80,
                labelAlign: 'right',
                fieldLabel: 'Bank',
                name: 'bank_name',
                flex: 1,
                allowBlank: false,
              },
              {
                fieldLabel: 'Beneficiary',
                xtype: 'textfield',
                labelWidth: 80,
                labelAlign: 'right',
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
                xtype: 'common.PaymentMethodSelector',
                fieldLabel: 'Method',
                labelWidth: 80,
                labelAlign: 'right',
                name: 'method_name',
                flex: 1,
                allowBlank: false,
              },
              {
                xtype: 'common.PaymentStatusSelector',
                fieldLabel: 'Status',
                labelWidth: 80,
                name: 'status',
                labelAlign: 'right',
                margins: '0 0 0 6',
                flex: 1,
                allowBlank: false,
              },
            ],
          },
        ],
      },

      {
        xtype: 'fieldset',
        title: 'RFC & CLABE',
        layout: 'anchor',
        defaults: {
          anchor: '100%',
        },
        items: [
          {
            xtype: 'displayfield',
            value:
              'RFC stands for Registro Federal de Contribuyentes, and the clave RFC (RFC number) is a Mexican tax identification number. A Clave Bancaria Estandarizada (CLABE) is a standard bank account number in Mexico. CLABE numbers have 18 digits, divided into 4 sections like this: AAABBBCCCCCCCCCCCD.',
          },
          {
            xtype: 'container',
            layout: 'hbox',
            margin: '0 0 10 0',
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
        ],
      },

      {
        xtype: 'fieldset',
        title: 'Optional Details',
        layout: 'anchor',
        defaults: {
          anchor: '100%',
        },
        items: [
          {
            xtype: 'container',
            layout: 'hbox',
            margin: '0 0 5 0',
            items: [
              {
                fieldLabel: 'Numeric Reference',
                name: 'numeric_ref',
                labelSeparator: '',
                xtype: 'textfield',
                flex: 1,
                allowBlank: true,
              },
              {
                fieldLabel: 'Notes Reference',
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
            margin: '0 0 10 0',
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
