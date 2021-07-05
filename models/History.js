const { Schema, model } = require('mongoose');

const HistorySchema = new Schema({
	patientID: String,
	diagnosisID: [ String ]
});
module.exports = model('History', HistorySchema);
