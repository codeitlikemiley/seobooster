<template>
  <v-container 
    fluid 
    pa-0
    ma-0
  >
    <v-layout 
      row
      wrap
      align-center
    >
      <!-- make a card to display this -->
      <v-flex 
        xs12 
        md4 
        text-xs-left
      >
        <v-card 
          style="background-color:#333333;"
          class="ma-1" 
          height="110px"
        >
          <v-card-text class="title pa-5">
            <v-icon 
              large 
              color="amber lighten-2"
            >
              date_range
            </v-icon> 
            <span class="white--text">Post Lifetime: {{ lifetimeTotal }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex 
        xs12 
        md4 
        text-xs-left
      >
        <v-card 
          style="background-color:#333333;"
          class="ma-1" 
          height="110px"
        >
          <v-card-text class="title pa-5">
            <v-icon 
              large 
              color="red darken-4"
            >
              schedule
            </v-icon>
            <span class="white--text">Post This Month: {{ monthTotal }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex 
        xs12
        md4 
        text-xs-left
      >
        <v-card 
          style="background-color:#333333;"
          class="ma-1"
          height="110px"
        >
          <v-card-text class="title pa-5">
            <v-icon 
              large 
              color="amber"
            >
              supervisor_account
            </v-icon>
            <span class="white--text">Total Account: {{ totalAccounts }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    props:{
        lifetime: {
            type: Number,
            required: true
        },
        monthly: {
            type: Number,
            required: true
        },
        socialCount: {
            type: Number,
            required: true
        }

    },
    data: () => ({
        lifetimeTotal: 0,
        monthTotal: 0,
        totalAccounts: 0
    }),
    mounted () {
        this.lifetimeTotal = this.lifetime
        this.monthTotal = this.monthly
        this.totalAccounts = this.socialCount
    }
}
</script>
