<template>
    <div id="huawei">
        <router-view/>
    </div>
</template>

<script>
    import axios from "axios";
    import {urlPath} from "../../const";

    export default {

        data: () => ({}),
        methods: {

            getOauthToken() {
                let config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    }
                }

                let data = {
                    "grant_type": "client_credentials",
                    "client_id": "102171019",
                    "client_secret": "9ca7aeaca05cfb5102bbf0467f8c4309003585c0db6ecabce734e6896f5f0c84"
                }


                axios.post("https://login.cloud.huawei.com/oauth2/v2/token", data, config)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(error => console.log(error));

            }


        },
        created() {
            console.log('created')
        }
    }

</script>
