const mongoose = require("mongoose");

// Schema for ad
const versionSchema = mongoose.Schema({

    version: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    packageName: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    }

},{
    timestamps: { createdAt: 'created_at'   , updatedAt: 'updated_at' }
});

const version = (module.exports = mongoose.model("version", versionSchema));
