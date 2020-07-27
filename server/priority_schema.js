const mongoose = require("mongoose");

// Schema for employee
const prioritySchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    }
});

const priority = (module.exports = mongoose.model("priority", prioritySchema));
