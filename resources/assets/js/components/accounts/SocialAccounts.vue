<template>
<v-card light>
    <v-card-title>
    <v-text-field
    light
    append-icon="search"
    label="Search By Platform"
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
                    <v-icon :color="props.item.iconColor">{{ props.item.icon }}</v-icon>
                    <span class="caption accent--text">{{ props.item.platform }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.accounts.length }}</span>
                </td>
                <td class="title text-xs-center">
                    <v-btn light  flat icon :class="{'amber--text': props.expanded, 'amber': props.expanded, 'teal': !props.expanded, 'teal--text': !props.expanded }" @click="props.expanded = !props.expanded">
                    <v-icon v-if="!props.expanded">fa-expand</v-icon>
                    <v-icon v-if="props.expanded">fa-compress</v-icon>
                    </v-btn>
                    <v-btn flat icon color="accent" @click.native="">
                        <v-icon>fa-plus</v-icon>
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
        <account-props :accounts='props.item.accounts'></account-props>
        </template>

        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>

    </v-data-table>
</v-card>
</template>

<script>
import AccountProps from './AccountProps'
//! Fetch Social Accounts From Database
export default {
    props: ['tab'],
    components: {
        AccountProps
    },
    data: () => ({
        pagination: {
            sortBy: 'name'
        },
        search: '',
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Platform', value: 'platform', align: 'left', sortable: true },
            { text: 'Accounts #', value: 'accounts.length', align: 'left', sortable: false }
        ],
        items: [
            {
                id: 1,
                type: 'social-accounts',
                icon: 'fa-facebook',
                platform: 'facebook',
                iconColor: 'indigo',
                accounts: [
                    {
                        id: 1,
                        username: 'uriahg@facebook.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 10
                    },
                    {
                        id: 2,
                        username: 'uriahg1@facebook.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 10
                    },
                    {
                        id: 3,
                        username: 'uriahg2@facebook.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 10
                    },
                    {
                        id: 4,
                        username: 'uriahg3@facebook.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 10
                    },
                    {
                        id: 5,
                        username: 'uriah4g@facebook.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 10
                    }
                ]
            },
            {
                id: 2,
                type: 'social-accounts',
                icon: 'fa-twitter',
                platform: 'twitter',
                iconColor: 'cyan',
                accounts: [
                    {
                        id: 2,
                        username: 'uriahg17',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 1
                    }
                ]
            },
            {
                id: 3,
                type: 'social-accounts',
                icon: 'fa-google',
                platform: 'google',
                iconColor: 'amber darken-2',
                accounts: [
                    {
                        id: 3,
                        username: 'uriahg@google.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 9
                    }
                ]
            },
            {
                id: 4,
                type: 'social-accounts',
                icon: 'fa-youtube',
                platform: 'youtube',
                iconColor: 'red darken-4',
                accounts: [
                    {
                        id: 4,
                        username: 'uriahg@google.com',
                        active: true,
                        activated_at: '16 Nov 2017 @ 10:15:01',
                        expired_at: '18 Nove 2017 @ 10:16:01',
                        post_count: 6
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
