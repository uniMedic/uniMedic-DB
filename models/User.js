const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userID: String,
	dateOfBirth: Date,
	direction: String,
	email: String,
	hospital: String,
	isMedic: Boolean,
	name: String,
	password: String,
	profileImage: String,
	speciality: String,
	timeContract: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
