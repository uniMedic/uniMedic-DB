const express = require('express');
const fs = require('fs');
const pdf = require('html-pdf');
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
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del diagnóstico NO se encuentra registrado en la colección Historial!'
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
						message:
							'El ID del diagnóstico NO se encuentra registrado en la colección Historial, IMPOSIBLE ACTUALIZAR!'
					});
				} else {
					// en caso no pongamos un médico
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
						// validar la existencia del médico
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

router.get('/lastDiagnosis', function(req, res) {
	const patientID = req.query.patientID;
	History.findOne({ patientID })
		.then((result) => {
			//obtenemos el último diagnóstico del paciente registrado en historial
			const diagnosisID = result.diagnosisID[result.diagnosisID.length - 1];
			console.log(`Obteniendo último diagnóstico '${diagnosisID}' del paciente ${patientID}`);
			if (result == 0) {
				res.json({
					status: 'FAILED',
					message: 'El ID del paciente no existe en el Historial!'
				});
			} else {
				Diagnosis.findOne({ diagnosisID })
					.then((result) => {
						if (result.length == 0) {
							res.json({
								status: 'FAILED',
								message: 'Diagnóstico no encontrado!'
							});
						} else {
							res.json({
								status: 'SUCCESS',
								message: 'Obtención satisfactoria del último diagnóstico',
								data: result
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
				message: 'Error al intentar validar el ID del paciente en la colección Historial!'
			});
		});
});

router.get('/downloadPDF', function(req, res) {
	const patientID = req.query.patientID;
	const patientName = String(req.query.patientName).replace("%20", / /g);
	const patientAge = req.query.patientAge;

	const filename = `./api/diagnosisPDF/diagnosis${patientID}.pdf`;

	console.log('Generando PDF..');

	History.findOne({ patientID })
		.then((result) => {
			//console.log(result);
			//obtenemos el último diagnóstico del paciente registrado en historial
			const diagnosisID = result.diagnosisID[result.diagnosisID.length - 1];
			console.log(`Obteniendo último diagnóstico '${diagnosisID}' del paciente ${patientID}`);
			if (result == 0) {
				res.json({
					status: 'FAILED',
					message: 'El ID del paciente no existe en el Historial!'
				});
			} else {
				Diagnosis.findOne({ diagnosisID })
					.then((result) => {
						if (result.length == 0) {
							res.json({
								status: 'FAILED',
								message:
									'El ID del diagnóstico NO se encuentra registrado en la colección Diagnósticos!'
							});
						} else {
							console.log(`Diagnóstico ${result.diagnosisID} obtenido`);
							var medicValidatorName = 'N/A';

							if (result.medicValidatorID != '') {
								User.findOne({ userID: result.medicValidatorID })
									.then((resultUser) => {
										medicValidatorName = resultUser.name;
									})
									.catch((err) => {
										console.log('Error al intentar obtener el nombre del médico');
									});
							}

							const content = `
							<!doctype html>
							<html>
							
							<head>
							  <!-- Required meta tags -->
							  <meta charset="utf-8">
							  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
							  <!-- Bootstrap CSS -->
							  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
								integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
							  <!-- Font Awesome -->
							  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
							  <!-- Custom Style -->
							  <title>Diagnostico</title>
							</head>
							
							<body>
							  <div class="my-5 page" size="A4">
								<div class="p-5">
								  <section class="header">
									<div id="logo", style="border:2px solid #1a1f5e; border-radius: 30px;  width: 100%; margin: 0 auto; padding-bottom: 100px;">
											<h2 style="text-align: right; margin-right: 20px; margin-top: 22px; color: #1a1f5e; width: 100px; float: left; 		margin-left: 315px; font-weight: bold; font-size: 26;">
												uniMedic
										  	</h2>
										  <img src="https://i.imgur.com/HpwhC9H.png" style="width: 170px;
									float: right; margin-right: 270px; margin-top: 10px;" />
									</div>
									<div id="titulo" style="padding-top: 20px;">
									  <h2 style="text-align: center">DIAGNÓSTICO MÉDICO</h2>
									</div>
								  </section>
								  <section class="information mt-5">
									<div class="col-10" style="border-top:2px solid #ddd; border-bottom:2px solid #ddd; padding-top: 7px;">
									  <div class="row bb pb-3" style="padding-top: 7px; padding-bottom: 6px;">
										<div class="col-7">
										  <p class="content">
											<b>Nombre del paciente:</b> ${patientName}<br>
											<b>Edad:</b> ${patientAge}<br>
											<b>Autoría:</b> App uniMedic
										  </p>
										</div>
										<div class="col-5">
										  <p class="content"> 
											<b>Fecha del diagnóstico:</b> <br>${result.dateOfDiagnosis}<br> 
											<b>Médico validador:</b> ${medicValidatorName}
										  </p>
										</div>
									  </div>
									</div>
								  </section>
								  <section class="details">
									<p style="width:19cm; text-align: center; padding-top: 1.5cm">
									  <b>RESULTADO DE DIAGNÓSTICO</b>
									</p>
									<p class="diagnosis" style="width: 19cm;">
									  ${result.textDiagnosis}
									</p>
									<p style="width:19cm; text-align: center; padding-top: 1cm">
										<b>OBSERVACIONES ADICIONALES</b>
									</p>
									<div style="align-items: center;">
									  <img src="data:image/png;base64, ${result.imageDiagnosis}" alt="Imagen diagnóstico" />
									</div>
							
									<div style="width:19cm; height:8cm; border-bottom:2px solid #ddd;"></div>
								  </section>
								  <section class="footer">
									<p style="width:19cm; text-align: left;">Los resultados obtenidos por uniMedic están basados en novedosas
									  técnicas de Deep
									  Learning. <br> Aplicación disponible en móvil y web. </p>
								  </section>
								</div>
							  </div>
							</body>
							</html>
							`;
							const path = __dirname + `/diagnosisPDF/diagnosis${patientID}.pdf`;

							pdf.create(content).toFile(filename, function(err, resp) {
								if (err) {
									console.log('PDF no generado ', err);
								} else {
									console.log('PDF generado!');
									console.log('\nABRIENDO PDF..');
									res.contentType('application/pdf');
									fs.createReadStream(path).pipe(res);
								}
							});

							while (!fs.existsSync(filename)) {
								process.stdout.write('Esperando disponibilidad del PDF..');
								process.stdout.clearLine();
								process.stdout.cursorTo(0);
							}
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
				message: 'Error al intentar validar el ID del paciente en la colección Historial!'
			});
		});
});

module.exports = router;
