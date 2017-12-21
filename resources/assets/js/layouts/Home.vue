<template>
  <v-app v-cloak>
    <!-- No Side Bar For Home Page -->
    <home-nav-bar/>
    <main>
      <v-container 
        transition="slide-x-transition" 
        fluid
        pa-0
        ma-0
      >
        <slot/>
      </v-container>
    </main>
    <cookie-law/>
    <app-footer/>
  </v-app>
</template>

<script>
import AppFooter from '../partials/AppFooter.vue'
import HomeNavBar from '../partials/HomeNavBar'
import CookieLaw from '../partials/CookieLaw.vue'

export default {
    components: {
        AppFooter,
        CookieLaw,
        HomeNavBar
    }
}
</script>
