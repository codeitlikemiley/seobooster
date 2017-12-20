<template>
  <v-container 
    fluid 
    pa-0 
    ma-0 
    class="accent"
  >
    <v-layout 
      row 
      wrap 
      pa-0 
      ma-0
    >
      <v-flex 
        xs12 
        text-xs-center 
        pa-0
        ma-0
      >
        <v-card-text><h2 class="white--text"><em>YES!</em></h2></v-card-text>
      </v-flex>
      <v-flex 
        xs12 
        text-xs-center
        pa-0
        ma-0
      >
        <v-card-text class="headline white--text">
          <p><em>I would like to save thousands in social SEO outsourcing </em></p>
          <p><em>and add social SEO to my arsenal today</em></p>
        </v-card-text>
      </v-flex>
      <v-flex 
        xs12 
        text-xs-center 
        pb-5
      >
        <v-btn 
          color="primary" 
          :to="link"
        >
          <span class="white--text">
            Click Here To Get Started!
          </span>
          <v-icon 
            right 
            dark
          >
            person_pin
          </v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Acl from '../../mixins/acl'

export default {
    mixins: [Acl],
    data: () => ({
        link: '/register'
    }),
    mounted () {
        let self = this
        if (self.isLoggedIn()) {
            self.link = '/dashboard'
        }
    }
}
</script>

<style>

</style>
