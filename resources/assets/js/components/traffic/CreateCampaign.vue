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
          <span class="primary--text">Create Traffic Campaign</span>
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
            <v-select
              v-model="group_name"
              label="Group Name"
              prepend-icon="folder"
              chips
              :items="group_list"
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
                  <v-avatar class="accent white--text">{{ data.item.slice(0, 1).toUpperCase() }}</v-avatar>
                  <span class="primary--text">{{ data.item }}</span>
                </v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
        <v-flex 
          xs12 
          md8 
          offset-md2
        >
          <v-text-field
            v-model="url"
            name="url"
            label="Url"
            prepend-icon="link"
            hint="Enter your website URL starting with http:// or https://"
            persistent-hint
            single-line
          />
        </v-flex>
        <v-layout row>
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-radio-group 
              v-model="traffic_type" 
              :mandatory="true" 
              row
            >
              <v-radio 
                color="primary" 
                label="Via Search Engine" 
                value="search_engine"
              />
              <v-radio 
                color="info" 
                label="Via Direct Traffic" 
                value="direct_traffic"
              />
            </v-radio-group>
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
              :items="keyword_list"
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
        <v-layout 
          row 
          v-if="traffic_type === 'search_engine'"
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-radio-group
              v-model="search_engine_type"
              :mandatory="true" 
              row
            >
              <v-radio 
                color="blue darken-2" 
                label="Google Search Engine" 
                value="google" 
                prepend-icon="fa-google"
              />
              <v-radio 
                color="red darken-4" 
                label="Youtube Search Engine" 
                value="youtube" 
                prepend-icon="fa-youtube"
              />
            </v-radio-group>
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          v-if="traffic_type === 'search_engine'"
        >
          <v-flex
            xs12 
            md8 
            offset-md2 
            v-if="search_engine_type === 'google'"
          >
            <v-select
              v-model="search_engine"
              label="Google Search Engine"
              chips
              prepend-icon="fa-tags"
              :items="google_search_engine"
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
        <v-layout 
          row
          v-if="traffic_type === 'search_engine'"
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
            v-if="search_engine_type === 'youtube'"
          >
            <v-select
              v-model="search_engine"
              label="Youtube Search Engine"
              chips
              prepend-icon="fa-tags"
              :items="youtube_search_engine"
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
        <v-layout 
          row
          wrap
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-switch 
              :label="`Geo Location Tracking: ${geo_tracking === true ? 'ON' : 'OFF'}`" 
              v-model="geo_tracking"
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap 
          v-if="geo_tracking"
        >
          <v-flex 
            xs12 
            md8 
            offset-md2 
            d-flex
          >
            <v-layout 
              row 
              wrap
            >
              <v-flex 
                xs4 
                d-flex
              >
                <v-select
                  v-model="country"
                  label="By Country"
                  chips
                  prepend-icon="fa-fa"
                  :items="country_list"
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
              <v-flex 
                xs4 
                d-flex
              >
                <v-select
                  v-model="state"
                  label="By State"
                  chips
                  prepend-icon="map"
                  :items="state_list"
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
              <v-flex 
                xs4 
                d-flex
              >
                <v-select
                  v-model="city"
                  label="By City"
                  chips
                  prepend-icon="location_city"
                  :items="state_list"
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
            <v-switch 
              :label="`Internal Browsing: ${internal_browsing === true ? 'ON' : 'OFF'}`" 
              v-model="internal_browsing"
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap 
          v-if="internal_browsing"
        >
          <v-flex 
            xs12
            md8 
            offset-md2
          >
            <v-switch 
              :label="`Random Browsing: ${random_browsing === true ? 'ON' : 'OFF'}`"
              v-model="random_browsing"
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap 
          v-if="random_browsing === false"
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-select
              v-model="sites"
              label="Add Site Urls"
              chips
              prepend-icon="public"
              :items="site_list"
              tags
              hint="Enter All Site URLs You Want To Browse"
              persistent-hint
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
        <v-layout 
          row 
          wrap
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-switch 
              :label="`Bounce Back: ${bounce_back === true ? 'ON' : 'OFF'}`" 
              v-model="bounce_back"
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
            <v-switch 
              :label="`Play Video Embeds: ${play_video_embeds === true ? 'ON' : 'OFF'}`" 
              v-model="play_video_embeds"
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row
          wrap 
          v-if="play_video_embeds"
        >
          <v-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-text-field
              label="Minimum Spent To Watch"
              v-model.number="min_spent_to_watch"
              type="number"
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
            <v-switch 
              :label="`Social Sharing: ${social_sharing === true ? 'ON' : 'OFF'}`"
              v-model="social_sharing"
            />
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap 
          v-if="social_sharing"
        >
          <v-flex
            d-flex 
            xs12 
            md8 
            offset-md2
          >
            <v-layout 
              row 
              wrap
            >
              <v-flex 
                xs6 
                d-flex 
                pa-1
              >
                <v-text-field
                  label="Re-Tweets/Month"
                  v-model.number="retweets_per_month"
                  type="number"
                />
              </v-flex>
              <v-flex 
                xs6 
                d-flex
                pa-1
              >
                <v-text-field
                  label="Favourites/Month"
                  v-model.number="favourites_per_month"
                  type="number"
                />
              </v-flex>
            </v-layout>
            <v-layout 
              row
              wrap
            >
              <v-flex 
                xs6 
                d-flex 
                pa-1
              >
                <v-text-field
                  label="FB Likes/Month"
                  v-model.number="facebook_likes_per_month"
                  type="number"
                />
              </v-flex>
              <v-flex 
                xs6 
                d-flex 
                pa-1
              >
                <v-text-field
                  label="FB Shares/Month"
                  v-model.number="facebook_shares_per_month"
                  type="number"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
        >
          <v-flex 
            d-flex
            xs12 
            md8 
            offset-md2
          >
            <v-layout 
              row
              wrap
            >
              <v-flex
                d-flex
                xs11
              >
                <v-slider
                  color="primary"
                  :min="50"
                  :max="1000"
                  v-model.number="search_boost_per_month"
                  step="1"
                  track-color="accent"
                  label="Search Boosts Per Month"
                />
              </v-flex>
              <v-flex
                d-flex 
                xs1
              >
                <v-text-field
                  single-line
                  v-model.number="search_boost_per_month"
                  type="number"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout 
          row 
          wrap
        >
          <v-flex 
            d-flex
            xs12
            md8 
            offset-md2
          >
            <v-layout 
              row 
              wrap
            >
              <v-flex
                d-flex
                xs11
              >
                <v-slider
                  color="primary"
                  :min="1"
                  :max="5"
                  v-model.number="minutes_spent_on_visit"
                  step="1"
                  track-color="accent"
                  label="Minutes Spent on Visit"
                />
              </v-flex>
              <v-flex
                d-flex 
                xs1
              >
                <v-text-field
                  single-line
                  v-model.number="minutes_spent_on_visit"
                  type="number"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout 
          row
          wrap
        >
          <v-flex 
            d-flex 
            xs12 
            md8 
            offset-md2
          >

            <v-layout 
              row 
              wrap
            >
              <v-flex 
                xs4 
                d-flex
              >
                <v-subheader class="accent--text">Approximate Daily Credit Cost</v-subheader>
              </v-flex>
              <v-flex 
                xs8 
                d-flex
              >
                <v-text-field
                  v-model.number="approx_daily_credit_cost"
                  type="number"
                  readonly
                />

              </v-flex>
            </v-layout>

          </v-flex>
          <v-flex 
            d-flex 
            xs12
            md8 
            offset-md2
          >
            <v-layout
              row 
              wrap
            >
              <v-flex 
                xs4 
                d-flex
              >
                <v-subheader class="accent--text">Approximate Montly Credit Cost</v-subheader>
              </v-flex>
              <v-flex 
                xs8 
                d-flex
              >
                <v-text-field
                  v-model.number="approx_monthly_cost"
                  type="number"
                  readonly
                />
              </v-flex>
            </v-layout>
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
            text-xs-center
          >
            <p class="red--text text--darken-2 caption">NOTE*: Daily credit consumption is only an approximation as our algorithm randomises daily searches and time on site to be natural.</p>
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

    </v-card>
  </v-dialog>
