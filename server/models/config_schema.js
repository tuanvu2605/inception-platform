const mongoose = require("mongoose");

// Schema for ad
const configSchema = mongoose.Schema({

    rate: {
        type: Number,
        required: true
    }

},{
    timestamps: { createdAt: 'created_at'   , updatedAt: 'updated_at' }
});

module.exports = mongoose.model("Config", configSchema);
