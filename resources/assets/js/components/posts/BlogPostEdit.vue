<template>
  <v-card flat>
    <v-card-text>
      <v-container>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-text-field
              v-model="name"
              name="name"
              label="Campaign Name"
              single-line
              prepend-icon="fa-fa"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-text-field
              v-model="title"
              name="title"
              label="Blog Title"
              prepend-icon="fa-book"
              single-line
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-text-field
              name="body"
              label="Body"
              prepend-icon="subject"
              disabled
              single-line
            />
            <text-editor 
              id="blogpost-body" 
              :html="body" 
              :disabled="false"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-text-field
              v-model="bookmark"
              name="url"
              label="Bookmark Url"
              prepend-icon="bookmark"
              hint="Enter your website URL will be added as a bookmark"
              persistent-hint
              single-line
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-text-field
              name="preview-embed"
              label="Video Embeded Code"
              prepend-icon="code"
              single-line
              disabled
            />
            <v-text-field
              name="embed"
              v-model="embed"
              textarea
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-checkbox
              color="green"
              v-model="spin"
            >
              <div 
                slot="label" 
                @click.stop=""
              >
                Do you Want To Spin  <v-icon color="info">autorenew</v-icon> Text?
              </div>
            </v-checkbox>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-text-field
              v-model="preview_title"
              name="preview_title"
              label="Preview title"
              prepend-icon="rate_review"
              hint="*Plurk Title"
              persistent-hint
              single-line
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-text-field
              name="preview_decription"
              label="Preview Description"
              hint="*Blogger Body"
              persistent-hint
              prepend-icon="pageview"
              disabled
              single-line
            />
            <v-text-field
              name="decription"
              v-model="description"
              textarea
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-select
              v-model="keywords"
              label="Keywords"
              chips
              tags
              prepend-icon="fa-tags"
              :items="items"
            >
              <template 
                slot="selection" 
                slot-scope="data"
              >
                <v-chip
                  @input="data.parent.selectItem(data.item)"
                  class="chip--select-multi"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  :key="JSON.stringify(data.item)"
                >
                  <v-avatar class="primary">{{ data.item.slice(0, 1).toUpperCase() }}</v-avatar>
                  {{ data.item }}
                </v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-dialog
              persistent
              v-model="modal"
              lazy
              full-width
              width="290px"
            >
              <v-text-field
                slot="activator"
                label="Schedule Blog Post"
                v-model="scheduled_at"
                prepend-icon="event"
                readonly
              />
              <v-date-picker 
                v-model="scheduled_at" 
                scrollable 
                actions
              >
                <template slot-scope="{ save, cancel }">
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn 
                      flat 
                      color="primary" 
                      @click="cancel"
                    >
                      Cancel
                    </v-btn>
                    <v-btn 
                      flat 
                      color="primary" 
                      @click="save"
                    >
                      OK
                    </v-btn>
                  </v-card-actions>
                </template>
              </v-date-picker>
            </v-dialog>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-text-field
              v-model="imageName"
              name="filename"
              label="Featured Image"
              prepend-icon="image"
              single-line
              :append-icon="!!imageName ? 'fa-remove' : ''"
              :append-icon-cb="() => (removeImage())"
            />

          </v-flex>
          <v-flex xs2>
            <upload-button 
              :title="image_title" 
              :selected-callback="fileSelectedFunc"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <!-- image preview -->
            <v-card-media
              v-if="image"
              :src="imageUrl"
              height="250px"
              contain
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap
        >
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-btn 
              block 
              color="accent" 
              class="white--text"
            >
              Create New Post 
              <v-icon right>send</v-icon>
            </v-btn>
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
    components: {
        TextEditor,
        UploadButton
    },
    props:{
        tab: {
            type: Object,
            required: true
        }
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
        preview_title: '',
        /* image related */
        image: null,
        imageUrl: '',
        imageName: '',
        /* set of save keywords in db */
        items: [],
        modal: false

    }),
    computed: {
        'image_title' () {
            if (!this.imageName) {
                return 'Upload Image'
            } else {
                return 'Remove Image'
            }
        }
    },
    methods: {
        //! prop function of upload button
        fileSelectedFunc (file) {
            let self = this
            this.imageName = file.name
            this.image = file
            let reader = new FileReader()

            reader.onload = function (event) {
                self.imageUrl = event.target.result
            }
            reader.readAsDataURL(file)
        },
        removeImage () {
            this.image = null
            this.imageName = ''
            this.imageUrl = ''
        }
    }
}
</script>

<style>

</style>
