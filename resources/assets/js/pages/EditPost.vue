<template>
  <main-layout :style="{ paddingTop: `100px`, backgroundColor: `white` }">
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
            <span class="blue-grey--text">Edit {{ post | capitalize }} Posts</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-layout>
      <v-layout 
        row 
        wrap
      >
        <v-tabs 
          fixed 
          icons 
          centered 
          v-model="activeTab"
        >
          <v-tabs-bar>
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
          <v-tabs-items>
            <v-tabs-content
              v-for="(tab, key) in tabs"
              :key="key"
              :id="tab.name"
            >
              <v-card 
                flat 
                :light="true"
              >
                <component 
                  :is="tab.component" 
                  :tab="tab"
                />
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-layout>
    </v-container>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import Acl from '../mixins/acl'
import BlogPostEdit from '../components/posts/BlogPostEdit.vue'
import SocialPostEdit from '../components/posts/SocialPostEdit.vue'
import VideoPostEdit from '../components/posts/VideoPostEdit.vue'

export default {
    components: {
        MainLayout,
        BlogPostEdit,
        SocialPostEdit,
        VideoPostEdit

    },
    mixins: [Theme, Acl],
    data: () => ({
        /* tabs */
        tabs: [
            {name: 'blog post edit', component: 'blog-post-edit', icon: 'fa-newspaper-o', iconColor: 'amber lighten-2'},
            {name: 'social post edit', component: 'social-post-edit', icon: 'fa-address-book', iconColor: 'cyan'},
            {name: 'video post edit', component: 'video-post-edit', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        activeTab: '',
        post: ''
    }),
    created () {
        this.getTab()
    },
    methods: {
        getTab () {
            let self = this
            let segment = window.location.pathname.split('/')
            let activeTab = _.filter(self.tabs, function (tab) {
                return tab.name === `${segment[1]} post edit`
            })
            self.tabs = activeTab
            self.post = segment[1]
            self.activeTab = activeTab[0].name
        }
    }
}
</script>
