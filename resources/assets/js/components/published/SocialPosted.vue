<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-if="items.length > 0"
        append-icon="search"
        label="Search By Post"
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
        <td class="title text-xs-center primary--text">
          {{ props.item.name }}
        </td>
        <td class="title text-xs-center primary--text">
          {{ props.item.title }}
        </td>
        <td class="title text-xs-center primary--text">
          <v-icon :color="props.item.iconColor">{{ props.item.icon }}</v-icon>
          <span class="title blue-grey--text">{{ props.item.platform }}</span>
        </td>
        <td class="title text-xs-center primary--text">
          <span class="title blue-grey--text">{{ props.item.published_at }}</span>
        </td>
        <td class="title text-xs-center">
          <v-btn 
            flat 
            icon 
            color="cyan" 
            :href="props.item.link" 
            target="_blank"
          >
            <v-icon>fa-eye</v-icon>
          </v-btn>
          <v-btn 
            flat 
            icon 
            color="accent"
            @click="editPost(props.item)"
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
        >
          You Havent Published Any Post Yet.
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
        selected: [],
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Campaign Name', value: 'name', align: 'center', sortable: true },
            { text: 'Social Post Title', value: 'title', align: 'center', sortable: true },
            { text: 'Platform', value: 'platform', align: 'center', sortable: true },
            { text: 'Published At', value: 'published_at', align: 'center', sortable: true }
        ],
        //! campaign list by category of blog-accounts
        items: [
            {
                //! post
                id: 2,
                campaign_id: 1, //! for determining what component to be use for edit
                name: 'Second Campaign',
                title: 'Hello Universe',
                platform: 'facebook',
                icon: 'fa-facebook',
                iconColor: 'indigo',
                link: 'https://www.facebook.com/posted',
                published_at: '17 Nov 2017 @ 11:00:00'
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
        editPost (item) {
            let self = this
            //! Create Route For this That Uses Post ID
            //! Use Category ID to know what Type of Component We Will Use
            self.$router.push({ name: 'posts.edit', params: { postId: item.id, campaignId: item.campaign_id } })
        }
    }
}
</script>

<style>

</style>
