const mongoose = require('mongoose')
const TellabotTransaction = require('./model/TellaBotTransaction')
const moment = require('moment')
module.exports.handler = async (event, context) => {
	await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    const data = await TellabotTransaction.find({status: "RESERVED", is_ltr: true, endtime: {$lt: moment.utc().format("YYYY-MM-DDTHH:mm:ss")} }).limit(1000).lean()
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
		await TellabotTransaction.updateOne({_id: element._id}, {status: 'COMPLETED'})
    }

    await mongoose.disconnect()
    console.log("Job is completed...")
    return {success: true}
    
};