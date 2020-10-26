const mongoose = require("mongoose");

// Schema for ad
const versionDependencySchema = mongoose.Schema({

    packageName: {
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

module.exports = mongoose.model("VersionDependency", versionDependencySchema);
