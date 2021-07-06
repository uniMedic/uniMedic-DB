const express = require('express');
const app = express();
//const pdf = require('express-pdf');
const path = require('path');
const router = express.Router();

// mongodb user model
const History = require('./../models/History');
const User = require('./../models/User');
const Diagnosis = require('./../models/Diagnosis');

router.post('/register', (req, res) => {
	let { diagnosisID, textDiagnosis, imageDiagnosis, dateOfDiagnosis, medicValidatorID } = req.body;
	diagnosisID = diagnosisID.trim();
	textDiagnosis = textDiagnosis.trim();
	imageDiagnosis = imageDiagnosis.trim();
	dateOfDiagnosis = dateOfDiagnosis.trim();
	medicValidatorID = medicValidatorID.trim();

	if (diagnosisID == '' || textDiagnosis == '' || dateOfDiagnosis == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		History.find({ diagnosisID: diagnosisID })
			.then((result) => {
				if (result.length != 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del diagnóstico ya se encuentra registrado en la colección Historial!'
					});
				} else {
					newDiagnosis = new Diagnosis({
						diagnosisID,
						textDiagnosis,
						imageDiagnosis,
						dateOfDiagnosis,
						medicValidatorID
					});
					newDiagnosis
						.save()
						.then((result) => {
							res.json({
								status: 'SUCCESS',
								message: 'Diagnóstico registrado satisfactoriamente'
							});
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message: 'No se ha podido guardar el nuevo diagnóstico'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message:
						'se produjo un error al momento de verificar el ID del diagnóstico en la colección Historial!'
				});
			});
	}
});

router.post('/update', (req, res) => {
	let { diagnosisID, textDiagnosis, imageDiagnosis, dateOfDiagnosis, medicValidatorID } = req.body;
	diagnosisID = diagnosisID.trim();
	textDiagnosis = textDiagnosis.trim();
	imageDiagnosis = imageDiagnosis.trim();
	dateOfDiagnosis = dateOfDiagnosis.trim();
	medicValidatorID = medicValidatorID.trim();

	if (diagnosisID == '' || textDiagnosis == '' || dateOfDiagnosis == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		History.find({ diagnosisID: diagnosisID })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del diagnóstico NO se encuentra registrado en la colección Historial, IMPOSIBLE ACTUALIZAR!'
					});
				} else {
					if (medicValidatorID == '') {
						Diagnosis.findOneAndUpdate(
							{ diagnosisID: diagnosisID },
							{
								textDiagnosis: textDiagnosis,
								dateOfDiagnosis: dateOfDiagnosis,
								medicValidatorID: medicValidatorID
							}
						)
							.then((result) => {
								if (result.length == 0) {
									res.json({
										status: 'FAILED',
										message:
											'El ID del diagnóstico NO se encuentra registrado en la colección Historial, imposible actualizar!'
									});
								} else {
									res.json({
										status: 'SUCCESS',
										message: 'Diagnóstico actualizado satisfactoriamente'
									});
								}
							})
							.catch((err) => {
								res.json({
									status: 'FAILED',
									message:
										'se produjo un error al momento de verificar el ID del diagnóstico en la colección Diagnóstico!'
								});
							});
					} else {
						User.find({ userID: medicValidatorID, isMedic: true })
							.then((result) => {
								if (result == 0) {
									res.json({
										status: 'FAILED',
										message: 'El ID del médico validador no existe en la colección Usuarios!'
									});
								} else {
									Diagnosis.findOneAndUpdate(
										{ diagnosisID: diagnosisID },
										{
											textDiagnosis: textDiagnosis,
											dateOfDiagnosis: dateOfDiagnosis,
											medicValidatorID: medicValidatorID
										}
									)
										.then((result) => {
											if (result.length == 0) {
												res.json({
													status: 'FAILED',
													message:
														'El ID del diagnóstico NO se encuentra registrado en la colección Historial, imposible actualizar!'
												});
											} else {
												res.json({
													status: 'SUCCESS',
													message:
														'Diagnóstico actualizado satisfactoriamente (con médico validador)'
												});
											}
										})
										.catch((err) => {
											res.json({
												status: 'FAILED',
												message:
													'se produjo un error al momento de verificar el ID del diagnóstico en la colección Diagnóstico!'
											});
										});
								}
							})
							.catch((error) => {
								res.json({
									status: 'FAILED',
									message: 'Error al intentar validar el ID del médico validador!'
								});
							});
					}
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message:
						'se produjo un error al momento de verificar el ID del diagnóstico en la colección Historial!'
				});
			});
	}
});
//previously app.use(pdf())
//app.use(pdf); // or you can app.use(require('express-pdf'));
//app.use(express.static('public'))
router.get('/downloadPdf', function(req, res) {
	//let id = req.body;
	//diagnosisID = diagnosisID.trim();
	//res.download(__dirname + 'documento.json');
//  res.download('C:/Users/ACER NITRO 5/Desktop/uniMedic-DB/api/template.html', 'template.html');
	const pdf = require('html-pdf');
	const content = `
	<h1>Título de prueba</h1>
	<p>Parrafo de prueba</p>
	`;

	pdf.create(content).toFile('./html-pdf.pdf', function(err, res){
		if(err){
			//console.log(err);
			res.json({
				status: 'FAILED',
				message: 'Pdf no generado'
			});
		} else {
			res.json({
				status: 'SUCCESS',
				message: 'Pdf generado'
			});
		}
	});
	res.json({
		status: 'FAILED',
		message: 'Error'
	});
	/* //manera alternativa a pdf.create...
	res.pdfFromHTML({
		filename: 'generated.pdf',
		html: path.resolve(__dirname, './template.html')
	});
	*/
   /* res.pdfFromHTML({
        filename: 'generated.pdf',
        html: path.resolve(__dirname, './template.html')
    });
	*/
});

module.exports = router;
