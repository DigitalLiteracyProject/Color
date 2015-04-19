var basic = require('../functions/basic.js');
var consoleLogger = require('../functions/basic.js').consoleLogger;
var emailModule = require('../functions/email.js');
var forms = require('../functions/forms.js');

var receivedLogger = function (module) {
    var rL = require('../functions/basic.js').receivedLogger;
    rL('basic_api', module);
};

var successLogger = function (module, text) {
    var sL = require('../functions/basic.js').successLogger;
    return sL('basic_api', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('../functions/basic.js').errorLogger;
    return eL('basic_api', module, text, err);
};

module.exports = {

    contactUs: function (req, res) {
        var module = 'contactUs';
        receivedLogger(module);

        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;

        forms.validateContactUs(req, res, email, message, success);

        function success() {
            //emailModule.contactUs(email, message);

            consoleLogger(successLogger(module));
            res.status(200).send({
                notify: true,
                type: 'success',
                msg: 'Message was successfully received'
            });
        }
    }
};