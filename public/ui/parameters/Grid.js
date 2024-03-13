Ext.define('SS.parameters.Grid', {
  extend: 'Ext.grid.Panel',
  iconCls: 'html-icon',

  requires: ['SS.parameters.GridModel', 'SS.parameters.GridStore'],

  alias: 'widget.parameters.Grid',

  columns: [
    {
      text: 'Parameter',
      sortable: true,
      dataIndex: 'name',
      width: 200,
      menuDisabled: true,
    },
    {
      text: 'Value',
      sortable: true,
      dataIndex: 'value',
      editor: {
        allowBlank: false,
      },
      flex: 1,
      menuDisabled: true,
    },
  ],

  initComponent: function () {
    var me = this;

    me.store = Ext.create('SS.parameters.GridStore');

    me.cellEditing = new Ext.grid.plugin.CellEditing({
      clicksToEdit: 1,
      listeners: {
        afteredit: function (grid, ctx) {
          me.setLoading('Saving...');
          Ext.Ajax.request({
            url: 'v1/parameters',
            method: 'PATCH',
            jsonData: ctx.record.data,
            success: function () {
              me.setLoading(false);
              me.store.load();
            },
            failure: function (data) {
              me.setLoading(false);
              Ext.Msg.alert(
                'Error while saving',
                JSON.parse(data.responseText).message,
              );
            },
          });
        },
      },
    });
    me.plugins = [this.cellEditing];

    me.saveChanges = () => {};

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
    ];

    me.bbar = Ext.create('Ext.PagingToolbar', {
      displayInfo: true,
      store: me.store,
      displayMsg: 'Displaying parameters {0} - {1} of {2}',
      emptyMsg: 'No parameters to display',
      prependButtons: true,
      items: [
        {
          text: 'Save',
          iconCls: 'download-icon',
          scope: this,
          handler: me.saveChanges,
        },
      ],
    });

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
