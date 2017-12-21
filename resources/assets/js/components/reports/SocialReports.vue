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
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '', $vuetify.breakpoint.width >= 600 && 'title']"
            @click="changeSort(header.value)"
          >
            <v-icon>arrow_upward</v-icon>
            {{ header.text }}
          </th>
          <th>
            <span 
              v-if="selected < 1"
              :class="$vuetify.breakpoint.width >= 600 && 'title'"
            >
              Actions
            </span>
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
        <td class="text-xs-left accent--text">
          {{ props.item.name }}
        </td>
        <td class="text-xs-left accent--text">
          {{ props.item.title }}
        </td>
        <td class="text-xs-center accent--text">
          <span class="accent--text">{{ props.item.posts.length }}</span>
        </td>
        <td class="text-xs-center accent--text">
          <span class="accent--text">{{ props.item.scheduled_at }}</span>
        </td>
        <td class="text-xs-center">
          <v-btn 
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
          Oops! You Havent Posted Any Social Type Post Yet.
        </v-alert>
      </template>

      <template 
        slot="expand" 
        slot-scope="props"
      >
        <report-props :posts="props.item.posts"/>
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
import ReportProps from './ReportProps.vue'
//! Fetch Blog Reports From Database
export default {
    components: {
        ReportProps
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
        selected: [],
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
