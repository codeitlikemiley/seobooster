<template>
  <main-layout 
    :dark="false" 
    :style="{ paddingTop: `100px`, backgroundColor: `white` }"
  >
    <v-container fluid>
      <v-layout 
        row 
        wrap
      >
        <v-breadcrumbs>
          <v-icon 
            slot="divider" 
            color="teal"
          >
            forward
          </v-icon>
          <v-breadcrumbs-item
            active-class="primary--text"
            :disabled="false"
            to="/dashboard"
          >
            Dashboard
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :disabled="true"
          >
            <span class="blue-grey--text">Published Post</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-layout>
      <v-tabs 
        fixed 
        icons 
        centered
      >
        <v-toolbar color="white">
          <v-tabs-bar class="white">
            <v-tabs-slider color="primary"/>
            <v-tabs-item
              v-for="(tab,key) in tabs"
              :key="key"
              :href="`#${tab.name}`"
              ripple
              class="primary--text"
            >
              <v-icon :color="tab.iconColor">{{ tab.icon }}</v-icon>
              {{ tab.name }}
            </v-tabs-item>
          </v-tabs-bar>
        </v-toolbar>
        <v-tabs-items>
          <v-tabs-content
            v-for="(tab, key) in tabs"
            :key="key"
            :id="tab.name"
          >
            <v-card flat>
              <component 
                :is="tab.component" 
                :tab="tab"
              />
            </v-card>
          </v-tabs-content>
        </v-tabs-items>
      </v-tabs>
    </v-container>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import Acl from '../mixins/acl'
import BlogPosted from '../components/published/BlogPosted.vue'
import SocialPosted from '../components/published/SocialPosted.vue'
import VideoPosted from '../components/published/VideoPosted.vue'

export default {
    components: {
        MainLayout,
        BlogPosted,
        SocialPosted,
        VideoPosted
    },
    mixins: [Theme, Acl],
    data: () => ({

        /* tabs */
        tabs: [
            {name: 'blog posted', component: 'blog-posted', icon: 'fa-newspaper-o', iconColor: 'amber'},
            {name: 'social posted', component: 'social-posted', icon: 'fa-address-book', iconColor: 'cyan'},
            {name: 'video posted', component: 'video-posted', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        active: {
            name: 'blog posted'
        }
    })
}
</script>
