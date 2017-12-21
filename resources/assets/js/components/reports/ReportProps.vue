<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-if="items.length > 0"
        append-icon="search"
        label="Search By Campaign"
        single-line
        hide-details
        v-model="search"
      />
    </v-card-title>
    <v-data-table
      :items="items"
      :headers="headers"
      :search="search"
      v-model="selected"
      item-key="id"
      select-all
      :pagination.sync="pagination"
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
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon>arrow_upward</v-icon>
            {{ header.text }}
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
        <td>
          <v-checkbox
            primary
            hide-details
            v-model="props.selected"
          />
        </td>
        <td class="text-xs-left">
          {{ props.item.platform }}
        </td>
        <td class="text-xs-center">
          <v-chip 
            :class="{ 'green': isActive(props.item),'red': !isActive(props.item) }" 
            text-color="white"
          >
            <span>{{ `${props.item.posted ? 'Posted' : 'Failed'}` }}</span>
          </v-chip>
        </td>
        <td class="text-xs-center">
          <!-- //! View Post Link -->
          <v-btn 
            flat 
            icon 
            color="cyan"
            @click.native=""
            v-if="props.item.posted"
          >
            <v-icon>fa-eye</v-icon>
          </v-btn>
          <!-- //! Show When We Exceed Limit Posting -->
          <v-btn 
            v-else 
            flat 
            icon 
            color="red"
            @click.native=""
          >
            <v-icon>fa-exclamation-triangle</v-icon>
          </v-btn>
          <!-- //! Delete Post Record On DB -->
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
          type="error"
          outline
          icon="warning"
        >
          Oops! You Havent Posted Anything Yet.
        </v-alert>
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
export default {
    props:{
        posts: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        pagination: {
            sortBy: 'name'
        },
        selected: [],
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Platform', value: 'platform', align: 'left', sortable: true },
            { text: 'Status', value: 'posted', align: 'center', sortable: true }

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
        }
    }
}
</script>

<style>

</style>
