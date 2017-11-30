<template>
  <v-carousel icon="crop_square" class="primary--text">
        <v-carousel-item  v-for="(item,i) in images" :src="item.src" :key="i">
            <div class="headline text-xs-center">
            <h3 class="white--text"> <span style="background-color:#103050;opacity:0.75;">{{ item.headline }}</span></h3>
            <p class="white--text title" ><span style="background-color:#607D8B;opacity:0.75;">{{ item.subheader }}</span></p>
            <v-btn class="primary white--text" :to="item.buttonlink">{{ item.buttontext }} <v-icon right dark>{{ item.icon }}</v-icon></v-btn>
            </div>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
import Acl from '../../mixins/acl'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
    mixins: [Acl],
    data: () => ({
        images: [
            {src: '/img/trafficmanipulate.jpg', headline: 'Manipulate Traffic', 'subheader': 'Gain Organic Search Ranking and Beat the Competition', 'buttontext': 'Get Started Now!', 'buttonlink': '/register', 'icon': 'person_pin', textcolor: 'accent--text'},
            {src: '/img/manageseo.jpg', headline: 'Manage Real Traffic Signal', 'subheader': 'Easily Manage , Split Test To See What Campaign Works Best', 'buttontext': 'Get Started Now!', 'buttonlink': '/register', 'icon': 'person_pin', textcolor: 'accent--text'},
            {src: '/img/socialsignals.jpg', headline: 'Build Endless Social Signals', 'subheader': 'Gain Social Signals Thru Auto Post Social Link Building', 'buttontext': 'Get Started Now!', 'buttonlink': '/register', 'icon': 'person_pin', textcolor: 'black--text'},
            {src: '/img/videobooster.jpg', headline: 'Rank Video Fast', 'subheader': 'Take #1 Spot In Google with Youtube Video Booster', 'buttontext': 'Get Started Now!', 'buttonlink': '/register', 'icon': 'person_pin', textcolor: 'accent--text'}

        ]
    }),
    methods: {
        goToLink (link) {
            this.$router.push({ path: link })
        }
    },
    mounted () {
        let self = this
        if (self.isLoggedIn()) {
            self.images.forEach(image => {
                image.buttonlink = '/dashboard'
            })
        }
    }
}
</script>

<style>

</style>
