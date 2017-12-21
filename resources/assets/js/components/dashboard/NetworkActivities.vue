<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    item-key="id"
    select-all
    :pagination.sync="pagination"
    light
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
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon>arrow_upward</v-icon>
          {{ header.text }}
        </th>
        <th text-xs-right>
          <span v-if="selected.length < 1">Actions</span>
          <v-btn 
            v-else 
            flat 
            icon 
            color="error" 
            @click.native="deleteAll()"
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
      <tr 
        :active="props.selected" 
        @click="props.selected = !props.selected"
      >
        <td class="title text-xs-left primary--text">
          <v-checkbox
            primary
            hide-details
            :input-value="props.selected"
            light
          />
        </td>
        <td class="title text-xs-left primary--text">
          <v-icon :color="props.item.iconColor">{{ props.item.icon }}</v-icon>
          <span class="caption accent--text">{{ props.item.username }}</span>
        </td>
        <td class="title text-xs-left primary--text">
          <span 
            class="title" 
            style="color: #333333;"
          >
            {{ props.item.message }}
          </span>
        </td>
        <td class="title text-xs-left primary--text">
          <span style="color: #f5c300;">
            {{ props.item.date }}
          </span>
        </td>
        <td class="title text-xs-center">
          <v-chip 
            :class="{ 'green': isActive(props.item),'amber': !isActive(props.item) }" 
            text-color="white"
          >
            <span>{{ `${props.item.active ? 'Active' : 'On-Queue'}` }}</span>
          </v-chip>
        </td>
        <td class="title text-xs-center">
          <v-btn 
            flat 
            icon 
            color="accent"
            @click.native=""
          >
            <v-icon>fa-eye</v-icon>
          </v-btn>
          <v-btn 
            flat 
            icon
            color="error" 
            @click.native=""
          >
            <v-icon>fa-trash</v-icon>
          </v-btn>
        </td>
      </tr>
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
        selected: [],
        /* table */
        headers: [
            /* remove sort and value since we cant access dot anotation in item */
            { text: 'Account', value: 'username', align: 'left', sortable: true },
            { text: 'Message', value: 'message', align: 'left', sortable: false },
            { text: 'Date', value: 'date', align: 'left', sortable: true },
            { text: 'Active', value: 'active', align: 'center', sortable: true }
        ],
        items: [
            {id: 1, icon: 'fa-facebook', iconColor: 'indigo', username: 'Auriahg17', message: 'Facebook Post in in scheduling Process', date: '15 Nov 2017 @ 10:15:01', url: '/', active: true},
            {id: 2, icon: 'fa-google-plus', iconColor: 'orange darken-4', username: 'Buriahg17@gmail.com', message: 'Google Post in scheduling Process', date: '16 Nov 2017 @ 10:15:01', url: '/', active: true},
            {id: 3, icon: 'fa-twitter', iconColor: 'cyan', username: 'Curiagh17', message: 'Twitter Post in scheduling Process', date: '17 Nov 2017 @ 10:15:01', url: '/', active: true},
            {id: 4, icon: 'fa-youtube-play ', iconColor: 'red', username: 'Duriahg17', message: 'Youtube Post in scheduling Process', date: '18 Nov 2017 @ 10:15:01', url: '/', active: false}
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
        }
    }
}
</script>

<style>

</style>
