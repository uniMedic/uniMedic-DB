const { Schema, model } = require('mongoose');

const HistorySchema = new Schema ({
     patientID: {
         type: String
     },
     diagnosisID: {
         type: [String],
         unique: true,
         required: true
     }
})
module.exports= model('History', HistorySchema);