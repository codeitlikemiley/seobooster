<template>
  <main-layout :class="[contentClass]">
    <carousel></carousel>
    <show-case></show-case>
    <feature-case></feature-case>
    <pioneer></pioneer>
    <video-case></video-case>
    <testimonial></testimonial>
    <call-to-action></call-to-action>
  </main-layout>
</template>

<script>
import MainLayout from '../layouts/Main.vue'
import ShowCase from '../components/home/Showcase.vue'
import Pioneer from '../components/home/Pioneer.vue'
import FeatureCase from '../components/home/FeatureCase.vue'
import Carousel from '../components/home/Carousel.vue'
import VideoCase from '../components/home/VideoCase.vue'
// import FooterNote from '../partials/FooterNote'
import Testimonial from '../components/home/Testimonial.vue'
import CallToAction from '../components/home/CallToAction.vue'
import Theme from '../mixins/theme'

export default {
    mixins: [Theme],
    data: () => ({
        contentClass: { 'white': true, 'accent--text': true }
    }),
    mounted () {
        Bus.$emit('footer-content-visible', true)
    },

    components: {
        MainLayout,
        ShowCase,
        FeatureCase,
        VideoCase,
        Carousel,
        // FooterNote,
        Pioneer,
        CallToAction,
        Testimonial
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
