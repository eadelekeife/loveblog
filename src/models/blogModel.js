const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
});

const Blogs = mongoose.model("blog", blogSchema);

module.exports = Blogs;