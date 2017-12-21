<template>
  <main-layout>

    <panel-row 
      :lifetime="lifetime" 
      :monthly="monthly" 
      :social-count="socialCount"
    />
    <v-tabs 
      fixed 
      light 
      centered
    >
      <v-toolbar 
        color="white" 
        light
      >
        <v-tabs-bar
          class="white" 
          slot="extension"
        >
          <v-tabs-slider color="primary"/>
          <v-tabs-item
            v-for="(tab,key) in tabs"
            :key="key"
            :href="`#${tab.name}`"
            ripple
            class="primary--text"
          >
            <v-icon :color="tab.iconColor">{{ tab.icon }}</v-icon>
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
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import Acl from '../mixins/acl'
import PanelRow from '../partials/PanelRow.vue'
import RecentActivities from '../components/dashboard/RecentActivities.vue'
import NetworkActivities from '../components/dashboard/NetworkActivities.vue'

export default {
    components: {
        MainLayout,
        PanelRow,
        RecentActivities,
        NetworkActivities

    },
    mixins: [Theme, Acl],
    data: () => ({
        contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
        lifetime: 0,
        monthly: 0,
        socialCount: 0,
        /* tabs */
        tabs: [
            {name: 'recent activities', component: 'recent-activities', icon: 'history', iconColor: 'cyan'},
            {name: 'network activities', component: 'network-activities', icon: 'fa-tasks', iconColor: 'green darken-2'}
        ],
        active: {
            name: 'recent activities'
        }

    })
}
</script>
