const { Schema, model } = require('mongoose');

const statisticSchema = new Schema ({
     medicID: {
         type: String,
         required: true
     },
     timeOfService: Number,
     specialism: String ,
     hospital: String,
     patientsID: {
         type: [String] 
     },
     stars: Number
})
module.exports= model('Stadistic', statisticSchema);