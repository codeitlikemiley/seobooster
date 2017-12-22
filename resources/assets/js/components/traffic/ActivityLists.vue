<template>
  <v-dialog 
    v-model="dialog" 
    fullscreen 
    transition="dialog-bottom-transition" 
    :overlay="false"
  >
    <v-card>
      <v-toolbar 
        dark 
        color="accent" 
        style="z-index:1000;"
      >
        <v-btn 
          icon
          @click.native="dialog = false" 
          dark
        >
          <v-icon color="primary">close</v-icon>
        </v-btn>
        <v-spacer/>
        <v-toolbar-title>
          <span class="primary--text headline">Campaign Activities</span>
        </v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn 
            dark 
            flat 
            @click.native="dialog = false" 
            color="primary"
          >
            Close
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container>
        <v-layout 
          row 
          wrap
        >
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-list>
              <v-list-group 
                v-for="(item,itemIndex) in items" 
                :key="itemIndex"
              >
                <v-list-tile slot="item" @click="">
                  <v-list-tile-action>
                    <v-icon>fa-plus</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ item.name }} - Total Duration: {{ item.total_duration }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile 
                  v-for="(subItem,subItemKey) in item.activities" 
                  :key="subItemKey" 
                  @click=""
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    {{ subItem.duration }}
                  </v-list-tile-action>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-flex>
        </v-layout>

      </v-container>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        items: [
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '5 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                activities: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            },
            {
                name: 'https://google.com',
                completed: false,
                total_duration: '100secs',
                items: [
                    { name: 'Visited https://google.com', duration: '15 secs' },
                    { name: 'Visited https://google.com', duration: '25 secs' },
                    { name: 'Visited https://google.com', duration: '35 secs' }
                ]
            }
        ]
    }),
    mounted () {
        let self = this
        Bus.$on('open-activity-modal', () => {
            self.dialog = true
        })
    }
}
</script>

<style>

</style>
