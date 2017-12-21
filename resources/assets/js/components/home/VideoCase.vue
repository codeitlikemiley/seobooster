<template>
  <v-container 
    fluid 
    class="pa-0 ma-0"
  >
    <v-layout 
      row 
      wrap
    >
      <v-flex 
        xs12 
        text-xs-center
      >
        <h1 class="primary--text">SEE IT IN ACTIONS</h1>
        <h2 class="headline accent--text">Watch Us Manage Our Entire Social SEO In Seconds</h2>
      </v-flex>
    </v-layout>
    <v-layout
      row 
      justify-center
    >
      <v-flex 
        xs12 
        sm12 
        md4 
        lg4 
        xl4 
        v-for="(video,key) in videos" 
        :key="key" 
        text-xs-center 
        pa-2
      >
        <v-card>
          <v-card-media 
            :src="video.poster"
            :style="{ backgroundImage: 'url(' + video.poster + ')', height: imageHeight }"
            style="cursor:pointer;"
            @click="changeVideo(video)"
          />
          <v-card-title 
            style="background-color: #333333;" 
            v-if="showVideoTitle"
          >
            <v-spacer/>
            <span class="headline white--text">{{ video.title }}</span>
            <v-spacer/>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout 
      row 
      wrap 
      v-if="loaded"
    >
      <v-flex 
        xs12 
        text-xs-center
      >
        <youtube 
          :video-id="youtube_id" 
          :player-width="youtubeWidth" 
          :player-height="youtubeHeight"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    data: () => ({
        videos: [
            {
                title: 'Dashboard In Action',
                href: 'https://www.youtube.com/watch?v=LcFKfU3E9V0',
                type: 'text/html',
                youtube: 'LcFKfU3E9V0',
                poster: 'https://img.youtube.com/vi/LcFKfU3E9V0/maxresdefault.jpg'
            },
            {
                title: 'Social Auto Post In Action',
                href: 'https://www.youtube.com/watch?v=7Lp-gHNovaM',
                type: 'text/html',
                youtube: '7Lp-gHNovaM',
                poster: 'https://img.youtube.com/vi/7Lp-gHNovaM/maxresdefault.jpg'
            },
            {
                title: 'Traffic Booster In Action',
                href: 'https://www.youtube.com/watch?v=4uTQscZe4Yg',
                type: 'text/html',
                youtube: '4uTQscZe4Yg',
                poster: 'https://img.youtube.com/vi/4uTQscZe4Yg/maxresdefault.jpg'
            }
        ],
        youtube_id: 'l-nKCcfSMHc',
        loaded: false
    }),
    computed: {
        imageHeight () {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '100px'
            case 'sm': return '100px'
            case 'md': return '150px'
            case 'lg': return '250px'
            case 'xl': return '250px'
            }
        },
        youtubeHeight () {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '315px'
            case 'sm': return '315px'
            case 'md': return '450px'
            case 'lg': return '750px'
            case 'xl': return '864px'
            }
        },
        youtubeWidth () {
            let width = window.innerWidth

            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return `${width}px`
            case 'sm': return `${width}px`
            case 'md': return `${width}px`
            case 'lg': return `${width}px`
            case 'xl': return `${width}px`
            }
        },
        showVideoTitle () {
            switch (this.$vuetify.breakpoint.name) {
            case 'xs': return false
            case 'sm': return true
            case 'md': return true
            case 'lg': return true
            case 'xl': return true
            }
        }
    },
    methods: {
        changeVideo (video) {
            this.youtube_id = video.youtube
            this.loaded = true
        }

    }
}
</script>

<style>

</style>
