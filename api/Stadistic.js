const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User'); //se usara para diferenciar al medico y al paciente
const Stadistic = require('./../models/Stadistic'); //exclusivo solo para el medico

router.post('/register', (req, res) => {
	let { medicID, disponibility, demandability, expertise } = req.body;

	medicID = medicID.trim();
	disponibility = disponibility.trim();
	demandability = demandability.trim();
	expertise = expertise.trim();
	successPatientsID = '';
	waitingPatientsID = '';

	if (medicID == '' || disponibility == '' || demandability == '' || expertise == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else if (disponibility < 0 || demandability < 0 || expertise < 0) {
		res.json({
			status: 'FAILED',
			message: 'Algún campo de las barras circulares tiene un campo negativo'
		});
	} else {
		User.find({ userID: medicID, isMedic: true })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del médico no es válido'
					});
				} else {
					Stadistic.find({ medicID: medicID })
						.then((result) => {
							if (result.length != 0) {
								res.json({
									status: 'FAILED',
									message: 'El ID del médico ya existe en la colección Estadística'
								});
							} else {
								newStadistic = new Stadistic({
									medicID,
									disponibility,
									demandability,
									expertise,
									successPatientsID,
									waitingPatientsID
								});
								newStadistic
									.save()
									.then((result) => {
										res.json({
											status: 'SUCCESS',
											message: 'Estadística del médico registrada satisfactoriamente'
										});
									})
									.catch((err) => {
										res.json({
											status: 'FAILED',
											message: 'No se ha podido guardar la nueva estadística'
										});
									});
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'Ocurrió un error mientras se comprobaba la existencia del ID del médico en la colección Estadística!'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el ID del médico en la colección Usuarios!'
				});
			});
	}
});

router.post('/updateCircurlarStats', (req, res) => {
	let { medicID, disponibility, demandability, expertise } = req.body;

	medicID = medicID.trim();
	disponibility = disponibility.trim();
	demandability = demandability.trim();
	expertise = expertise.trim();

	if (medicID == '' || disponibility == '' || demandability == '' || expertise == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else if (disponibility < 0 || demandability < 0 || expertise < 0) {
		res.json({
			status: 'FAILED',
			message: 'Algún campo de las barras circulares tiene un campo negativo'
		});
	} else {
		User.find({ userID: medicID, isMedic: true })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del médico no es válido'
					});
				} else {
					Stadistic.findOneAndUpdate(
						{ medicID },
						{ $set: { disponibility, demandability, expertise } },
						{ new: true },
						(err, doc) => {
							if (err) {
								res.json({
									status: 'FAILED',
									message:
										'Se produjo un error al verificar si existía la estadística para dicho médico'
								});
							}
							res.json({
								status: 'SUCCESS',
								message: 'Inicio de sesión satisfactorio',
								data: doc
							});
						}
					);
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el ID del médico en la colección Usuarios!'
				});
			});
	}
});

router.post('/addWaitingPatient', (req, res) => {
	let { medicID, waitingPatientID } = req.body;

	medicID = medicID.trim();
	waitingPatientID = waitingPatientID.trim();

	if (medicID == '' || waitingPatientID == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		User.find({ userID: medicID, isMedic: true })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del médico no es válido'
					});
				} else {
					User.find({ userID: waitingPatientID })
						.then((result) => {
							if (result.length == 0) {
								res.json({
									status: 'FAILED',
									message: 'El ID del PACIENTE ESPERA no existe en la colección Usuarios!'
								});
							} else {
								Stadistic.find({ medicID, successPatientsID: waitingPatientID })
									.then((result) => {
										if (result.length != 0) {
											res.json({
												status: 'FAILED',
												message: 'El ID del PACIENTE ESPERA ya existe en la lista success!'
											});
										} else {
											Stadistic.find({ medicID, waitingPatientsID: waitingPatientID })
												.then((resultWaitingPatient) => {
													if (resultWaitingPatient.length != 0) {
														res.json({
															status: 'FAILED',
															message:
																'El ID del PACIENTE ESPERA ya existe en la lista de espera!'
														});
													} else {
														Stadistic.findOneAndUpdate(
															{ medicID: medicID },
															{
																$push: { waitingPatientsID: waitingPatientID }
															},
															{ new: true },
															(err, doc) => {
																if (err) {
																	res.json({
																		status: 'FAILED',
																		message:
																			'Se produjo un error al agregar un PACIENTE ESPERA a la lista del médico'
																	});
																}
																res.json({
																	status: 'SUCCESS',
																	message:
																		'PACIENTE ESPERA añadido satisfactoriamente',
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
															'Se ha producido un error al tratar de buscar el PACIENTE ESPERA en la lista de espera!'
													});
												});
										}
									})
									.catch((err) => {
										res.json({
											status: 'FAILED',
											message:
												'Ocurrió un error al intentar buscar al paciente en la lista success!'
										});
									});
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'se produjo un error al momento de verificar ID del PACIENTE ESPERA en la colección Usuarios!'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el ID del médico en la colección Usuarios!'
				});
			});
	}
});

router.post('/changeStateWaitingPatient', (req, res) => {
	let { medicID, waitingPatientID } = req.body;

	medicID = medicID.trim();
	waitingPatientID = waitingPatientID.trim();

	if (medicID == '' || waitingPatientID == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else {
		User.find({ userID: medicID, isMedic: true })
			.then((result) => {
				if (result.length == 0) {
					res.json({
						status: 'FAILED',
						message: 'El ID del médico no es válido'
					});
				} else {
					User.find({ userID: waitingPatientID })
						.then((result) => {
							if (result.length == 0) {
								res.json({
									status: 'FAILED',
									message: 'El ID del PACIENTE SUCCESS no existe en la colección Usuarios!'
								});
							} else {
								Stadistic.find({ medicID, successPatientsID: waitingPatientID })
									.then((result) => {
										if (result.length != 0) {
											res.json({
												status: 'FAILED',
												message: 'El ID del PACIENTE ESPERA ya existe en la lista success!'
											});
										} else {
											Stadistic.findOneAndUpdate(
												{ medicID },
												{
													$pull: { waitingPatientsID: waitingPatientID },
													$push: { successPatientsID: waitingPatientID }
												},
												{ new: true },
												(err, doc) => {
													if (err) {
														res.json({
															status: 'FAILED',
															message:
																'Se produjo un error al agregar un PACIENTE SUCCESS a la lista del médico'
														});
													}
													res.json({
														status: 'SUCCESS',
														message: 'PACIENTE SUCCESS añadido satisfactoriamente',
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
												'se produjo un error al momento de verificar si PACIENTE ESPERA se encuentra en la lista SUCCESS!'
										});
									});
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'se produjo un error al momento de verificar ID del PACIENTE SUCCESS en la colección Usuarios!'
							});
						});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'se produjo un error al momento de verificar el ID del médico en la colección Usuarios!'
				});
			});
	}
});

router.post('/data', function(req, res) {
	let { medicID } = req.body;

	Stadistic.find({ medicID }, function(err, collection) {
		if (err) {
			console.log(err);
		} else {
			//res.render("page", {collection: collection});
			res.json({
				status: 'SUCCESS',
				message: 'Obtención satisfactoria de las estadísticas del médico',
				data: collection[0]
			});
		}
	});
});

module.exports = router;
