<template>
  <v-card>
    <v-card-title>
      <v-text-field
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
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '', $vuetify.breakpoint.width >= 600 && 'title']"
            @click="changeSort(header.value)"
          >
            <v-icon>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <th>
            <span 
              :class="$vuetify.breakpoint.width >= 600 && 'title'"
            >
              Actions
            </span>
          </th>
        </tr>
      </template>
      <template 
        slot="items" 
        slot-scope="props"
      >
        <td class="text-xs-center">
          <v-icon :color="props.item.icon_color">{{ props.item.icon }}</v-icon>
          <span class="accent--text">{{ props.item.name }}</span>
        </td>
        <td class="text-xs-center">
          <span class="blue-grey--text">{{ props.item.accounts[0].accounts.length }}</span>
        </td>
        <td class="text-xs-center">
          <v-btn 
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
          type="error"
          outline
          icon="warning"
        >
          Oops! No Platform For Blog Accounts Added Yet
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
//! Fetch Blog Accounts From Database
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
