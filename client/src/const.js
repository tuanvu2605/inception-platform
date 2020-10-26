export const item =  {
    "adType": 1,
    "timeReload": 10,
    "title": "",
    "url": "",
    "thumb": "",
    "shopifyProductId":"",
    "sku":"",
    "images": [

    ],
    "location": [
    ],
    "status": "published"
}

export const baseURL = "http://localhost:3000";
export const baseShopifyURL = "https://19e09e81f6a730528fc14d92b5e1e886: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@welovedesigns.myshopify.com"
    // "https://942c03cc5f07a20ddc56b47242aaa588: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@imazingthings.myshopify.com";
export const productAPIURL = baseShopifyURL + "/admin/api/2020-07/products.json";
export const orderAPIURL = baseShopifyURL + "/admin/api/2020-07/orders.json";





export const tokenUrl = "https://login.cloud.huawei.com/oauth2/v2/token";
/**
 * 联盟用户界面生成的OAuth2.0 客户端id 跟密钥
 */
export const clientId = "102422523";
export const secret = "a2c95f25bc421a3fd0f77d2118743d925c68fd189675ad6a4a7980a45125e705";
/**
 * 调用数据的网关
 */
export const reportUrl = "https://ads.cloud.huawei.com/openapi/monetization/reports/v1/publisher";

export function getShopifyProductsURL(limit,pageInfo) {
    let url = productAPIURL + "?limit="+ limit
    if (pageInfo != null) {
        url = url + "&page_info="+pageInfo
    }
    return url
}

export function getShopifyProductByIdURL(Id) {
    let url = baseShopifyURL + "/admin/api/2020-07/products/" + Id + ".json"
    return url
}



export function urlPath(path) {
    return baseURL + path
}



export const statusOptions =  ['published', 'unpublished']
export function isEmpty(str) {
    return (!str || 0 === str.length);
}

export function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}
