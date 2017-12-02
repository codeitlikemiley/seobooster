<template>
<main-layout :style="{ paddingTop: `100px`, backgroundColor: `white` }">
    <v-container  fluid>
        <v-layout row wrap>
            <v-breadcrumbs>
                <v-icon slot="divider" color="teal">forward</v-icon>
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
                    <span class="blue-grey--text">Failed Posts</span>
                </v-breadcrumbs-item>
            </v-breadcrumbs>
        </v-layout>
        <v-layout row wrap>
        <v-tabs fixed icons centered>
                <v-tabs-bar>
                <v-tabs-slider color="primary"></v-tabs-slider>
                <v-tabs-item
                v-for="(tab,key) in tabs"
                :key="key"
                :href="`#${tab.name}`"
                ripple
                class="primary--text"
                >
                <v-icon :color="tab.iconColor">{{tab.icon}}</v-icon>
                {{ tab.name }}
                </v-tabs-item>
                </v-tabs-bar>
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
        </v-layout>
    </v-container>
</main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import Acl from '../mixins/acl'
import BlogFailure from '../components/failure/BlogFailure.vue'
import SocialFailure from '../components/failure/SocialFailure.vue'
import VideoFailure from '../components/failure/VideoFailure.vue'

export default {
    mixins: [Theme, Acl],
    components: {
        MainLayout,
        BlogFailure,
        SocialFailure,
        VideoFailure
    },
    data: () => ({

        /* tabs */
        tabs: [
            {name: 'blog failure', component: 'blog-failure', icon: 'fa-newspaper-o', iconColor: 'amber lighten-2'},
            {name: 'social failure', component: 'social-failure', icon: 'fa-address-book', iconColor: 'cyan'},
            {name: 'video failure', component: 'video-failure', icon: 'fa-youtube-play ', iconColor: 'red darken-4'}
        ],
        active: {
            name: 'blog failure'
        }
    })
}
</script>
