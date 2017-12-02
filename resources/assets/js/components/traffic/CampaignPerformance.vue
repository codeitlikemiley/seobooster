<template>
<v-container fluid>
    <v-layout row>
        <v-flex d-flex xs12>
            <v-layout row wrap>
                <v-flex d-flex xs6 text-xs-left>
                    <v-card-text>
                        <v-card-title>
                           Campaign Information# {{ id }} ({{ name }})
                        </v-card-title>
                    </v-card-text>
                </v-flex>
                <v-flex d-flex xs6 text-xs-right>
                     <v-card-text>
                        <v-card-title>
                            <v-spacer></v-spacer>
                           Start Date: {{ start_date }}
                        </v-card-title>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex xs12 text-xs-right>
            <v-card-text>
                <v-card-title>
                    <v-spacer></v-spacer>
                    Total Credit Spent: {{ total_credit_spent }}
                </v-card-title>
            </v-card-text>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex xs12 text-xs-center>
        <v-divider></v-divider>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex d-flex xs12>
            <v-layout row wrap>
                <v-flex d-flex xs6 text-xs-left>
                    <v-card-text>
                        <v-card-title>
                           Credit Spent Today: {{ credit_spent_today }}
                        </v-card-title>
                    </v-card-text>
                </v-flex>
                <v-flex d-flex xs6 text-xs-right>
                     <v-card-text>
                        <v-card-title>
                            <v-spacer></v-spacer>
                           Credit Spent Yesterday: {{ credit_spent_yesterday }}
                        </v-card-title>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex d-flex xs12>
            <v-layout row wrap>
                <v-flex d-flex xs6 text-xs-left>
                    <v-card-text>
                        <v-card-title>
                           Total  Credit Last Month: {{ total_credit_last_month }}
                        </v-card-title>
                    </v-card-text>
                </v-flex>
                <v-flex d-flex xs6 text-xs-right>
                     <v-card-text>
                        <v-card-title>
                            <v-spacer></v-spacer>
                           URL: {{ url }}
                        </v-card-title>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
    <v-layout row>
        <v-flex xs12 text-xs-center>
        <v-divider></v-divider>
        </v-flex>
    </v-layout>
    <v-layout row>

    <v-data-table
    :headers="headers"
    :items="items"
    item-key="id"
    :pagination.sync="pagination"
    hide-actions
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
            </tr>
        </template>
        <template slot="items" slot-scope="props">

                <td class="title text-xs-center primary--text">
                    <v-icon :color="props.item.iconColor">{{ props.item.icon }}</v-icon>
                    <span class="title blue-grey--text">{{ props.item.name }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.start_date }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.current }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.volume }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.weekly }}</span>
                </td>
                <td class="title text-xs-center primary--text">
                    <span class="title blue-grey--text">{{ props.item.monthly }}</span>
                </td>
            </tr>
        </template>
        <template slot="no-data">
            <v-alert :value="true" color="info" icon="warning" pa-0 ma-0 fluid>
            You Have No Campaign Performance Data Yet :)
            </v-alert>
        </template>

        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>

    </v-data-table>

    </v-layout>
</v-container>
</template>

<script>
export default {
    data: () => ({
        id: 1,
        name: 'Campaign 1',
        start_date: 'Dec. 21 2017',
        total_credit_spent: 1000,
        credit_spent_today: 100,
        credit_spent_yesterday: 200,
        total_credit_last_month: 1000,
        url: 'https://google.com/test',
        items: [
            { name: 'google', start_date: 'Dec.1 20017', current: null, volume: 25, weekly: 0, monthly: 0 },
            { name: 'youtube', start_date: 'Dec.2 20017', current: null, volume: 25, weekly: 0, monthly: 0 }
        ],
        pagination: {
            sortBy: 'name'
        },
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Search Engine', value: 'name', align: 'center', sortable: true },
            { text: 'Start', value: 'start_date', align: 'center', sortable: false },
            { text: 'Current', value: 'current', align: 'center', sortable: false },
            { text: 'Volume', value: 'volume', align: 'center', sortable: false },
            { text: 'Weekly', value: 'weekly', align: 'center', sortable: false },
            { text: 'Monthly', value: 'monthly', align: 'center', sortable: false }
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
