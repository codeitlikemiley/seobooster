<template>
  <v-navigation-drawer
      temporary
      hide-overlay
      height="100%"
      enable-resize-watcher
      v-model="drawer"
      class="accent"
      style="z-index:1000;"
    >
      <v-list dense>
        <!-- V-For Links From Menu -->
        <v-link :dark="darkClass" v-for="link in links" :key="link.id" :title="link.title" :href="link.href" :icon="link.action"></v-link>
        <!-- Individual Link (Custom Additional) -->
        <v-link :dark="darkClass"  title="Company Profile" :href="'/about'"   icon="fa-building"></v-link>
        <v-link :dark="darkClass"  title="Support" :href="'/support'"   icon="message"></v-link>
        <!-- Expandable Group Links from Group Link -->
        <v-subheader :class="{'blue-grey--text': !isDark, 'text--lighten-1': !isDark, 'white--text': isDark}">Members Area</v-subheader>
        <!-- Admin Only Accessible -->
        <v-link v-if="isLoggedIn() && hasRole('admin')" :dark="darkClass"  title="User Management"  :href="'/users'" icon="fa-users"></v-link>
        <!-- Normal User Links -->
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Dashboard"  :href="'/dashboard'" icon="dashboard"></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Accounts"  :href="'/accounts'" icon="fa-address-card "></v-link>
        <v-link v-if="isLoggedIn()" :dark="darkClass"  title="Posts"  :href="'/posts'" icon="insert_invitation"></v-link>
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
import CategoryLink from '../components/CategoryLink.vue'
import Theme from '../mixins/theme'

export default {
    mixins: [Theme, Acl],
    data: () => ({
        drawer: false,
        links: [], // site navigation links
        members: [], // change with featured Products
        grouplinks: [] // product categories
    }),
    components: {
        VLink,
        CategoryLink
    },
    mounted () {
        var self = this
        Bus.$on('toggleDrawer', function () {
            self.drawer = !self.drawer
        })
        self.fetchCategories()
        self.fetchNavLinks()
    },
    methods: {
        fetchCategories () {
            this.grouplinks = App.grouplinks
        },
        fetchNavLinks () {
            this.links = App.menu
        }

    }

}
</script>
