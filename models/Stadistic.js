const { Schema, model } = require('mongoose');

const statisticSchema = new Schema({
	medicID: {
		type: String,
		required: true
	},
	disponibility: Number,
	demandability: Number,
	expertise: Number,
	successPatientsID: [ String ],
	waitingPatientsID: [ String ]
});
module.exports = model('Stadistic', statisticSchema);
