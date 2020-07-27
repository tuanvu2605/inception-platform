const mongoose = require("mongoose");

// Schema for employee
const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

const country = (module.exports = mongoose.model("country", countrySchema));
