const mongoose = require("mongoose");


module.exports = function() {

    const db = mongoose.connect("mongodb://platform:godofwar2605@34.71.238.73:27017/platform", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    require('../models/ad_schema');
    require('../models/country_schema');
    require ('../models/version_schema');

    let connection = mongoose.connection;
    connection.on("open", () => {
        console.log("Connected to mongoDB");
    });
    connection.on("error", error => {
        console.log(error);
    });


    return db;
}
