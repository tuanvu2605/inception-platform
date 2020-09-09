

async function getOauthToken() {


    const bodyFormData = new URLSearchParams();
    bodyFormData.append('grant_type', 'client_credentials');
    bodyFormData.append('client_id', '102171019');
    bodyFormData.append('client_secret', '9ca7aeaca05cfb5102bbf0467f8c4309003585c0db6ecabce734e6896f5f0c84');


    try {
        // fetch data from a url endpoint
        const response = await axios({
            method: 'post',
            url: 'https://login.cloud.huawei.com/oauth2/v2/token',
            data: bodyFormData,
            headers: {'Content-Type': "application/x-www-form-urlencoded;charset=utf-8"}
        })

        const data = await response.data.access_token;
        console.log(response.data)
        return data;

    } catch (error) {
        console.log(error); // catches both errors
    }
}

function callApiUseToken(accessToken) {
    console.log(accessToken)
    let body = {
        "filtering": {"currency": "CNY"},
        "start_date": "2020-08-25",
        "end_date": "2020-08-26",
        "time_granularity": "STAT_TIME_GRANULARITY_DAILY",
        "order_type": "DESC"
    }

    axios({
        method: 'post',
        url: 'https://ads.cloud.huawei.com/openapi/monetization/reports/v1/publisher',
        data: body,
        headers: {
            'Content-Type': "application/json",
            "Authorization": "Bearer " + accessToken
        }
    })
        .then(function (response) {
            //handle success
            console.log(response);
        })
        .catch(function (response) {
            //handle error
            console.log(response);
        });
}

async function getHuaweiAdsReport() {
    let access_Token = await getOauthToken();
    callApiUseToken(access_Token)

}
