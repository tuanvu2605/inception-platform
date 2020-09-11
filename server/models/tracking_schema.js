const mongoose = require("mongoose");

// Schema for employee
const trackingSchema = mongoose.Schema({

    geo : {
        "range": {
            type: [
                Number
            ]
        },
        "country": {
            type: String
        },
        "region": {
            type: String
        },
        "eu": {
            type: Boolean
        },
        "timezone": {
            type: String
        },
        "city": {
            type: String
        },
        "ll": {
            type: [
                Number
            ]
        },
        "metro": {
            type: Number
        },
        "area": {
            type: Number
        }
    },

    ipAddress: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    product:{
        type:[{productId:String,count:Number}]
    }
},{
    timestamps: { createdAt: 'created_at'   , updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Tracking", trackingSchema);
