<template>
    <v-data-table
    :items="items"
    :headers="headers"
    :pagination.sync="pagination"
    item-key="id"
    light
    >

        <template slot="items" slot-scope="props">
            <td class="text-xs-left">
               {{ props.item.platform }}
            </td>
            <td class="text-xs-center">
                <v-chip :class="{ 'green': isActive(props.item),'red': !isActive(props.item) }" text-color="white">
                <span>{{ `${props.item.posted ? 'Posted' : 'Failed'}` }}</span>
                </v-chip>
            </td>
            <td class="text-xs-center">
                <!-- //! View Post Link -->
                <v-btn flat icon color="cyan" @click.native="" v-if="props.item.posted">
                <v-icon>fa-eye</v-icon>
                </v-btn>
                <!-- //! Show When We Exceed Limit Posting -->
                <v-btn v-else flat icon color="red" @click.native="">
                <v-icon>fa-exclamation-triangle</v-icon>
                </v-btn>
            </td>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
            From {{ pageStart }} to {{ pageStop }}
        </template>
    </v-data-table>

</template>

<script>
export default {
    props: ['posts'],
    data: () => ({
        pagination: {
            sortBy: 'name'
        },
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Platform', value: 'platform', align: 'left', sortable: true },
            { text: 'Status', value: 'posted', align: 'center', sortable: true },
            { text: 'Visit', value: false, align: 'center', sortable: false }

        ],
        items: []
    }),
    mounted () {
        this.items = this.posts
    },
    methods: {
        //! Add Logic to Determine a Failure Of Post
        isActive (item) {
            return !!item.posted
        },
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
