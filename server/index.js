const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
var useragent = require('express-useragent');
const expressip = require('express-ip');
const axios = require('axios')
const parse = require('parse-link-header')

const path = require('path');
const app = express();
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.use(cors());
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


mongoose.connect("mongodb://platform:godofwar2605@34.71.238.73:27017/platform", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on("open", () => {
    console.log("Connected to mongoDB");
});
db.on("error", error => {
    console.log(error);
});

let adModel = require("./ad_schema");
let countryModel = require("./country_schema")

// ROUTES


app.get("/", (req, res) => {
    const ipInfo = req.ipInfo;
    res.send(ipInfo);
});

app.get("/ad/mobile/native/:id", (req, res) => {
    let id = req.params.id;
    adModel.findById(id, (err, result) => {
        if (result) {
            res.render("native", {ad: result});
        } else {

        }

    })

});

app.get("/ad/mobile/banner/:id", (req, res) => {
    let id = req.params.id;
    adModel.findById(id, (err, result) => {
        if (result) {
            res.render("banner", {ad: result});
        } else {

        }

    })
});

app.get("/ad/mobile/full/:id", (req, res) => {
    let id = req.params.id;
    adModel.findById(id, (err, result) => {
        if (result) {
            res.render("full", {ad: result});
        } else {

        }

    })
});

app.get("/ad/mobile/enable", (req, res) => {
    res.json({status: 'success', isEnable: true})
});

app.post("/ad/listing", (req, res) => {

    let opt = req.body.options;
    const options = {
        page: opt.page,
        limit: opt.limit,
        sort: {
            updated_at: 1
        }
    };
    let queries = req.body.filter;
    let q = {}
    if (queries != null) {
        q = queries
        for (let key in q) {
            if (isEmpty(q[key])) {
                delete q[key]
            }
        }

    }

    adModel.paginate(q, options, function (err, result) {
        if (err) {
            res.send("Error while fetching ads");
        } else {
            res.json(result);
        }
    })
});


function isEmpty(str) {
    return (!str || 0 === str.length);
}


app.post("/ad/update/", (req, res) => {
    adModel.findByIdAndUpdate(
        req.body.ad._id,
        req.body.ad,
        (err, ad) => {
            if (!err) {
                res.json({message: 'Update ' + req.body.ad.title.toUpperCase() + ' Success!', type: 'success'});
            }
        }
    );
});

app.post("/ad/add", (req, res) => {
    let newAd = new adModel(req.body.ad);
    newAd.save(err => {
        if (err) {
            console.log(err);
            res.json({message: 'Create ' + newAd.title.toUpperCase() + ' Failed', type: 'fail'});
        } else {
            res.json({message: 'Create ' + newAd.title.toUpperCase() + ' Success', type: 'success'});
        }
    });
});

app.post("/ad/remove", (req, res) => {
    let id = req.body.itemId;
    adModel.findByIdAndRemove(id, {}, err => {
        if (err) {
            res.json({message: 'Remove Ad failed!', type: 'fail'});
        } else {
            res.json({message: 'Remove Ad success!', type: 'success'});
        }
    });
});

app.post("/ad/get/mobile", (req, res) => {

    let _adType = req.body.adType;
    const ipInfo = req.ipInfo;
    let country = ipInfo.country ? ipInfo.country : '';

    let query = {};
    if (country == '') {
        query = {status: "published"}
    } else {
        query = {status: "published", location: country}
    }
    findAdWithQuery(_adType,query,ipInfo,res)

});


function findAdWithQuery(adType,query,info,res){
    adModel.find(query, (err, ads) => {
        if (err) {
            res.status(400).json({message: 'ADs not found.'});
        } else {
            if (ads.length > 0) {
                const ad = ads[Math.floor(Math.random() * ads.length)];
                let adTypeDict = {
                    1: 'full',
                    2: 'banner',
                    3: 'native'
                }
                let messLog = JSON.stringify({action:'view',info:info,ad_id:ad._id,adType:adTypeDict[adType]});
                sendLogTelegram(messLog);
                if (adType == 1) {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/full/' + ad._id})
                } else if (adType == 2) {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/banner/' + ad._id})
                } else {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/native/' + ad._id})
                }
            } else {
                findAdWithQuery(adType,{status: "published"},info,res);
            }
        }
    });
}


app.get("/ad/shopifyIds", (req, res) => {
    adModel.find({}, {shopifyProductId: 1, _id: 0}, (err, results) => {
        if (err) {
            res.send("Error while fetching shopify ids");
        } else {
            res.json(results);
        }
    });
});

app.get("/country/all", (req, res) => {
    countryModel.find({}, (err, countries) => {
        if (err) {
            res.send("Error while fetching country");
        } else {
            res.json(countries);
        }
    });
});


// shopify
app.post("/shopify/products", (req, res) => {
    let url = req.body.shopifyURL;

    axios.get(url).then(response => {
        let parsed = parse(response.headers.link);
        res.json({products: response.data.products, links: parsed})
    }).catch(error => {
        res.send("Error while fetching shopify products")
    });
});

app.post("/shopify/product", (req, res) => {
    let url = req.body.shopifyURL;
    axios.get(url).then(response => {
        res.json({product: response.data.product})
    }).catch(error => {
        res.send("Error while fetching shopify product")
    });
});

function sendLogTelegram(message) {
    let url = 'https://api.telegram.org/bot1333957016:AAGq7Qqiaz4_ok2CXE9a5EcmrzP4Fd4f9J0/sendMessage?text='+ message + '&chat_id=427604985'
    axios.post(url).then(response => {

    }).catch(error => {
        console.log(error)
    });
}

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
