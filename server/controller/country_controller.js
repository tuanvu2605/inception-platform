const mongoose = require('mongoose');
const country = mongoose.model('Country');


exports.getAllCountries = function (req, res) {
    country.find({}, (err, countries) => {
        if (err) {
            res.send("Error while fetching country");
        } else {
            res.json(countries);
        }
    });
}

