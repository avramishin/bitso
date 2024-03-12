Ext.define('SS.payments.Grid', {
  extend: 'Ext.grid.Panel',
  iconCls: 'html-icon',

  requires: [
    'SS.payments.GridModel',
    'SS.payments.GridStore',
    'SS.payments.EditWithdrawalWindow',
  ],

  alias: 'widget.payments.Grid',

  columns: [
    {
      text: 'ID',
      sortable: true,
      dataIndex: 'id',
      width: 60,
      menuDisabled: true,
    },
    {
      text: 'Time',
      sortable: true,
      dataIndex: 'created_at',
      width: 160,
      menuDisabled: true,
    },
    {
      text: 'Exchange',
      sortable: true,
      dataIndex: 'exchange',
      width: 100,
      menuDisabled: true,
    },
    {
      text: 'Type',
      sortable: true,
      dataIndex: 'type',
      renderer: function (value, meta) {
        return String(value).toUpperCase();
      },
      width: 100,
      menuDisabled: true,
    },
    {
      text: 'Status',
      sortable: true,
      dataIndex: 'status',
      renderer: function (value, meta) {
        return String(value).toUpperCase();
      },
      width: 100,
      menuDisabled: true,
    },
    {
      text: 'Beneficiary',
      sortable: true,
      dataIndex: 'beneficiary',
      flex: 1,
      menuDisabled: true,
    },
    {
      text: 'Currency',
      sortable: true,
      dataIndex: 'currency',
      width: 100,
      menuDisabled: true,
    },
    {
      text: 'Amount',
      sortable: true,
      dataIndex: 'amount',
      width: 100,
      menuDisabled: true,
    },
    {
      text: 'Bank',
      sortable: true,
      dataIndex: 'bank_name',
      flex: 1,
      menuDisabled: true,
    },

    {
      text: 'Method',
      sortable: true,
      dataIndex: 'method_name',
      flex: 1,
      menuDisabled: true,
    },
    {
      text: 'RFC',
      sortable: true,
      dataIndex: 'rfc',
      flex: 1,
      menuDisabled: true,
    },

    {
      text: 'CLABE',
      sortable: true,
      dataIndex: 'clabe',
      flex: 1,
      menuDisabled: true,
    },

    {
      text: 'Numeric Ref',
      sortable: true,
      dataIndex: 'numeric_ref',
      flex: 1,
      menuDisabled: true,
    },
    {
      text: 'Notes Ref',
      sortable: true,
      dataIndex: 'notes_ref',
      flex: 1,
      menuDisabled: true,
    },

    {
      xtype: 'actioncolumn',
      menuDisabled: true,
      width: 25,
      items: [
        {
          icon: 'images/icons/action.png',
          handler: function (grid, rowIndex, colIndex, item, e) {
            const record = grid.getStore().getAt(rowIndex);
            grid.getSelectionModel().select(record);
            grid.fireEvent('itemcontextmenu', grid, record, rowIndex, null, e);
          },
        },
      ],
    },
  ],

  initComponent: function () {
    var me = this;
    me.store = Ext.create('SS.payments.GridStore');
    me.tbar = [
      {
        xtype: 'textfield',
        itemId: 'filter',
        emptyText: 'Quick search ...',
        width: 350,
        listeners: {
          specialkey: function (field, e) {
            if (e.getKey() == e.ENTER) {
              me.store.load();
            }
          },
        },
      },
      {
        xtype: 'button',
        text: 'Search',
        iconCls: 'search-icon',
        handler: function () {
          me.store.load();
        },
      },
      '->',
      {
        xtype: 'button',
        text: 'Create Withdrawal',
        iconCls: 'add-icon',
        handler: function () {
          const win = Ext.create('SS.payments.EditWithdrawalWindow', {
            record: {
              exchange: 'DEV',
              status: 'new',
            },
          });

          win.on('close', function () {
            me.store.load();
          });

          win.show();
        },
      },
    ];

    me.bbar = Ext.create('Ext.PagingToolbar', {
      displayInfo: true,
      store: me.store,
      displayMsg: 'Displaying payments {0} - {1} of {2}',
      emptyMsg: 'No payments to display',
      prependButtons: true,
    });

    me.listeners = {
      itemdblclick: function (grid, record) {
        const win = Ext.create('SS.payments.EditWithdrawalWindow', {
          grid: me,
          record: record.data,
        });

        win.on('close', function () {
          grid.store.load();
        });

        win.show();
      },
      itemcontextmenu: function (grid, record, item, index, event) {
        event.stopEvent();
        var items = [
          {
            text: 'Edit',
            iconCls: 'edit-icon',
            handler: function () {
              const win = Ext.create('SS.payments.EditWithdrawalWindow', {
                grid: me,
                record: record.data,
              });

              win.on('close', function () {
                grid.store.load();
              });

              win.show();
            },
          },
        ];

        Helpers.ctxMenu({
          ignoreParentClicks: true,
          items: items,
        }).showAt(event.xy);
      },
    };

    me.callParent(arguments);
    me.nameFilter = me.getDockedItems('toolbar')[0].getComponent('filter');
    me.store.on({
      beforeload: {
        fn: function (store, options) {
          options.params || (options.params = {});
          Ext.apply(options.params, {
            filter: me.nameFilter.getValue(),
          });
        },
        scope: this,
      },

      load: function (store, records, successful) {},
    });
    me.store.load();
  },
});
