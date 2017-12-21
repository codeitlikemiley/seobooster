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
            <span class="accent--text">Accounts</span>
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
    </v-container>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import BlogAccounts from '../components/accounts/BlogAccounts.vue'  
import SocialAccounts from '../components/accounts/SocialAccounts.vue'
import VideoAccounts from '../components/accounts/VideoAccounts.vue'

export default {
    components: {
        MainLayout,
        BlogAccounts,
        SocialAccounts,
        VideoAccounts
    },
    mixins: [Theme],
    data: () => ({
        accounts: {
            blog: [],
            social: [],
            video: []
        },
        /* tabs */
        tabs: [
            {name: 'blog accounts', component: 'blog-accounts', icon: 'fa-newspaper-o', iconColor: 'blue-grey', accounts:[]},
            {name: 'social accounts', component: 'social-accounts', icon: 'fa-share-alt', iconColor: 'light-blue',accounts:[]},
            {name: 'video accounts', component: 'video-accounts', icon: 'fa-youtube-play ', iconColor: 'red darken-4',accounts:[]}
        ],
        active: {
            name: 'blog accounts'
        }
    }),
    created () {
        this.getAccountsByType('blog')
        this.getAccountsByType('social')
        this.getAccountsByType('video')
    },
    methods: {
        async getAccountsByType(type='') {
            let self = this

            await axios.post(`/api/accounts/${type}`).then(({data}) => {
                if(type === 'blog'){
                    self.accounts.blog = data.data
                    self.tabs[0].accounts = data.data
                }   
                else if(type === 'social'){
                    self.accounts.social = data.data
                    self.tabs[1].accounts = data.data
                }
                else if(type === 'video'){
                    self.accounts.video = data.data
                    self.tabs[2].accounts = data.data
                } else{
                    console.log('index')
                }
            })
            
        }
    }
}
</script>
