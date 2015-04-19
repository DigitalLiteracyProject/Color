var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    uniqueCuid: {type: String, required: true, unique: true, index: true},
    firstName: {type: String, default: "", unique: false, index: true},
    lastName: {type: String, default: "", unique: false, index: true},
    fullName: {type: String, default: "", unique: false, index: true},
    username: {type: String, default: "", unique: false, index: true},
    email: {type: String, default: "", unique: false, index: true},
    password: {type: String, default: "", unique: false, index: true},
    registrationDate: {type: Date, default: Date.now, unique: false, index: true},
    isRegistered: {type: String, default: "no", unique: false, index: true}
});

module.exports = userSchema;