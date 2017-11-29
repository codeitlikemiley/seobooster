<template>
  <main-layout :dark="false"  :style="{ paddingTop: `100px`, backgroundColor: `white` }">
      <v-container  fluid>
        <v-layout row wrap>
            <v-breadcrumbs light icons divider="forward">
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
                    <span class="blue-grey--text">Posts</span>
                </v-breadcrumbs-item>
            </v-breadcrumbs>
        </v-layout>
        <v-tabs fixed light centered>
            <v-toolbar color="white" light>
                <v-tabs-bar class="white" slot="extension">
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tabs-item
                v-for="(tab,key) in tabs"
                :key="key"
                :href="`#${tab.name}`"
                ripple
                class="primary--text"
                >
                <v-icon :color="tab.iconColor">{{tab.icon}}</v-icon>
                </v-tabs-item>
                </v-tabs-bar>
            </v-toolbar>
            <v-tabs-items>
                <v-tabs-content
                 v-for="(tab, key) in tabs"
                :key="key"
                :id="tab.name"
                >
                <v-card flat :light="true">
                    <component :is="tab.component" :tab="tab">
                    </component>
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
    mixins: [Theme, Acl],
    components: {
        MainLayout,
        BlogPost,
        SocialPost,
        VideoPost

    },
    data: () => ({
        /* tabs */
        tabs: [
            {name: 'blog post', component: 'blog-post', icon: 'fa-newspaper-o', iconColor: 'amber lighten-2'},
            {name: 'social post', component: 'social-post', icon: 'fa-address-book', iconColor: 'cyan'},
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
