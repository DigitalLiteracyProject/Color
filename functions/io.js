var app = require('../app.js');
var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;

module.exports = {

    //this function emits an event to the respective user
    emitToOne: function (uniqueCuid, serverEvent, content, success) {
        app.io.sockets.in(uniqueCuid).emit(serverEvent, content);
        if (success) {
            success();
        }
    },


    //this function emits an event to all connected users
    emitToAll: function (serverEvent, content, success) {
        app.io.emit(serverEvent, content);
        if (success) {
            success();
        }
    }

};