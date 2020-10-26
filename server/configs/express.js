const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const useragent = require('express-useragent');
const expressip = require('express-ip');
const path = require('path');


module.exports = function()
{
    const app = express();
    app.use(useragent.express());
    app.use(expressip().getIpInfoMiddleware);
    app.use(cors());
    app.set('views', './views');
    app.use(express.static(path.join(__dirname, 'public')));

    app.set('view engine', 'pug');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    require('../routes/routes')(app);

    return app;
};
