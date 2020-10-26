const mongoose = require('mongoose');
const ads = mongoose.model('Ads');
const axios = require('axios')


exports.getAmazonAds = function (req, res) {
    res.render("amzads");
}

exports.getNativeAdsById = function (req, res) {
    let id = req.params.id;
    ads.findById(id, (err, result) => {
        if (result) {
            res.render("native", {ad: result});
        } else {

        }

    })
}

exports.getBannerAdsById = function (req, res) {
    let id = req.params.id;
    ads.findById(id, (err, result) => {
        if (result) {
            res.render("banner", {ad: result});
        } else {

        }

    })
}

exports.getFullAdsById = function (req, res) {
    let id = req.params.id;
    ads.findById(id, (err, result) => {
        if (result) {
            res.render("full", {ad: result});
        } else {

        }

    })
}


exports.getMobileAdsStatus = function (req, res) {
    res.json({status: 'success', isEnable: true})
}


exports.adsListing = function (req, res) {

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

    ads.paginate(q, options, function (err, result) {
        if (err) {
            res.send("Error while fetching ads");
        } else {
            res.json(result);
        }
    })
}


function isEmpty(str) {
    return (!str || 0 === str.length);
}


exports.adsUpdate = function (req, res) {
    ads.findByIdAndUpdate(
        req.body.ad._id,
        req.body.ad,
        (err, ad) => {
            if (!err) {
                res.json({message: 'Update ' + req.body.ad.title.toUpperCase() + ' Success!', type: 'success'});
            }
        }
    );
}

exports.adsAddItem = function (req, res) {
    let newAd = new ads(req.body.ad);
    newAd.save(err => {
        if (err) {
            console.log(err);
            res.json({message: 'Create ' + newAd.title.toUpperCase() + ' Failed', type: 'fail'});
        } else {
            res.json({message: 'Create ' + newAd.title.toUpperCase() + ' Success', type: 'success'});
        }
    });
}

exports.adsRemoveItemById = function (req, res) {
    let id = req.body.itemId;
    ads.findByIdAndRemove(id, {}, err => {
        if (err) {
            res.json({message: 'Remove Ad failed!', type: 'fail'});
        } else {
            res.json({message: 'Remove Ad success!', type: 'success'});
        }
    });
}

exports.getMobileAds = function (req, res) {

    let _adType = req.body.adType;
    const ipInfo = req.ipInfo;
    let country = ipInfo.country ? ipInfo.country : '';

    let query = {};
    if (country == '') {
        query = {status: "published"}
    } else {
        query = {status: "published", location: country}
    }
    findAdWithQuery(_adType, query, ipInfo, res)

}


function findAdWithQuery(adType, query, info, res) {
    ads.find(query, (err, ads) => {
        if (err) {
            res.status(400).json({message: 'ADs not found.'});
        } else {
            if (ads.length > 0) {
                const ad = ads[Math.floor(Math.random() * ads.length)];
                if (adType == 1) {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/full/' + ad._id})
                } else if (adType == 2) {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/banner/' + ad._id})
                } else {
                    res.json({status: 'success', url: 'http://34.71.238.73:3000/ad/mobile/native/' + ad._id})
                }
            } else {
                findAdWithQuery(adType, {status: "published"}, info, res);
            }
        }
    });
}


exports.fetchShopifyIds = function (req, res) {
    ads.find({}, {shopifyProductId: 1, _id: 0}, (err, results) => {
        if (err) {
            res.send("Error while fetching shopify ids");
        } else {
            res.json(results);
        }
    });
}


exports.sendLogWithAdsType = function (req, res) {
    const ipInfo = req.ipInfo;
    let adType = req.params.adType;
    let adTypeDict = {
        1: 'full',
        2: 'banner',
        3: 'native'
    }
    let messLog = JSON.stringify({action: 'click', info: ipInfo, adType: adTypeDict[adType]});
    sendLogTelegram(messLog);
}


function sendLogTelegram(message) {
    let url = 'https://api.telegram.org/bot1333957016:AAGq7Qqiaz4_ok2CXE9a5EcmrzP4Fd4f9J0/sendMessage?text=' + message + '&chat_id=427604985'
    axios.post(url).then(response => {
    }).catch(error => {
        console.log(error)
    });
}
