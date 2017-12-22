<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    item-key="id"
    select-all
    :pagination.sync="pagination"
    expand
    class="elevation-1"
  >
    <template
      slot="headers" 
      slot-scope="props"
    >
      <tr>
        <th>
          <v-checkbox
            light
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
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'name' : '', {'text-xs-left': header.align === 'left', 'text-xs-right': header.align === 'right', 'text-xs-center': header.align === 'center'},$vuetify.breakpoint.width >= 600 && 'title']"
          @click="changeSort(header.value)"
        >
          <v-icon>arrow_upward</v-icon>
          {{ header.text }}
        </th>
        <th text-xs-right>
          <span 
            v-if="selected.length < 1"
            :class="$vuetify.breakpoint.width >= 600 && 'title'"
          >
            Actions
          </span>
          <v-btn
            v-else 
            flat 
            icon 
            color="error" 
            @click.native="deleteSelected()"
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
      <tr>
        <td class="title text-xs-left">
          <v-checkbox
            :active="props.selected"
            @click="props.selected = !props.selected"
            primary
            hide-details
            :input-value="props.selected"
            light
          />
        </td>
        <td class="text-xs-center">
          <v-icon
            color="accent" 
          >
            folder
          </v-icon>
          <span class="accent--text">{{ props.item.name }}</span>
        </td>
        <td class="text-xs-center">
          <span class="accent--text">{{ props.item.no_of_campaigns }}</span>
        </td>
        <td class="text-xs-center accent--text">{{ props.item.daily_credits_spent }}</td>
        <td class="text-xs-center accent--text">{{ props.item.total_credits_spent }}</td>
        <td class="text-xs-center accent--text">{{ props.item.overall_keyword_movement }}</td>
        <td class="text-xs-center">
          <v-btn
            light 
            flat 
            icon 
            :class="{'amber--text': props.expanded, 'amber': props.expanded, 'teal': !props.expanded, 'teal--text': !props.expanded }"
            @click="props.expanded = !props.expanded"
          >
            <v-icon v-if="!props.expanded">fa-expand</v-icon>
            <v-icon v-if="props.expanded">fa-compress</v-icon>
          </v-btn>
          <v-btn 
            flat 
            icon 
            color="error" 
            @click.native="deleteItem(props.item)"
          >
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </td>
      </tr>
    </template>
    <template 
      slot="expand" 
      slot-scope="props"
    >
      <campaign-lists/>
    </template>
    <template slot="no-data">
      <v-alert 
        :value="true" 
        type="error"
        outline
        icon="warning"
      >
        Oops! You Have No Group Campaign Yet!
      </v-alert>
    </template>
    <template
      slot="pageText" 
      slot-scope="{ pageStart, pageStop }"
    >
      From {{ pageStart }} to {{ pageStop }}
    </template>

  </v-data-table>
</template>

<script>
import CampaignLists from '../../components/traffic/CampaignLists.vue'
export default {
    components: {
        CampaignLists
    },
    props:{
        tab: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        api_key: 'XYZ',
        pagination: {
            sortBy: 'name'
        },
        selected: [],
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Group Name', value: 'name', align: 'left', sortable: true },
            { text: '# of Campaigns', value: 'no_of_campaigns', align: 'left', sortable: false },
            { text: 'Daily Credit Spent', value: 'daily_credits_spent', align: 'left', sortable: true },
            { text: 'Total Credit Spent', value: 'total_credits_spent', align: 'left', sortable: true },
            { text: 'OKM', value: '"overall_keyword_movement', align: 'left', sortable: true }
        ],
        items: [
            // category/campaign group ->  campaigns -> activities
            {id: 1, user_id: 1, name: 'Group # 1', 'no_of_campaigns': 1, daily_credits_spent: 1, total_credits_spent: 1, overall_keyword_movement: '0.1'},
            {id: 2, user_id: 1, name: 'Group # 2', 'no_of_campaigns': 2, daily_credits_spent: 2, total_credits_spent: 2, overall_keyword_movement: '0.2'},
            {id: 3, user_id: 1, name: 'Group # 3', 'no_of_campaigns': 3, daily_credits_spent: 3, total_credits_spent: 3, overall_keyword_movement: '0.3'},
            {id: 4, user_id: 1, name: 'Group # 4', 'no_of_campaigns': 4, daily_credits_spent: 4, total_credits_spent: 4, overall_keyword_movement: '0.4'}

        ]
    }),
    methods: {

        isActive (item) {
            return !!item.active
        },
        toggleAll () {
            if (this.selected.length) this.selected = []
            else this.selected = this.items.slice()
        },
        changeSort (column) {
            if (this.pagination.sortBy === column) {
                this.pagination.descending = !this.pagination.descending
            } else {
                this.pagination.sortBy = column
                this.pagination.descending = false
            }
        },
        deleteAll () {
            this.items = []
            this.selected = []
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
        }
    }
}
</script>

<style>

</style>