</template>

<script>
import TextEditor from '../TextEditor.vue'
import UploadButton from '../UploadButton.vue'
export default {
    components: {
        TextEditor,
        UploadButton
    },
    data: () => ({
        // ? First Step
        name: '',
        url: '',
        keywords: [],
        keyword_list: [],
        group_name: '',
        group_list: [
            'test1',
            'test2'
        ],
        traffic_type: '', // either direct or search engine
        search_engine_type: '', // google or youtube
        search_engine: '', // link of search engine domain of google or youtube
        google_search_engine: [
            'https://google.com',
            'https://google.com.ph'
        ],
        youtube_search_engine: [
            'https://youtube.com'
        ],
        // ? Second Step
        geo_tracking: false,
        country: '',
        country_list: [
            'Philippines',
            'US',
            'Australia'
        ],
        state: '',
        state_list: [
            'State 1',
            'State 2'
        ],
        internal_browsing: true,
        random_browsing: true,
        sites: '',
        site_list: [],
        bounce_back: true,
        play_video_embeds: false,
        min_spent_to_watch: 1,
        social_sharing: false,
        retweets_per_month: 1,
        favourites_per_month: 1,
        facebook_likes_per_month: 1, // either 0 or greater than 20
        facebook_shares_per_month: 1, // either 0 or greater than 20
        search_boost_per_month: 50, // min 50
        minutes_spent_on_visit: 1,
        dialog: false
    }),
    computed: {
        approx_daily_credit_cost () {
            return 1.67 * this.minutes_spent_on_visit
        },
        approx_monthly_cost () {
            return this.search_boost_per_month
        }
    },
    mounted () {
        let self = this
        Bus.$on('open-create-campaign-modal', () => {
            self.dialog = true
        })
    }
}
</script>

<style>

</style>
