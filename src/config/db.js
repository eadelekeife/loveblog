const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ieadeleke:biochemistry@cluster0.yrxma.mongodb.net/loveblog");
        console.log("DB connected successfully")
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectToDB;