const mongoose = require('mongoose')


const TellabotTransactionSchema = new mongoose.Schema({}, { strict: false })



let TellabotTransaction = mongoose.model('tellabottransactions', TellabotTransactionSchema)
module.exports = TellabotTransaction