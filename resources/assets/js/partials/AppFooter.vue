<template>
  <v-footer :class="[footerClass]" app>
    <v-spacer/><span>© {{ year }} {{ domain }} ® | {{ trademark }}™</span><v-spacer/>
  </v-footer>
</template>

<script>
import Theme from '../mixins/theme'
import VLink from '../components/VLink.vue'
export default {
    components: {
        VLink
    },
    mixins: [Theme],
    data: () => ({
        footerClass: {'primary--text': true, 'grey': true, 'darken-4': true}
    }),
    created () {
        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('footer-content-visible', (visibility) => {
            this.contentVisible = visibility
        })
    }
}
</script>

<style>

</style>
