function Messages(url) {
    this.map = {};
    this.url = url;
    this.lastId = '';
    this.timeout = 360000;
    this.channels = [];
}

Messages.prototype.subscribe = function (channel, callback) {
    if (!this.map[channel]) {
        this.map[channel] = [];
    }
    this.map[channel].push(callback);
}

Messages.prototype.execute = function () {
    var me = this;

    if (!me.map) {
        return;
    }

    for (channel in me.map) {
        me.channels.push(channel);
    }

    me._request();
}

Messages.prototype._request = function () {
    var me = this;

    Ext.Ajax.request({
        url: me.url,
        timeout: me.timeout,
        params: {
            'ch': me.channels.join(';'),
            'id': me.lastId
        },

        success: function (response) {
            var obj = Ext.JSON.decode(response.responseText);
            if (obj.data && obj.lastId) {
                me.lastId = obj.lastId;
                Ext.Array.each(obj.data, function (msg) {
                    for (channel in me.map) {
                        if (channel == msg.channel) {
                            Ext.Array.each(me.map[channel], function(callback){
                                callback(msg.data, msg.id);
                            });
                        }
                    }
                });
            }
            me._request();
        },

        failure : function(){
            me._request();
        }
    });
}