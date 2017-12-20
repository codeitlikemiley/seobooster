<template>
  <div>
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
          color="blue-grey" 
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
            <span class="white--text">Action This Month: {{ monthTotal }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex 
        xs12
        md4 
        text-xs-left
      >
        <v-card
          color="red lighten-2" 
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
            <span class="white--text">Action Live Time: {{ lifetime }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        md4 
        text-xs-left
      >
        <v-card 
          color="cyan" 
          class="ma-1" 
          height="110px"
        >
          <v-card-text class="title pa-5">
            <v-icon 
              large 
              color="amber"
            >work
            </v-icon> 
            <span class="white--text">Total Project: {{ totalproject }}</span>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>

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
        projectCount: {
            type: Number,
            required: true
        }
    },
    
    data: () => ({
        totalproject: 0,
        monthTotal: 0,
        totalAccounts: 0
    }),
    mounted () {
        this.lifetimeTotal = this.lifetime
        this.monthTotal = this.monthly
        this.totalproject = this.projectCount
    }
}
</script>
