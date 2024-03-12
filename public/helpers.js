Helpers = {
  ctxMenu: function (init) {
    var me = this;
    if (me.lastCtxMenu) {
      me.lastCtxMenu.destroy();
    }
    me.lastCtxMenu = Ext.create('Ext.menu.Menu', init);
    return me.lastCtxMenu;
  },

  escape: function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  },
};

Ext.onReady(function () {
  // Custom vtypes
  var decpoint = '.';
  var percentRE = /^([0-9]{1,2}|100)$/;
  var unsignedRE = /^[0-9]+$/;
  var floatRE = new RegExp('^[0-9]+(\\' + decpoint + '[0-9]+)?$', '');
  var moneyRE = new RegExp('^[0-9]+(\\' + decpoint + '[0-9]{1,2})?$', '');

  Ext.apply(Ext.form.field.VTypes, {
    percent: function (val, field) {
      return percentRE.test(val);
    },

    percentText: 'Percent value should be in 0..100 range',

    uint: function (val, field) {
      return unsignedRE.test(val);
    },

    unitText: 'Unsigned value required',

    float: function (val, field) {
      return floatRE.test(val);
    },

    floatText: 'Float value required',

    money: function (val, field) {
      return moneyRE.test(val);
    },

    moneyText: 'Numeric value required',
  });
});
