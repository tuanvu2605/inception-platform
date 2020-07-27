const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema for ad
const adSchema = mongoose.Schema({
    adType: {
        type: Number,
        required: true
    },
    timeReload: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumb: {
        type: String,
        required: true
    },
    location: {
        type: [String],
        required: true,
        default: []
    },
    images: {
        type: [String],
        required: true,
        default: []
    },
    status: {
        type: String,
        required: true
    }
},{
    timestamps: { createdAt: 'created_at'   , updatedAt: 'updated_at' }
});

adSchema.plugin(mongoosePaginate);
const ad = (module.exports = mongoose.model("ad", adSchema));
