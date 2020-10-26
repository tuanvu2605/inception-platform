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
        type: Boolean,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    dependencies :{
        type: [String],
        required: true,
        default: []
    }

},{
    timestamps: { createdAt: 'created_at'   , updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Version", versionSchema);
