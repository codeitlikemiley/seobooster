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
            active-class="accent--text"
            :disabled="false"
            to="/dashboard"
          >
            Dashboard
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :disabled="true"
          >
            <span class="accent--text">Create Post</span>
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
import BlogPost from '../components/posts/BlogPost.vue'
import SocialPost from '../components/posts/SocialPost.vue'
import VideoPost from '../components/posts/VideoPost.vue'

export default {
    components: {
        MainLayout,
        BlogPost,
        SocialPost,
        VideoPost
    },
    mixins: [Theme, Acl],
    data: () => ({
        /* tabs */
        tabs: [
            {name: 'blog post', component: 'blog-post', icon: 'fa-newspaper-o', iconColor: 'blue-grey'},
            {name: 'social post', component: 'social-post', icon: 'fa-share-alt', iconColor: 'light-blue'},
            {name: 'video post', component: 'video-post', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        active: {
            name: 'blog post'
        }
    })
}
</script>

<style scoped>
.breadcrumbs li:not(:last-child):after {
    color: #009688;
    content: attr(data-divider);
    vertical-align: middle;
}
</style>
