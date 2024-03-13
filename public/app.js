Ext.application({
  name: 'SS',
  appFolder: 'ui',

  requires: ['SS.payments.Grid', 'SS.parameters.Grid'],

  lastCtxMenu: null,

  ctxMenu: function (init) {
    var me = this;
    if (me.lastCtxMenu) {
      me.lastCtxMenu.destroy();
    }
    me.lastCtxMenu = Ext.create('Ext.menu.Menu', init);
    return me.lastCtxMenu;
  },

  launch: function () {
    var me = this;
    window.SS = me;

    Ext.create('Ext.Viewport', {
      layout: {
        type: 'border',
      },

      items: [
        {
          region: 'center',
          title: 'Bitso Payments',
          id: 'paymentsGrid',
          xtype: 'payments.Grid',
          border: 1,
          layout: 'fit',
        },
        {
          region: 'south',
          title: 'Parameters',
          id: 'parametersGrid',
          xtype: 'parameters.Grid',
          height: '35%',
          split: true,
        },
      ],
    });
  },
});
