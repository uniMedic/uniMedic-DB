const express = require('express');
const router = express.Router();

// mongodb user model
const History = require('./../models/History'); //se usara para diferenciar al medico y al paciente
const User = require('./../models/User'); //exclusivo solo para el medico

router.post('/register', (req, res) => {
	let { patientID, diagnosisID } = req.body;
	patientID = patientID.trim();
	diagnosisID = diagnosisID.trim();
	if (patientID == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		User.find({ userID: patientID, isMedic: false })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del paciente no es válido'
					});
				} else {
					History.find({ patientID: patientID })
						.then((result) => {
							if (result.length != 0) {
								res.json({
									status: 'FAILED',
									message: 'El ID del paciente ya existe en el historial'
								});
							} else {
								newHistory = new History({
									patientID,
									diagnosisID // ARRAY (se le pasa el  primer elemento)
								});
								newHistory
									.save()
									.then((result) => {
										res.json({
											status: 'SUCCESS',
											message: 'Historial registrado satisfactoriamente'
										});
									})
									.catch((err) => {
										res.json({
											status: 'FAILED',
											message: 'No se ha podido guardar el nuevo historial'
										});
									});
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'Ocurrió un error mientras se comprobaba la existencia del ID del paciente en la colección Historial!'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el ID del paciente en la colección Usuarios!'
				});
			});
	}
});

router.post('/update', (req, res) => {
	let { patientID, diagnosisID } = req.body;
	patientID = patientID.trim();
	diagnosisID = diagnosisID.trim();
	if (patientID == '' || diagnosisID == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		User.find({ userID: patientID, isMedic: false })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del paciente no es válido'
					});
				} else {
					History.find({ patientID: patientID, diagnosisID: diagnosisID })
						.then((result) => {
							if (result.length != 0) {
								res.json({
									status: 'FAILED',
									message: 'El diagnóstico ID ya existe para este paciente, no debe repetirse!'
								});
							} else {
								// actualizamos el historial del paciente con el nuevo diagnóstico
								// notar que pasamos el índice 0 porque solo pasaremos un arreglo de 1 elemento
								History.findOneAndUpdate(
									{ patientID: patientID },
									{ $push: { diagnosisID: diagnosisID } },
									{ new: true },
									(err, doc) => {
										if (err) {
											res.json({
												status: 'FAILED',
												message:
													'Se produjo un error al verificar si había un usuario existente.'
											});
										}
										res.json({
											status: 'SUCCESS',
											message: 'Se actualizó correctamente el historial del paciente',
											data: doc
										});
									}
								);
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'se produjo un error al momento de verificar los datos del paciente en la colección Historial!'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el id del paciente en la colección Usuarios!'
				});
			});
	}
});

module.exports = router;
