<template>
  <main-layout :style="{ paddingTop: `100px`, backgroundColor: `white` }">
    <v-tabs 
      fixed 
      icons 
      centered
    >
      <v-tabs-bar>
        <v-tabs-slider color="primary"/>
        <!-- tabs -->
        <v-tabs-item 
          href="#account" 
          class="primary--text"
        >
          <v-icon color="indigo">fa-user</v-icon>
          Account
        </v-tabs-item>
        <v-tabs-item 
          href="#profile" 
          class="primary--text"
        >
          <v-icon color="teal">fa-address-card</v-icon>
          Profile
        </v-tabs-item>
        <v-tabs-item 
          href="#referral-link" 
          class="primary--text"
        >
          <v-icon color="cyan">link</v-icon>
          Referral Link
        </v-tabs-item>
        <!-- tabs -->
      </v-tabs-bar>
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
