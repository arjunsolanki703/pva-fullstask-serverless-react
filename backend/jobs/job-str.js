const mongoose = require('mongoose')
const User = require('./model/User')
const boatTransaction = require('./model/boatTransaction')
const moment = require('moment')
module.exports.handler = async (event, context) => {
    console.log("Job is running...")
	await mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true});
    const data = await boatTransaction.find({status: "RESERVED", is_ltr: false, endtime: {$lt: moment.utc().format("YYYY-MM-DDTHH:mm:ss")} }).limit(1000).lean()
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const isServiceUsed = element.credit.services.find((o) => o.pin != undefined);
        if(isServiceUsed) {
            await boatTransaction.updateOne({_id: element._id}, {status: 'COMPLETED'})
        } else {
            await boatTransaction.updateOne({_id: element._id}, {status: 'TIMEOUT'})
            await User.updateOne({_id: element.user_id}, {$inc: {credits: element.credit.totalCreditCharge}})
        }
    }
    
    await mongoose.disconnect()
    console.log("Job is completed...")
    return {success: true}


};


