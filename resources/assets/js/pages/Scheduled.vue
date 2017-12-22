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
            <span class="accent--text">Scheduled Post</span>
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
import BlogScheduled from '../components/scheduled/BlogScheduled.vue'
import SocialScheduled from '../components/scheduled/SocialScheduled.vue'
import VideoScheduled from '../components/scheduled/VideoScheduled.vue'

export default {
    components: {
        MainLayout,
        BlogScheduled,
        SocialScheduled,
        VideoScheduled
    },
    mixins: [Theme, Acl],
    data: () => ({

        /* tabs */
        tabs: [
            {name: 'blog scheduled', component: 'blog-scheduled', icon: 'fa-newspaper-o', iconColor: 'blue-grey'},
            {name: 'social scheduled', component: 'social-scheduled', icon: 'fa-share-alt', iconColor: 'light-blue'},
            {name: 'video scheduled', component: 'video-scheduled', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        active: {
            name: 'blog scheduled'
        }
    })
}
</script>
