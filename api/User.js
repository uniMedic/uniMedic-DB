const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
	let { userID, name, email, password, dateOfBirth, direction, isMedic } = req.body;
	userID = userID.trim();
	name = name.trim();
	email = email.trim();
	password = password.trim();
	dateOfBirth = dateOfBirth.trim();
	direction = direction.trim();

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
								name,
								email,
								password: hashedPassword,
								dateOfBirth,
								direction,
								isMedic
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
		// Check if user exist
		User.find({ email })
			.then((data) => {
				if (data.length) {
					// User exists

					const hashedPassword = data[0].password;
					bcrypt
						.compare(password, hashedPassword)
						.then((result) => {
							if (result) {
								// Password match
								res.json({
									status: 'SUCCESS',
									message: 'Inicio de sesión satisfactorio',
									data: data
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
				} else {
					res.json({
						status: 'FAILED',
						message: 'Credenciales inválidas!'
					});
				}
			})
			.catch((err) => {
				res.json({
					status: 'FAILED',
					message: 'Se produjo un error al verificar si había un usuario existente.'
				});
			});
	}
});

module.exports = router;
