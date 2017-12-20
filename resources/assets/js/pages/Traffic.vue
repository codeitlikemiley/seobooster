<template>
  <main-layout :style="{ paddingTop: `100px`, backgroundColor: `white` }">
    <v-container fluid>
      <action-panel 
        :lifetime="lifetime" 
        :monthly="monthly" 
        :project-count="socialCount"
      />
      <v-layout 
        row 
        wrap
      >
        <v-flex 
          xs6 
          md4
        >
          <v-btn 
            color="accent" 
            dark 
            @click.native="AddCampaign()"
          >
            Add New Campaigns
            <v-icon right>fa-plus</v-icon>
          </v-btn>
        </v-flex>
        <v-flex 
          xs6 
          md4 
          offset-md4
          text-xs-right
        >
          <v-btn 
            color="lime lighten-2" 
            dark
          >
            Total Credits
            <v-icon right>fa-money</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-tabs 
        fixed 
        icons 
        centered
      >
        <v-toolbar 
          color="white" 
          light
        >
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
      <create-campaign/>
    </v-container>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import Acl from '../mixins/acl'
import ActionPanel from '../components/traffic/ActionPanel.vue'
import TrafficPerformance from '../components/traffic/TrafficPerformance.vue'
import CreateCampaign from '../components/traffic/CreateCampaign.vue'

export default {
    components: {
        MainLayout,
        ActionPanel,
        TrafficPerformance,
        CreateCampaign
    },
    mixins: [Theme, Acl],
    data: () => ({
        contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
        lifetime: 0,
        monthly: 0,
        socialCount: 0,
        /* tabs */
        tabs: [
            {name: 'traffic performance', component: 'traffic-performance', icon: 'trending_up', iconColor: 'cyan'}
        ],
        active: {
            name: 'traffic performance'
        }

    }),
    methods: {
        AddCampaign () {
            Bus.$emit('open-create-campaign-modal')
        }
    }
}
</script>
