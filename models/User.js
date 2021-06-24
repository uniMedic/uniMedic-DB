const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date, 
    direction: String,
    isMedic: Boolean, 
    userID: Number, //automatically generated
});

const User = mongoose.model('User', UserSchema);

module.exports = User;