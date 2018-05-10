<template>
  <b-field>
    <b-input ref="searchBar" v-model="searchTerm" :loading="searchLoading" size="is-medium" type="text" placeholder="Find a bot" expanded @input="processSearchTyping" @keyup.enter.native="processSearch"/>
    <p class="control">
      <button class="button is-medium" @click.prevent="processSearch">Search</button>
    </p>
  </b-field>
</template>

<script>
// TODO move
function createDebouncer() {
  let debounceTimeout = null;
  return function _debounce(func, delay) {
    if(debounceTimeout) {
      return;
    }
    debounceTimeout = setTimeout(function() {
      debounceTimeout = null;
      Promise.resolve(func()).then(() => debounceTimeout = null);
    }, delay);
  }
}

export default {
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchDebouncer: createDebouncer(),
      searchLoading: false,
      searchTerm: this.$route.query.q || ""
    };
  },
  mounted() {
    this.$refs.searchBar.focus()
  },
  methods: {
    processSearchTyping(a) {
      this.searchLoading = true;
      this.searchDebouncer(() => this.processSearch(), 500);
    },
    processSearch() {
      let data = {
        path: this.path,
        query: {
          q: this.searchTerm
        }
      };
      if(this.$route.path === this.path) {
        this.$router.replace(data);
      } else {
        this.$router.push(data);
      }
      this.searchLoading = false;
    }
  }
}
</script>

<style>
</style>
