const ads_controller = require('../controller/ads_controller');
const country_controller = require('../controller/country_controller');
const SPFController = require('../controller/shopify_controller')
const version_controller = require('../controller/version_controller')

module.exports = function (app) {
    // ads
    app.get("/ad/mobile/native/:id", ads_controller.getNativeAdsById)
    //getAmazonAds
    app.get("/ad/rate", ads_controller.rateNumberToShowAds)
    app.get("/ad/mobile/amz", ads_controller.getAmazonAds)
    app.get("/ad/mobile/banner/:id", ads_controller.getBannerAdsById)
    app.get("/ad/mobile/full/:id", ads_controller.getFullAdsById)
    app.get("/ad/mobile/enable", ads_controller.getMobileAdsStatus)
    app.post("/ad/listing", ads_controller.adsListing)
    app.post("/ad/update", ads_controller.adsUpdate)
    app.post("/ad/add", ads_controller.adsAddItem)
    app.post("/ad/remove", ads_controller.adsRemoveItemById)
    app.post("/ad/get/mobile", ads_controller.getMobileAds)
    app.get("/ad/shopifyIds", ads_controller.fetchShopifyIds)
    app.get("/ad/log/:adType", ads_controller.sendLogWithAdsType)
    app.get("/country/all", country_controller.getAllCountries)

    // spf
    app.post("/shopify/products", SPFController.getProducts)
    app.post("/shopify/product", SPFController.getProduct)

    // version
    app.get("/version/update/:packageName", version_controller.getVersionUpdateByPackageName)


}
