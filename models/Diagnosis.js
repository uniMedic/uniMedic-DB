const { Schema, model } = require('mongoose');

// Para guardar una imagen en mongoDB
// https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose

const diagnosisSchema = new Schema({
	diagnosisID: {
		type: String,
		required: true
	},
	textDiagnosis: String,
	imageDiagnosis: [ String ],
	dateOfDiagnosis: Date,
	medicValidatorID: String
});
module.exports = model('Diagnosis', diagnosisSchema);
