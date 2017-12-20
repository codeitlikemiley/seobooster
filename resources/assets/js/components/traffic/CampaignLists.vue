<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-if="items.length > 0"
        append-icon="search"
        label="Search By Campaign Name"
        single-line
        hide-details
        v-model="search"
      />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :search="search"
      v-model="selected"
      item-key="id"
      select-all
      :pagination.sync="pagination"
      expand
    >
      <template 
        slot="headers" 
        slot-scope="props"
      >
        <tr>
          <th>
            <v-checkbox
              v-if="items.length > 0"
              primary
              hide-details
              @click.native="toggleAll"
              :input-value="props.all"
              :indeterminate="props.indeterminate"
            />
          </th>
          <th 
            v-for="header in props.headers" 
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'name' : '',{'text-xs-left': header.align === 'left', 'text-xs-right': header.align === 'right', 'text-xs-center': header.align === 'center'}]"
            @click="changeSort(header.value)"
          >
            <v-icon>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <th>
            Activity
          </th>
          <th>
            <span v-if="selected < 1">Actions</span>
            <v-btn 
              v-else
              flat 
              icon 
              color="error" 
              @click.native="deleteSelected"
            >
              <v-icon>fa-trash</v-icon>
            </v-btn>
          </th>
        </tr>
      </template>
      <template 
        slot="items" 
        slot-scope="props"
      >
        <td class="title text-xs-center primary--text">
          <v-checkbox

            primary
            hide-details
            v-model="props.selected"
          />
        </td>
        <td class="title text-xs-center primary--text">
          <span class="title blue-grey--text">{{ props.item.name }}</span>
        </td>
        <td class="title text-xs-center primary--text">
          <span class="title blue-grey--text">{{ props.item.rank }}</span>
        </td>
        <td class="title text-xs-center primary--text">
          <span class="title blue-grey--text">{{ props.item.daily_credit_spent }}</span>
        </td>
        <td class="title text-xs-center primary--text">
          <v-btn 
            icon 
            :class="{'green lighten-2': props.item.smart_rank === 'on', 'red lighten-2': props.item.smart_rank === 'off'}" 
            dark
          >
            {{ props.item.smart_rank }}
          </v-btn>
        </td>
        <td class="title text-xs-center primary--text">
          <v-btn 
            icon 
            :class="{'green lighten-2': props.item.smart_rank === 'on', 'red lighten-2': props.item.smart_rank === 'off'}" 
            dark
          >
            {{ props.item.status }}
          </v-btn>
        </td>
        <td class="title text-xs-center primary--text">
          <v-btn 
            color="accent" 
            outline 
            dark
            @click="viewActivities(props.item)"
          >
            Activities
          </v-btn>
        </td>
        <td class="title text-xs-center">
          <v-btn 
            flat 
            icon 
            color="accent" 
            @click.native="editItem(props.item)"
          >
            <v-icon>fa-edit</v-icon>
          </v-btn>
          <v-btn 
            flat
            icon 
            color="error" 
            @click.native="deleteItem(props.item)"
          >
            <v-icon>fa-remove</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-alert 
          :value="true" 
          color="info" 
          icon="warning" 
          pa-0
          ma-0 
          fluid
        >
          You Have No Failured Post Yet :)
        </v-alert>
      </template>

      <template 
        slot="pageText" 
        slot-scope="{ pageStart, pageStop }"
      >
        From {{ pageStart }} to {{ pageStop }}
      </template>

    </v-data-table>
    <activity-lists/>
    <edit-campaign/>
  </v-card>
</template>

<script>
import ActivityLists from './ActivityLists'
import EditCampaign from './EditCampaign'
export default {
    components: {
        ActivityLists,
        EditCampaign
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
        selected: [],
        search: '',
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'left', sortable: true },
            { text: 'Rank', value: 'status', align: 'left', sortable: true },
            { text: 'Today Credit', value: 'daily_credit_spent', align: 'left', sortable: true },
            { text: 'Smart Rank', value: 'smart_rank', align: 'center', sortable: true },
            { text: 'Status', value: 'status', align: 'center', sortable: true }
        ],
        items: [
            {
                //! Campaign
                id: 1,
                name: 'Test1',
                status: 'on',
                smart_rank: 'on',
                daily_credit_spent: 1,
                rank: 1
            },
            {
                //! Campaign
                id: 1,
                name: 'Test2',
                status: 'off',
                smart_rank: 'off',
                daily_credit_spent: 2,
                rank: 2
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
        },
        toggleAll () {
            if (this.selected.length) this.selected = []
            else this.selected = this.items.slice()
        },
        deleteSelected () {
            let self = this
            let newItems = _.difference(self.items, self.selected)
            self.items = newItems
            self.selected = []
            //! Send Api Call To Delete The Social Account
        },
        deleteItem (item) {
            let self = this
            let itemIndex = _.findIndex(self.items, ['id', item.id])
            self.items.splice(itemIndex, 1)
            let selectedIndex = _.findIndex(self.selected, ['id', item.id])
            self.selected.splice(selectedIndex, 1)
        },
        editItem (item) {
            console.log('edit item', item)
            Bus.$emit('open-edit-campaign-modal')
        },
        viewActivities (item) {
            console.log(item)
            Bus.$emit('open-activity-modal')
        }
    }
}
</script>

<style>

</style>
