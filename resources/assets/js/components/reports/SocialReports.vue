<template>
<v-card light>
    <v-card-title>
    <v-text-field
    light
    append-icon="search"
    label="Search By Campaign"
    single-line
    hide-details
    v-model="search"
    ></v-text-field>
    </v-card-title>
    <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    item-key="id"
    :pagination.sync="pagination"
    light
    expand
    >
        <template slot="headers" slot-scope="props">
            <tr>
            <th v-for="header in props.headers" :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
            >
                <v-icon>arrow_upward</v-icon>
                {{ header.text }}
            </th>
            <th>
                Actions
            </th>
            </tr>
        </template>
        <template slot="items" slot-scope="props">
                <td class="title text-xs-left primary--text">
                    {{ props.item.name }}
                </td>
                <td class="title text-xs-left primary--text">
                    {{ props.item.title }}
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.posts.length }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.scheduled_at }}</span>
                </td>
                <td class="title text-xs-center">
                    <v-btn light  flat icon :class="{'amber--text': props.expanded, 'amber': props.expanded, 'teal': !props.expanded, 'teal--text': !props.expanded }" @click="props.expanded = !props.expanded">
                    <v-icon v-if="!props.expanded">fa-expand</v-icon>
                    <v-icon v-if="props.expanded">fa-compress</v-icon>
                    </v-btn>
                </td>
            </tr>
        </template>
        <!--
        //!Working Only in vuetify v 0.17
        <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
            Sorry, nothing to display here :(
            </v-alert>
        </template>
        -->
        <template slot="expand" slot-scope="props">
        <report-props :posts='props.item.posts'></report-props>
        </template>

        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>

    </v-data-table>
</v-card>
</template>

<script>
import ReportProps from './ReportProps.vue'
//! Fetch Blog Reports From Database
export default {
    props: ['tab'],
    components: {
        ReportProps
    },
    data: () => ({
        pagination: {
            sortBy: 'name'
        },
        search: '',
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true },
            { text: 'Post Title', value: 'title', align: 'left', sortable: true },
            { text: 'Post Count', value: 'posts.length', align: 'left', sortable: true },
            { text: 'Scheduled At', value: 'scheduled_at', align: 'left', sortable: true }
        ],
        //! campaign list by category of blog-accounts
        items: [
            {
                //! campaign id
                id: 1,
                name: 'First Campaign',
                title: 'Hello World',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [
                    {
                        //! post id
                        id: 1,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        //! link posted @
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    },
                    {
                        //! post id
                        id: 2,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    },
                    {
                        //! post id
                        id: 3,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    },
                    {
                        //! post id
                        id: 4,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    },
                    {
                        //! post id
                        id: 5,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    }
                ]
            },
            {
                //! campaign id
                id: 2,
                name: 'Second Campaign',
                title: 'Hello Universe',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [
                    {
                        //! post id
                        id: 6,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    }
                ]
            },
            {
                //! campaign id
                id: 3,
                name: 'Second Campaign',
                title: 'Hello hI',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [
                    {
                        //! post id
                        id: 7,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    }
                ]
            },
            {
                //! campaign id
                id: 4,
                name: 'Second Campaign',
                title: 'Hello Hello',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [
                    {
                        //! post id
                        id: 8,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    }
                ]
            },
            {
                //! campaign id
                id: 5,
                name: 'Second Campaign',
                title: 'Hello Dolly',
                scheduled_at: '17 Nov 2017 @ 11:00:00',
                //! account choosen to publish this post
                posts: [
                    {
                        //! post id
                        id: 9,
                        posted: true, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    },
                    {
                        //! post id
                        id: 10,
                        posted: false, //! 
                        posted_at: '16 Nov 2017 @ 10:15:01',
                        //! LResource: Instead of Using the Relationship Object we use the Properties Directly for the FF
                        platform: 'Stumbleupon',
                        username: 'test@stumbleupon.com',
                        link: 'https://google.com',
                        iconColor: 'red',
                        icon: 'fa-stumbleupon '
                    }
                ]
            }
        ]
    }),
    methods: {
        changeSort (column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending
            } else {
                this.pagination.sortBy = column
                this.pagination.descending = false
            }
        }
    }
}
</script>

<style>

</style>
