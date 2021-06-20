const { Schema, model } = require('mongoose');

const statisticSchema = new Schema ({
     userID: {
         type: String,
         required: true
     },
     timeOfService: Number,
     specialism: String ,
     hospital: String,
     patientID: {
         type: [String] 
     },
     starts: Number
})
module.exports= model('Stadistic', statisticSchema);