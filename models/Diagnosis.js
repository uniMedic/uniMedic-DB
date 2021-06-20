const { Schema, model } = require('mongoose');

// Para guardar una imagen en mongoDB
// https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose

const diagnosisSchema = new Schema({
	DiagnosticoID: {
		type: String,
		required: true
	},
	textDiagnosis: {
		type: String
	},
	imageDiagnosis: {
		data: Buffer,
		contentType: String
	},
	dateOfDiagnosis: {
		type: Date
	}
});
module.exports = model('Diagnosis', diagnosisSchema);
