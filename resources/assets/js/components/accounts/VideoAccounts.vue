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
      />
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
      <template 
        slot="headers"
        slot-scope="props"
      >
        <tr>
          <th 
            v-for="header in props.headers" 
            :key="header.text"
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
      <template 
        slot="items" 
        slot-scope="props"
      >
        <td class="title text-xs-center primary--text">
          <v-icon :color="props.item.icon_color">{{ props.item.icon }}</v-icon>
          <span class="caption accent--text">{{ props.item.name }}</span>
        </td>
        <td class="title text-xs-center primary--text">
          <span class="title blue-grey--text">{{ props.item.accounts[0].accounts.length }}</span>
        </td>
        <td class="title text-xs-center">
          <v-btn 
            light 
            flat 
            icon 
            :class="{'amber--text': props.expanded, 'amber': props.expanded, 'teal': !props.expanded, 'teal--text': !props.expanded }" 
            @click="setPropsExpanded(props)"
          >
            <v-icon v-if="!props.expanded">fa-expand</v-icon>
            <v-icon v-if="props.expanded">fa-compress</v-icon>
          </v-btn>
          <v-btn 
            flat 
            icon 
            color="accent" 
            @click.native=""
          >
            <v-icon>fa-plus</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert 
          :value="true" 
          color="error" 
          icon="warning">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
      <template 
        slot="expand" 
        slot-scope="props"
      >
        <account-props :accounts="props.item.accounts"/>
      </template>

      <template 
        slot="pageText" 
        slot-scope="{ pageStart, pageStop }"
      >
        From {{ pageStart }} to {{ pageStop }}
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
import AccountProps from './AccountProps'
//! Fetch Video Accounts From Database
export default {
    components: {
        AccountProps
    },
    props:{
        tab: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        pagination: {
            sortBy: 'name'
        },
        search: '',
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Platform', value: 'name', align: 'center', sortable: true },
            { text: 'Accounts #', value: 'accounts[0].accounts.length', align: 'center', sortable: false }
        ],
        items: [
        ]
    }),
    watch: {
        tab: {
            handler: function (newValue, OldValue) {
                this.items = newValue.accounts
                console.log(OldValue)
            },
            deep: true
        }
    },
    methods: {
        changeSort (column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending
            } else {
                this.pagination.sortBy = column
                this.pagination.descending = false
            }
        },
        setPropsExpanded(props){
            props.expanded = !props.expanded
        }
    }
    
}
</script>

<style>

</style>
