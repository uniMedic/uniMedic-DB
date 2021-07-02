const { Schema, model } = require('mongoose');

const statisticSchema = new Schema({
	medicID: {
		type: String,
		required: true
	},
	disponibility: Number,
	demandability: Number,
	experience: Number,
	successPatientsID: {
		type: [ String ]
	},
	waitingPatientsID: {
		type: [ String ]
	}
});
module.exports = model('Stadistic', statisticSchema);
