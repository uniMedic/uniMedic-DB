// ref: https://mugan86.medium.com/generar-pdf-desde-nodejs-con-la-librer%C3%ADa-html-pdf-c8206b28c1b7
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
	<!doctype html>
    <html>
	<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <!-- Custom Style -->
    <link rel="stylesheet" href="style.css">

    <title>Diagnostico</title>
	</head>

	<body>
    <div class="my-5 page" size="A4">
        <div class="p-5">
            <section class="header">
				<div id="logo">
					<img src="../logo.png">
				</div>
				<div id="titulo">
					<h2>DIAGNÓSTICO MÉDICO</h2>  
				</div>
            </section>

            <section class="information mt-5" >
                <div class="col-10" style="border-top:2px solid #ddd; border-bottom:2px solid #ddd; padding-top: 7px;">
                    <div class="row bb pb-3" style="padding-top: 7px; padding-bottom: 6px;">
                        <div class="col-7">
                            <p class="content"><b>Número de expediente:</b> 151577 <br> <b>Nombre del paciente:</b>  Michael Lopez<br> <b>Fecha de nacimiento:</b> 2000-03-14</p>
                            <div class="txn mt-2"><b>Autoría:</b> app uniMedic</div>
                        </div>
                        <div class="col-5">
                            <p class="content"> <b>Fecha del diagnóstico:</b> 03-Jul-2021 11:25 am<br> <b>Validación:</b> Realizada<br> <b>Médico:</b> Arturo E. Velasquez</p>
                        </div>
                    </div>
                </div>
            </section>

			<section class="details">
				<p style="width:19cm; text-align: center; padding-top: 1.5cm"><b>RESULTADO DE DIAGNÓSTICO</b></p>
				<p class="diagnosis" style="width: 19cm;">El paciente presenta una anomalia en la zona izquierda del cerebro, se solicita una operación de nivel critico</p>
				<div style="width:19cm; height:10cm; border-bottom:2px solid #ddd;"></div>
			</section>

			<section class="footer">
			<p style="width:19cm; text-align: left;">Los resultados obtenidos por uniMedic están basados en técnicas de Deep Learning.  <br> Y están disponibles tanto en la aplicación mobil como web. </p>
			</section>

		</div>
	</div>
    </body>
    </html>
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
