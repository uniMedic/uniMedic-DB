const { Schema, model } = require('mongoose');

const HistorySchema = new Schema ({
     userID: {
         type: String
     },
     diagnosticID: {
         type: String,
         unique: true,
         required: true
     }
})
module.exports= model('History', HistorySchema);