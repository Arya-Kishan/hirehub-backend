
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("CONNECTED TO CLOUD MONGO DB");
    })
    .catch((err) => {
        console.log("ERROR IN CONNECTING MONGO DB");
        console.log(err);
    })