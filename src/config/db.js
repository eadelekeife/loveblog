const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect();
        console.log("DB connected successfully")
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectToDB;