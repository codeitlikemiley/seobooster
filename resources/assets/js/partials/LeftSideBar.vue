<template>
  <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.width > 1264"
      v-model="drawer"
      class="secondary"
      app
    >
      <v-list dense>
        <!-- V-For Links From Menu -->
        <!-- Individual Link (Custom Additional) -->
        <v-link :dark="darkClass"  title="Home" :href="'/'"   icon="fa-home"></v-link>
        <v-link :dark="darkClass"  title="Company Profile" :href="'/about'"   icon="fa-building"></v-link>
        <v-link :dark="darkClass"  title="Support" :href="'/support'"   icon="message"></v-link>
        <!-- Expandable Group Links from Group Link -->
        <v-subheader :class="{'blue-grey--text': !isDark, 'text--lighten-1': !isDark, 'white--text': isDark}">Members Area</v-subheader>
        <!-- Admin Only Accessible -->
        <v-link v-if="isLoggedIn() && hasRole('admin')" :dark="darkClass"  title="User Management"  :href="'/users'" icon="supervisor_account"></v-link>
        <!-- Normal User Links -->
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Dashboard"  :href="'/dashboard'" icon="fa-tachometer"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Reports"  :href="'/reports'" icon="fa-wpforms "></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Accounts"  :href="'/accounts'" icon="fa-users"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Create Post"  :href="'/posts'" icon="event_note"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Failed Post"  :href="'/failure'" icon="event_busy"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Published Post"  :href="'/published'" icon="event_available"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Scheduled Post"  :href="'/scheduled'" icon="update"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Boost Organic Traffic"  :href="'/traffic'" icon="trending_up"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Settings"  :href="'/settings'" icon="fa-cogs"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Logout"  :href="'/logout'" icon="power_settings_new"></v-link>
        <!-- Guest Links -->
        <v-link v-if="!isLoggedIn()" :dark="darkClass"  title="Login"  :href="'/login'" icon="fa-key"></v-link>
        <v-link v-if="!isLoggedIn()" :dark="darkClass"  title="Register"  :href="'/register'" icon="fa-user-plus"></v-link>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import Acl from '../mixins/acl'
import VLink from '../components/VLink.vue'
import Theme from '../mixins/theme'

export default {
    mixins: [Theme, Acl],
    data: () => ({
        drawer: false
    }),
    components: {
        VLink
    },
    mounted () {
        var self = this
        Bus.$on('toggleDrawer', function () {
            self.drawer = !self.drawer
        })
    }
}
</script>
