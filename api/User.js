const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
	let {
		userID,
		dateOfBirth,
		direction,
		email,
		hospital,
		isMedic,
		name,
		password,
		profileImage,
		speciality,
		timeContract
	} = req.body;
	userID = userID.trim();
	name = name.trim();
	email = email.trim();
	password = password.trim();
	dateOfBirth = dateOfBirth.trim();
	direction = direction.trim();
	hospital = hospital.trim();
	speciality = speciality.trim();
	timeContract = timeContract.trim();
	var lastUse = new Date();

	if (userID == '' || name == '' || email == '' || password == '' || dateOfBirth == '' || direction == '') {
		res.json({
			status: 'FAILED',
			message: 'Hay campos vacíos!'
		});
	} else if (!/^[a-zA-Z ]*$/.test(name)) {
		res.json({
			status: 'FAILED',
			message: 'Nombre inválido'
		});
	} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		res.json({
			status: 'FAILED',
			message: 'Correo inválido'
		});
	} else if (!new Date(dateOfBirth).getTime()) {
		res.json({
			status: 'FAILED',
			message: 'Fecha inválida'
		});
	} else if (password.length < 6) {
		res.json({
			status: 'FAILED',
			message: 'Contraseña muy corta!'
		});
	} else {
		// Checking if user already exists
		User.find({ email })
			.then((result) => {
				if (result.length) {
					// A user already exists
					res.json({
						status: 'FAILED',
						message: 'Ya existe un usuario con ese correo!'
					});
				} else {
					// Try to create new user

					// password handling
					const saltRounds = 10;
					bcrypt
						.hash(password, saltRounds)
						.then((hashedPassword) => {
							const newUser = new User({
								userID,
								dateOfBirth,
								direction,
								email,
								hospital,
								isMedic,
								lastUse,
								name,
								password: hashedPassword,
								profileImage,
								speciality,
								timeContract
							});

							newUser
								.save()
								.then((result) => {
									res.json({
										status: 'SUCCESS',
										message: 'Registo satisfactorio',
										data: result
									});
								})
								.catch((err) => {
									res.json({
										status: 'FAILED',
										message: 'Ha ocurrido un error mientras se guardaban los datos del usuario!'
									});
								});
						})
						.catch((err) => {
							res.json({
								status: 'FAILED',
								message: 'Se produjo un error al hacer hash de la contraseña!'
							});
						});
				}
			})
			.catch((err) => {
				console.log(err);
				res.json({
					status: 'FAILED',
					message: 'Se produjo un error al verificar si había un usuario existente.!'
				});
			});
	}
});

// Signin
router.post('/signin', (req, res) => {
	let { email, password } = req.body;
	email = email.trim();
	password = password.trim();
	if (email == '' || password == '') {
		res.json({
			status: 'FAILED',
			message: 'Credenciales vacías'
		});
	} else {
		var updateDate = new Date();
		// Check if user exist
		User.findOneAndUpdate({ email }, { $set: { lastUse: updateDate } }, { new: true }, (err, doc) => {
			if (err) {
				res.json({
					status: 'FAILED',
					message: 'Se produjo un error al verificar si había un usuario existente.'
				});
			}
			// User exists
			const hashedPassword = doc.password;
			bcrypt
				.compare(password, hashedPassword)
				.then((result) => {
					if (result) {
						// Password match
						res.json({
							status: 'SUCCESS',
							message: 'Inicio de sesión satisfactorio',
							data: [ doc ]
						});
					} else {
						res.json({
							status: 'FAILED',
							message: 'Contraseña inválida!'
						});
					}
				})
				.catch((err) => {
					res.json({
						status: 'FAILED',
						message: 'Ocurrió un error mientras se comparaban las contraseñas'
					});
				});
		});
	}
});

router.get('/patients', function(req, res) {
	User.find({ isMedic: false }, function(err, collection) {
		if (err) {
			console.log(err);
		} else {
			//res.render("page", {collection: collection});
			res.json({
				status: 'SUCCESS',
				message: 'Obtención satisfactoria de usuarios',
				data: collection
			});
		}
	});
});

router.get('/patient', function(req, res) {
	User.findOne({ userID: req.query.userID, isMedic: false }, function(err, collection) {
		if (err) {
			console.log(err);
		} else {
			res.json({
				status: 'SUCCESS',
				message: 'Obtención satisfactoria de usuario',
				data: collection
			});
		}
	});
});

module.exports = router;
