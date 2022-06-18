const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({}, { strict: false })



let User = mongoose.model('users', UserSchema)
module.exports = User