<template>
  <modal-layout>
    <v-card :flat="true">
      <v-toolbar class="accent">
        <v-btn 
          flat 
          icon 
          color="primary"
          @click.native="redirectBack()"
        >
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-spacer/>
        <v-toolbar-title class="text-xs-center primary--text">Customer Support Page</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <!-- If There is no User Account Login Yet Redirect to Authentication Page -->
          <v-btn 
            flat 
            color="primary" 
            @click.native="goHome()"
          >
            <v-icon>fa-home</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="padding-top:100px;">
        <v-container fluid>
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
                  >
                    <v-card-title class="headline accent--text">Contact Details</v-card-title>
                    <v-card-text class="headline accent--text">
                      <v-icon color="red">place</v-icon> 1120 5TH Street
                    </v-card-text>
                    <v-card-text class="headline accent--text">
                      <v-icon color="indigo">location_city</v-icon> Alexandria
                    </v-card-text>
                    <v-card-text class="headline accent--text">
                      <v-icon color="info">map</v-icon> Louisiana 71301
                    </v-card-text>
                    <v-card-text class="headline accent--text">
                      <v-icon color="light-blue">fa-fa</v-icon> United States
                    </v-card-text>
                    <v-card-text class="headline accent--text">
                      <v-icon color="brown">phone</v-icon>+1 (318) 290-3674
                    </v-card-text>
                    <v-card-text class="headline accent--text">
                      <v-icon color="yellow darken-2">mail</v-icon><span v-text="App.site.email"/>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </modal-layout>
</template>

<script>
import ModalLayout from '../layouts/ModalLayout'
import Theme from '../mixins/theme'

export default {
    components: {
        ModalLayout
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
        },
        redirectBack () {
            let self = this
            return self.$nextTick(() => self.$router.go(-1))
        },
        goHome () {
            let self = this
            self.$nextTick(() => self.$router.push({name: 'home'}))
        }
    }
}
</script>


