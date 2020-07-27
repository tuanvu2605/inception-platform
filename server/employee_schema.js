const mongoose = require("mongoose");

// Schema for employee
const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const employee = (module.exports = mongoose.model("employee", employeeSchema));
