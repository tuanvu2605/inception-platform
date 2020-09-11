const axios = require('axios')


exports.getProducts = function (req, res) {
    let url = req.body.shopifyURL;

    axios.get(url).then(response => {
        let parsed = parse(response.headers.link);
        res.json({products: response.data.products, links: parsed})
    }).catch(error => {
        res.send("Error while fetching shopify products")
    });
}

exports.getProduct = function (req, res) {
    let url = req.body.shopifyURL;
    axios.get(url).then(response => {
        res.json({product: response.data.product})
    }).catch(error => {
        res.send("Error while fetching shopify product")
    });
}
