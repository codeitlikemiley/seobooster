<template>
  <main-layout>
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
            <span class="accent--text">Reports</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-layout>
      <v-tabs 
        fixed 
        icons 
        centered
      >
        <v-toolbar>
          <v-tabs-bar>
            <v-tabs-slider color="primary"/>
            <v-tabs-item
              v-for="(tab,key) in tabs"
              :key="key"
              :href="`#${tab.name}`"
              ripple
              class="accent--text"
            >
              <v-icon :color="tab.iconColor">{{ tab.icon }}</v-icon>
              <span 
                :class="$vuetify.breakpoint.width >= 600 && 'headline'"
              >
                {{ tab.name }}
              </span>
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
import BlogReports from '../components/reports/BlogReports.vue'
import SocialReports from '../components/reports/SocialReports.vue'
import VideoReports from '../components/reports/VideoReports.vue'

export default {
    components: {
        MainLayout,
        BlogReports,
        SocialReports,
        VideoReports
    },
    mixins: [Theme, Acl],
    data: () => ({

        /* tabs */
        tabs: [
            {name: 'blog reports', component: 'blog-reports', icon: 'fa-newspaper-o', iconColor: 'blue-grey'},
            {name: 'social reports', component: 'social-reports', icon: 'fa-share-alt ', iconColor: 'light-blue'},
            {name: 'video reports', component: 'video-reports', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        active: {
            name: 'blog reports'
        }
    })
}
</script>
