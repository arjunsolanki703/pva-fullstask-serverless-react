const mongoose = require('mongoose')


const boatTransactionSchema = new mongoose.Schema({}, { strict: false })



let boatTransaction = mongoose.model('boattransactions', boatTransactionSchema)
module.exports = boatTransaction