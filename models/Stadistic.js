const { Schema, model } = require('mongoose');

const statisticSchema = new Schema ({
     /*userID: {
         type: String,
         required: true
     },*/
     userID: String, //data already obtained
     //timeOfService: Number, --changed by state
     state: String, // enServicio, fueraDeServicio, by default: en-servicio
     specialism: String,// obtenido por logueo
     hospital: String, // obtenido por logueo
     patientID: {  //patients assigned to the doctor (attended + on hold)
         type: [String]   
     },
     //patientID: String,
     starts: Number
})
module.exports= model('Stadistic', statisticSchema);