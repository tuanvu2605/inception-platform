export const item =  {
    "adType": 1,
    "timeReload": 10,
    "title": "",
    "url": "",
    "thumb": "",
    "images": [

    ],
    "location": [
    ],
    "status": "published"
}

export const baseURL = "http://localhost:3000";

export function urlPath(path) {
    return baseURL + path
}

export const statusOptions =  ['published', 'deleted']
export function isEmpty(str) {
    return (!str || 0 === str.length);
}
