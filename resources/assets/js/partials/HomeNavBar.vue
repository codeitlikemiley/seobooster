<template>
  <v-toolbar 
    color="accent" 
    fixed 
    app
  >
    <!-- Title -->
    <v-toolbar-title 
      v-if="extension" 
      class="text-xs-center ml-0 pl-3" 
      :class="$vuetify.breakpoint.width <= 1264 && 'pr-3'" 
      slot="extension" 
      :style="$vuetify.breakpoint.width > 1264 && 'width: 300px'"
    >
      <v-icon 
        :style="{color: iconColor }" 
        class="ml-3 hidden-md-and-down" 
        v-if="showIcon"
      >
        {{ icon }}
      </v-icon>
      <span 
        class="hidden-md-and-down" 
        :style="titleStyle"
      >
        {{ title }}
      </span>
    </v-toolbar-title>
    <v-toolbar-title 
      v-else 
      class="text-xs-center"
    >
      <v-icon 
        :style="{color: iconColor }" 
        class="ml-3 hidden-md-and-down" 
        v-if="showIcon"
      >
        {{ icon }}
      </v-icon>
      <span 
        class="hidden-md-and-down" 
        :style="titleStyle"
      >
        {{ title }}
      </span>
    </v-toolbar-title>
    <v-spacer/>
    <!-- center logo -->
    <img 
      v-if="showLogo" 
      class="hidden-md-and-up" 
      :src="logo" 
      :style="[logoStyle]"
      alt="App.site.title"
    >
    <v-spacer/>
    <v-btn 
      v-if="!isAuthenticated"
      outline 
      color="accent"
      to="/login"
    >
      <span class="primary--text">Login</span>
      <v-icon 
        right 
        color="teal"
      >
        fa-sign-in
      </v-icon>
    </v-btn>
    <v-btn 
      v-if="!isAuthenticated"
      outline 
      color="accent"
      to="/register"
    >
      <span class="primary--text">Register</span>
      <v-icon 
        right 
        color="light-green lighten-3"
      >
        fa-user-plus
      </v-icon>
    </v-btn>
    <v-btn 
      v-if="isAuthenticated"
      outline 
      color="accent"
      to="/logout"
    >
      <span class="primary--text">Logout</span>
      <v-icon 
        right 
        color="red darken-4"
      >
        fa-sign-out
      </v-icon>
    </v-btn>
    <v-btn 
      outline
      color="accent"
      to="/support"
    >
      <span class="primary--text">Contact Us</span>
      <v-icon 
        right 
        color="amber lighten-2"
      >
        fa-life-ring
      </v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import Theme from '../mixins/theme'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('auth')

export default {
    mixins: [Theme],
    data: () => ({
        extension: false
    }),
    computed: {
        ...mapState({
            isAuthenticated: 'isAuthenticated'
        })
    },
    created () {
        /* Emit On a Child Component If You Want This To Be Visible */
        Bus.$on('header-extension-visible', (visibility) => {
            this.extension = visibility
        })
    },
    methods: {
        toggleDrawer () {
            Bus.$emit('toggleDrawer')
        }
    }
}
</script>

<style>

</style>
