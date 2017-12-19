import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
Vue.use(VueAxios, axios)

window._ = require('lodash')
window.moment = require('moment')
window.Promise = require('promise')

/* Define Moment locales */
window.moment.defineLocale('en-short', {
    parentLocale: 'en',
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: '1s',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1 month ago',
        MM: '%d months ago',
        y: '1y',
        yy: '%dy'
    }
})

window.moment.locale('en')

if (window.$ === undefined || window.jQuery === undefined) {
    window.$ = window.jQuery = require('jquery')
}

/* Load Only Once Babel Polyfill */

if (!global._babelPolyfill) {
    require('babel-polyfill')
}

/* Bootstrap Vue Plugins */

if ($('#app').length > 0) {
    require('./vuestrap')
}

/* Load Axios */
window.axios = axios

/* Allows Us To Authorized Api Request If Authenticated Using Web Middleware */
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
/* Set The Token if Present So We Can Authorize Request */
let token = document.head.querySelector('meta[name="csrf-token"]')
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')
}

window.axios.interceptors.response.use((response) => {
    return response
}, (error) => {
    switch (error.response.status) {
    case 401:
        //! check provider.js for the `${storageNamespace}.${tokenPrefix}_token`
        window.localStorage.removeItem('vue-authenticate.vueauth_token')
        vm.$store.commit('auth/setMe', null)
        vm.$store.commit('auth/isAuthenticated', false)
        vm.$router.push({ name: 'login' })
        break
    case 402:
    vm.$router.push('subscribe')
        break
    }
    return Promise.reject(error)
})
