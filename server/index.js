const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
var useragent = require('express-useragent');
const expressip = require('express-ip');
const axios = require('axios')
const parse = require('parse-link-header')

// var geoip = require('geoip-lite');


const app = express();
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.use(cors());
const path = require('path');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());


mongoose.connect("mongodb://localhost:27017/platform", {
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
    console.log(ipInfo)
    // var geo = geoip.lookup(ip);
    console.log(geo);
    res.render("ads");
});

app.get("/ad/mobile/:id", (req, res) => {
    let id = req.params.id;
    adModel.findById(id,{},{},(err,result)=>{
        console.log(result)
        res.render("ads",{ ad:result });
    })

});



// uncompleted
app.get("/ad/all", (req, res) => {

    const options = {
        page: 1,
        limit: 20
    };

    adModel.paginate({}, options, function (err, result) {
        if (err) {
            res.send("Error while fetching countries");
        } else {
            res.json(result);
        }
    })
});


app.post("/ad/listing", (req, res) => {

    let opt = req.body.options;
    const options = {
        page: opt.page,
        limit: opt.limit,
        sort:{
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
                res.json({message: 'Update '+ req.body.ad.title.toUpperCase() + ' Success!', type: 'success'});
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
    let bannerType = req.body.bannerType;
    let countryCode = req.body.countryCode;
    adModel.findByIdAndRemove(id , {},err => {
        if (err) {
            res.json({message: 'Remove Ad failed!', type: 'fail'});
        } else {
            res.json({message: 'Remove Ad success!', type: 'success'});
        }
    });
});

app.post("/ad/getItem", (req, res) => {
    let id = req.body.productId;
    adModel.findByIdAndRemove(id , {},err => {
        if (err) {
            res.json({message: 'Remove Ad failed!', type: 'fail'});
        } else {
            res.json({message: 'Remove Ad success!', type: 'success'});
        }
    });
});



app.get("/ad/shopifyIds", (req, res) => {
    adModel.find({},{shopifyProductId:1, _id: 0}, (err, results) => {
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
            res.send("Error while fetching ads");
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


app.listen(3000, () => {
    console.log("Server started on port 3000");
});
