import axios from 'axios'
import {urlPath} from "../../const";

const state = {
    countries : []
}

const actions = {
    getCountries({commit}){
        axios.get(urlPath("/country/all"))
            .then(response => {
                let countries = response.data
                commit('SET_APP_COUNTRIES',countries)
            })
    }
}
const mutations = {
    SET_APP_COUNTRIES (state,countries){
        state.countries =  countries
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

