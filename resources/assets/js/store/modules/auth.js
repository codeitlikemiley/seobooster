import Vue from 'vue'
import { VueAuthenticate } from 'vue-authenticate'
import providers from '../../services/providers'
const vueAuth = new VueAuthenticate(Vue.prototype.$http, providers)

const state = {
    me: null,
    isAuthenticated: false
}

const getters = {
    getMe: state => state.me,
    isAuthenticated: () => vueAuth.isAuthenticated()
}

const actions = {
    /* Tested Working */
    /* form : name, email ,password, password_confirmation */
    async register ({ commit, dispatch }, form) {
        form.busy = true
        try {
            await vueAuth.register(form).then((response) => {
                commit('isAuthenticated', {
                    isAuthenticated: vueAuth.isAuthenticated()
                })
            })

            await dispatch('fetchMe')

            form.busy = false
            vm.$popup({ message: 'Account Registered!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
            vm.$router.push({ name: 'dashboard' })
        } catch ({errors, message}) {
            form.errors.set(errors)
            form.busy = false
            vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
        }
    },
    /* Tested Working */
    /* form : username ,password */
    async login ({ commit, dispatch }, form) {
        form.busy = true
        try {
            await vueAuth.login(form).then((response) => {
                commit('isAuthenticated', {
                    isAuthenticated: vueAuth.isAuthenticated()
                })
            })

            await dispatch('fetchMe')

            form.busy = false
            vm.$popup({ message: 'Successfully Logged In!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
            vm.$router.push({ name: 'dashboard' })
        } catch ({errors, message}) {
            form.errors.set(errors)
            form.busy = false
            vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
        }
    },
    /* form : name,email ,provider(fb),provider_user_id(fb_id) */
    async socialauth ({ commit, dispatch }, form) {
        form.busy = true
        try {
            await App.post(route('api.auth.social'), form).then(() => {
                commit('isAuthenticated', {
                    isAuthenticated: vueAuth.isAuthenticated()
                })
            })

            await dispatch('fetchMe')
            form.busy = false

            vm.$popup({ message: 'Successfully Logged In!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
            vm.$router.push({ name: 'dashboard' })
        } catch ({errors, message}) {
            form.errors.set(errors)
            form.busy = false
            vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
        }
    },
    /* Tested Working */
    /* Remove Access Token Cookie */
    async logout ({ commit }, form) {
        form.busy = true
        try {
            await vueAuth.logout().then(() => {
                commit('isAuthenticated', {
                    isAuthenticated: vueAuth.isAuthenticated()
                })
                commit('setMe', null)
            })

            form.busy = false
            vm.$router.push({ name: 'home' })
            vm.$popup({ message: 'Successfully Logged Out!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
        } catch ({errors, message}) {
            form.busy = false
            vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
        }
    },
    /* Tested Working */
    /* Get User Profile , Roles and Permissions */
    async fetchMe ({ commit }) {
        try {
            const payload = await axios.post(route('api.@me'))
            commit('setMe', payload.data.data)
        } catch ({errors, message}) {
            if (errors) {
                console.log(errors)
            }
            if (message) {
                console.log(message)
            }
        }
    },
    /* Tested Working */
    /* form : username ,password, password_confirmation, token */
    async passwordreset ({ commit }, form) {
        form.busy = true
        try {
             await App.post(route('api.auth.reset-password'), form).then(() => {
                commit('isAuthenticated', {
                    isAuthenticated: vueAuth.isAuthenticated()
                })
                form.busy = false
            })
            
            vm.$popup({ message: 'Password Reset Successfully!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
            vm.$router.push({ name: 'dashboard' })
        } catch ({errors, message}) {
            form.errors.set(errors)
            form.busy = false
            vm.$popup({ message: message, backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
        }
    }

}

const mutations = {
    setMe: (state, payload) => {
        state.me = payload
    },
    isAuthenticated: (state, payload) => {
        state.isAuthenticated = payload.isAuthenticated
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
