const { Schema, model } = require('mongoose');

// Para guardar una imagen en mongoDB
// https://stackoverflow.com/questions/29780733/store-an-image-in-mongodb-using-node-js-express-and-mongoose

const diagnosticSchema = new Schema({
	diagnosticID: {
		type: String,
		required: true
	},
	textDiagnostic: {
		type: String
	},
	imageDiagnostic: {
		data: Buffer,
		contentType: String
	},
	dateOfDiagnostic: {
		type: Date
	},
	//agregado para vincular con el paciente
	patientID: {
		type: String
	}
});
module.exports = model('Diagnostic', diagnosticSchema);
