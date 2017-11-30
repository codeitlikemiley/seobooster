<template>
<v-container fluid>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card flat light>
                <v-container fluid>
                    <v-layout row wrap>
                        <v-flex xs12 text-xs-center>
                        <blockquote v-html="testimonial">

                            </blockquote>
                        </v-flex>
                        <v-flex xs12 text-xs-right>
                            <v-chip color="accent">
                            <v-avatar>
                                <img :src="avatar" :alt="name">
                            </v-avatar>
                            <span class="white--text title" v-text="name"></span>
                            </v-chip>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
export default {
    data: () => ({
        avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
        name: '-SEO Agency Owner',
        testimonial: '<h1 class="primary--text">With Seo Socio I can instantly have hundreds of social signals and traffic</h1><h1 class="accent--text"> <strong>Signs going to my clients sites the DAY they sign on wit my agency</strong></h1>'
    })
}
</script>
