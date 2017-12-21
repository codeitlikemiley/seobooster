<template>
  <v-app 
    v-cloak 
    id="inspire"
  >
    <left-side-bar/>
    <app-nav-bar/>
    <v-content>
      <!-- added fluid and pa-0 ma-0 for full screen pages -->
      <v-container 
        transition="slide-x-transition" 
        fluid 
        fill-height
      >
        <slot/>
      </v-container>
    </v-content>
    <fab-button/>
    <app-footer/>
  </v-app>
</template>

<script>
import AppFooter from '../partials/AppFooter.vue'
import AppNavBar from '../partials/AppNavBar.vue'
import LeftSideBar from '../partials/LeftSideBar.vue'
import FabButton from '../components/FabButton.vue'

export default {
    components: {
        AppFooter,
        AppNavBar,
        LeftSideBar,
        FabButton
    }
}
</script>
