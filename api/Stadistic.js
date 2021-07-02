const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User'); //se usara para diferenciar al medico y al paciente
const Stadistic = require('./../models/Stadistic'); //exclusivo solo para el medico

router.post('/register', (req, res) => {
	let { medicID, timeOfService, specialism, hospital, patientsID, stars } = req.body;

	medicID = medicID.trim();
	timeOfService = timeOfService.trim();
	specialism = specialism.trim();
	hospital = hospital.trim();
	stars = stars.trim();
	patientsID = patientsID.trim();

	if (medicID == '' || timeOfService == '' || specialism == '' || hospital == '' || patientsID == '' || stars == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else if (timeOfService <= 0 || timeOfService >= 50) {
		res.json({
			status: 'FAILED',
			message: 'Tiempo inválido'
		});
	} else if (stars > 6 || stars < 1) {
		res.json({
			status: 'FAILED',
			message: 'Clasificación de estrellas errónea'
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
									timeOfService,
									specialism,
									hospital,
									patientsID,
									stars
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

router.post('/update', (req, res) => {
	let { medicID, timeOfService, specialism, hospital, patientsID, stars } = req.body;

	medicID = medicID.trim();
	timeOfService = timeOfService.trim();
	specialism = specialism.trim();
	hospital = hospital.trim();
	stars = stars.trim();
	patientsID = patientsID.trim();

	if (medicID == '' || timeOfService == '' || specialism == '' || hospital == '' || patientsID == '' || stars == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else if (timeOfService <= 0 || timeOfService >= 50) {
		res.json({
			status: 'FAILED',
			message: 'Tiempo inválido'
		});
	} else if (stars > 6 || stars < 1) {
		res.json({
			status: 'FAILED',
			message: 'Clasificación de estrellas errónea'
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
					User.find({ userID: patientsID })
						.then((result) => {
							if (result.length == 0) {
								res.json({
									status: 'FAILED',
									message: 'El ID del paciente no existe en la colección Usuarios!'
								});
							} else {
								Stadistic.find({ medicID: medicID, patientsID: patientsID }).then((result) => {
									if (result.length == 0) {
										Stadistic.findOneAndUpdate(
											{ medicID: medicID },
											{
												timeOfService: timeOfService,
												specialism: specialism,
												hospital: hospital,
												stars: stars,
												$push: { patientsID: patientsID }
											}
										)
											.then((result) => {
												res.json({
													status: 'SUCCESS',
													message: 'Estadística actualizada satisfactoriamente (variando patientsID)',
													data: result
												});
											})
											.catch((err) => {
												res.json({
													status: 'FAILED',
													message:
														'Ha ocurrido un error mientras se actualizaban los datos (con nuevos pacientes) en la colección Estadística!'
												});
											});
									} else {
										Stadistic.findOneAndUpdate(
											{ medicID: medicID },
											{
												timeOfService: timeOfService,
												specialism: specialism,
												hospital: hospital,
												stars: stars
											}
										)
											.then((result) => {
												res.json({
													status: 'SUCCESS',
													message: 'Estadística actualizada satisfactoriamente (sin variar patientsID)',
													data: result
												});
											})
											.catch((err) => {
												res.json({
													status: 'FAILED',
													message:
														'Ha ocurrido un error mientras se actualizaban los datos en la colección Estadística!'
												});
											});
									}
								});
							}
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message:
									'se produjo un error al momento de verificar ID del paciente en la colección Usuarios!'
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

module.exports = router;
