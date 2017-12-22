<template>
  <v-card>
    <v-card-title>
      <v-spacer/>
      <v-text-field
        append-icon="search"
        label="Search By Username"
        single-line
        hide-details
        v-model="search"
      />
    </v-card-title>
    <v-data-table
      :items="items"
      :search="search"
      v-model="selected"
      :headers="headers"
      :pagination.sync="pagination"
      item-key="id"
      select-all
    >
      <template
        slot="headers" 
        slot-scope="props">
        <th>
          <v-checkbox
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
        <th class="text-xs-center">
          <span v-if="selected.length < 1">Actions</span>
          <v-btn 
            v-else 
            flat 
            icon 
            color="red darken-4" 
            @click.native="deleteSelected()"
          >
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </th>
      </template>
      <template 
        slot="items" 
        slot-scope="props">
        <td>
          <v-checkbox
            primary
            hide-details
            v-model="props.selected"
          />
        </td>
        <td class="text-xs-left">
          <v-edit-dialog
            @open="tmp = props.item.username"
            @save="props.item.username = tmp || props.item.username"
            large
            lazy
          >
            <div>{{ props.item.username }}</div>
            <div 
              slot="input" 
              class="mt-3 title"
            >
              Update Username
            </div>
            <v-text-field
              slot="input"
              label="Edit Username"
              v-model="tmp"
              single-line
              counter
              autofocus
              :rules="[max25chars]"
            />
          </v-edit-dialog>
        </td>
        <td class="text-xs-center">
          <v-chip 
            :class="{ 'green': isActive(props.item),'amber': !isActive(props.item) }" 
            text-color="white"
          >
            <span>{{ `${props.item.active ? 'Active' : 'Inactive'}` }}</span>
          </v-chip>
        </td>
        <td class="text-xs-left">{{ props.item.expired_at }}</td>
        <th class="text-xs-center">{{ props.item.post_count }}</th>
        <td class="text-xs-center">
          <!-- //! View The User Profile Page -->
          <v-btn 
            flat 
            icon 
            color="cyan"
            @click.native=""
          >
            <v-icon>fa-eye</v-icon>
          </v-btn>
          <!-- //! Only Show This When Account is Not Yet Active -->
          <v-btn 
            flat 
            icon 
            color="green darken-2" 
            :href="props.item.link" 
            target="_blank"
          >
            <v-icon>fa-sign-in</v-icon>
          </v-btn>
          <!-- //! Only Show This When Token is Expired -->
          <v-btn 
            v-if="tokenExpired(props.item)" 
            flat 
            icon 
            color="indigo darken-2" 
            @click.native=""
          >
            <v-icon>fa-refresh</v-icon>
          </v-btn>
          <!-- //! Edit The User Credentials -->
          <v-btn 
            flat 
            icon 
            color="accent" 
            @click.native=""
          >
            <v-icon>fa-edit</v-icon>
          </v-btn>
          <!-- //! Delete Account -->
          <v-btn 
            flat 
            icon 
            color="error" 
            @click.native=""
          >
            <v-icon>fa-remove</v-icon>
          </v-btn>
        </td>
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
        accounts: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        selected: [],
        pagination: {
            sortBy: 'name'
        },
        search: '',
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Username', value: 'username', align: 'left', sortable: true },
            { text: 'Status', value: 'active', align: 'left', sortable: true },
            { text: 'Token Expires In', value: 'expired_at', align: 'left', sortable: true },
            { text: 'Total Post', value: 'post_count', center: 'left', sortable: true }

        ],
        items: [],
        max25chars: (v) => v.length <= 25 || 'Input too long!',
        tmp: ''
    }),
    mounted () {
        this.items = this.accounts[0].accounts
    },
    methods: {
        toggleAll () {
            if (this.selected.length) this.selected = []
            else this.selected = this.items.slice()
        },
        isActive (item) {
            return !!item.active
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
            self.selected = []
        },
        deleteSelected () {
            let self = this
            let newItems = _.difference(self.items, self.selected)
            self.items = newItems
            self.selected = []
            //! Send Api Call To Delete The Social Account
        },
        tokenExpired (item) {
            //! Compare Current Date with Date of Expiration
            console.log(item)
            return false
        }
    }
}
</script>

<style>

</style>
