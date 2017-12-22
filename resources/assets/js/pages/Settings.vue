<template>
  <main-layout>
    <v-tabs 
      fixed 
      icons 
      centered
    >
      <v-toolbar color="white">
        <v-tabs-bar>
          <v-tabs-slider color="primary"/>
          <!-- tabs -->
          <v-tabs-item 
            href="#account" 
            class="accent--text"
          >
            <v-icon color="indigo" large>fa-user</v-icon>
            <span 
              :class="$vuetify.breakpoint.width >= 600 && 'title'"
            >
              Account
            </span>
          </v-tabs-item>
          <v-tabs-item 
            href="#profile" 
            class="accent--text"
          >
            <v-icon color="teal" large>fa-address-card</v-icon>
            <span 
              :class="$vuetify.breakpoint.width >= 600 && 'title'"
            >
              Profile
            </span>
          </v-tabs-item>
          <v-tabs-item 
            href="#referral-link" 
            class="accent--text"
          >
            <v-icon color="cyan" large>link</v-icon>
            <span 
              :class="$vuetify.breakpoint.width >= 600 && 'title'"
            >
              Referral Link
            </span>
          </v-tabs-item>
          <!-- tabs -->
        </v-tabs-bar>
      </v-toolbar>
      <v-tabs-items>
        <!-- tab contents -->
        <account/>
        <profile/>
        <referral-link/>
        <!-- tab contents -->
      </v-tabs-items>
    </v-tabs>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Account from '../components/settings/Account.vue'
import Profile from '../components/settings/Profile.vue'
import ReferralLink from '../components/settings/ReferralLink.vue'
import Theme from '../mixins/theme'

export default {
    components: {
        MainLayout,
        Account,
        Profile,
        ReferralLink
    },
    mixins: [Theme],
    data: () => ({
        contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true }
    })
}
</script>
