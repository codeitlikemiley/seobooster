<template>
  <home-layout :class="[contentClass]">
    <carousel/>
    <show-case/>
    <feature-case/>
    <pioneer/>
    <video-case/>
    <testimonial/>
    <call-to-action/>
  </home-layout>
</template>

<script>
import HomeLayout from '../layouts/Home.vue'
import ShowCase from '../components/home/Showcase.vue'
import Pioneer from '../components/home/Pioneer.vue'
import FeatureCase from '../components/home/FeatureCase.vue'
import Carousel from '../components/home/Carousel.vue'
import VideoCase from '../components/home/VideoCase.vue'
import Testimonial from '../components/home/Testimonial.vue'
import CallToAction from '../components/home/CallToAction.vue'
import Theme from '../mixins/theme'

export default {
    components: {
        HomeLayout,
        ShowCase,
        FeatureCase,
        VideoCase,
        Carousel,
        Testimonial,
        Pioneer,
        CallToAction
    },
    mixins: [Theme],
    data: () => ({
        contentClass: { 'white': true, 'accent--text': true }
    }),
    mounted () {
        Bus.$emit('footer-content-visible', true)
    }
}
</script>
<style scoped>
.image {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 2px solid #BA9A5A;
    margin: 15px;
  }
</style>
