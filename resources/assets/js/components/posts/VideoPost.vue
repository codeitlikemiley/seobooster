<template>
<v-card flat>
      <v-card-text>
        <v-container>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
              <v-text-field
                v-model="name"
                name="name"
                label="Campaign Name"
                single-line
                prepend-icon="fa-fa"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
              <v-text-field
                v-model="title"
                name="title"
                label="Video Title"
                prepend-icon="fa-book"
                single-line
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
                <v-text-field
                name="social_decription"
                label="Video Description"
                prepend-icon="pageview"
                disabled
                single-line
                >
                </v-text-field>
                <v-text-field
                name="decription"
                v-model="description"
                textarea
                >
                </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
              <v-checkbox
                color="green"
                v-model="spin"
              >
                <div slot="label" @click.stop="">
                 <v-icon color="info">autorenew</v-icon> Do you Want To Spin This Post?
                </div>
              </v-checkbox>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
                <v-dialog
                persistent
                v-model="modal"
                lazy
                full-width
                width="290px"
                >
                    <v-text-field
                        slot="activator"
                        label="Schedule Social Post"
                        v-model="scheduled_at"
                        prepend-icon="event"
                        readonly
                    >
                    </v-text-field>
                    <v-date-picker v-model="scheduled_at" scrollable actions>
                        <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                            <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                        </template>
                    </v-date-picker>
                </v-dialog>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
              <v-text-field
                v-model="videoName"
                name="filename"
                label="Video"
                prepend-icon="image"
                single-line
                :append-icon="!!videoName ? 'fa-remove' : ''"
                :append-icon-cb="() => (removeVideo())"
              ></v-text-field>

            </v-flex>
            <v-flex xs2>
                <upload-button :title="video_title" :selectedCallback="fileSelectedFunc">
                </upload-button>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md8 offset-md2>
                <!-- image preview -->
                <v-card-media
                v-if="video"
                :src="imageUrl"
                height="250px"
                contain
                >
                </v-card-media>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
              <v-flex xs12 md8 offset-md2>
                  <v-btn block color="accent" class="white--text">Create New Post <v-icon right>send</v-icon></v-btn>
              </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
</template>

<script>
import TextEditor from '../../components/TextEditor.vue'
import UploadButton from '../../components/UploadButton.vue'

export default {
    props: ['tab'],
    components: {
        TextEditor,
        UploadButton
    },
    data: () => ({
        name: '',
        title: '',
        body: '',
        bookmark: '',
        embed: '',
        spin: false,
        description: '',
        keywords: [],
        scheduled_at: null,
        /* image related */
        video: null,
        imageUrl: '',
        videoName: '',
        /* set of save keywords in db */
        items: [],
        modal: false

    }),
    computed: {
        'video_title' () {
            if (!this.videoName) {
                return 'Upload Video'
            } else {
                return 'Remove Video'
            }
        }
    },
    methods: {
        //! prop function of upload button
        fileSelectedFunc (file) {
            let self = this
            this.videoName = file.name
            this.video = file
            let reader = new FileReader()

            reader.onload = function (event) {
                self.imageUrl = event.target.result
            }
            reader.readAsDataURL(file)
        },
        removeVideo () {
            this.video = null
            this.videoName = ''
            this.imageUrl = ''
        }
    }
}
</script>

<style>

</style>
