<template>
  <main-layout 
    :class="[contentClass]" 
    :style="{ paddingTop: `100px` }"
  >
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
            to="/"
          >
            Home
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :disabled="true"
          >
            <span class="blue-grey--text">Support</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-layout>
      <v-layout 
        row 
        wrap
      >
        <!-- left side -->
        <v-flex 
          d-flex 
          xs12 
          sm12 
          md6 
          lg6
        >
          <v-layout 
            row 
            wrap
          >
            <v-flex 
              d-flex 
              xs12 
              text-xs-center
            >
              <v-container 
                fill-height 
                fluid
              >
                <v-layout fill-height>
                  <v-flex 
                    xs12 
                    align-end 
                    flexbox
                  >
                    <p class="headline accent--text">Ask Questions</p>
                    <v-text-field
                      light
                      name="name"
                      label="Full Name"
                      v-model="name"
                    />
                    <v-text-field
                      light
                      name="email"
                      label="Email"
                      v-model="email"
                    />
                    <v-text-field
                      light
                      name="subject"
                      label="Subject"
                      v-model="subject"
                    />
                    <v-text-field
                      light
                      name="message"
                      label="Message"
                      v-model="message"
                      multi-line
                    />
                    <v-btn 
                      block 
                      color="accent" 
                      class="white--text" 
                      @click="submit"
                    >
                      Send
                      <v-icon right>send</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex 
          d-flex 
          xs12 
          sm12 
          md6 
          lg6
        >
          <v-layout 
            row 
            wrap
          >
            <v-flex 
              d-flex 
              xs12
            >
              <v-card 
                flat 
                light 
                color="grey lighten-4"
              >
                <v-card-title class="headline accent--text">Contact Details</v-card-title>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="red">place</v-icon> 1120 5TH Street
                </v-card-text>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="indigo">location_city</v-icon> Alexandria
                </v-card-text>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="info">map</v-icon> Louisiana 71301
                </v-card-text>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="accent">fa-fa</v-icon> United States
                </v-card-text>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="brown">phone</v-icon>+1 (318) 290-3674
                </v-card-text>
                <v-card-text class="headline blue-grey--text">
                  <v-icon color="yellow darken-2">mail</v-icon><span v-text="App.site.email"/>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'

export default {
    components: {
        MainLayout
    },
    mixins: [Theme],
    data: () => ({
        contentClass: { 'grey': true, 'lighten-4': true, 'accent--text': true },
        name: '',
        email: '',
        subject: '',
        message: '',
        contactForm: new AppForm(App.forms.contactForm)
    }),
    methods: {
        resetForm () {
            this.contactForm = new AppForm(App.forms.contactForm)
        },
        submit () {
            let self = this
            self.contactForm.name = self.name
            self.contactForm.email = self.email
            self.contactForm.subject = self.subject
            self.contactForm.message = self.message
            axios.post(route('api.@contact'), self.contactForm)
                .then(() => {
                    self.resetForm()
                    vm.$popup({ message: 'Message Sent!', backgroundColor: '#4db6ac', delay: 5, color: '#fffffa' })
                }).catch(() => {
                    vm.$popup({ message: 'Failed To send Message', backgroundColor: '#e57373', delay: 5, color: '#fffffa' })
                })
        }
    }
}
</script>


