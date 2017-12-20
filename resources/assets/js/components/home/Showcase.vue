<template>
  <v-container 
    fluid 
    class="accent"
  >
    <v-layout 
      row 
      wrap
    >
      <v-flex
        v-bind="{ [`xs${card.xs}`]: true, [`sm${card.sm}`]: true, [`md${card.md}`]: true,[`lg${card.lg}`]: true,[`xl${card.xl}`]: true }"
        v-for="card in showcase"
        :key="card.title"
        class="pa-2"
      >
        <v-card 
          flat 
          color="accent"
        >
          <v-card-media
            :src="card.src"
            height="150px"
            contain
          />
          <v-card-actions>
            <v-spacer/>
            <p 
              class="headline primary--text" 
              v-text="card.title"
            />
            <v-spacer/>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    data: () => ({
        showcase: [
            { show: true, title: 'Complete Social SEO', src: 'http://sourcemachine.io/img/characteristics-complete.svg', xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
            { show: true, title: 'Control Traffic and CTR', src: 'http://sourcemachine.io/img/characteristics-control.svg', xs: 12, sm: 12, md: 4, lg: 4, xl: 4 },
            { show: true, title: 'Rank Videos Faster Than Ever', src: 'http://sourcemachine.io/img/characteristics-rank.svg', xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }
        ]
    })
}
</script>

<style>

</style>
