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
export const baseShopifyURL = "https://942c03cc5f07a20ddc56b47242aaa588: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@imazingthings.myshopify.com";
export const productAPIURL = baseShopifyURL + "/admin/api/2020-07/products.json"

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
