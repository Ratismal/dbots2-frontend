<template>
  <section>
    <b-field expanded>
      <b-input ref="searchBar" v-model="searchTerm" :loading="searchLoading" size="is-medium" type="text" placeholder="Find a bot" expanded @input="processSearchTyping" @keyup.enter.native="processSearch"/>
      <p class="control">
        <button class="button is-medium" @click.prevent="processSearch">Search</button>
      </p>
    </b-field>
    <div v-if="$route.path === path" class="toggleButton" >
      <a @click.prevent="toggleAdvancedFilters" >Advanced Filters</a>  
    </div>  
    <section v-if="$route.path === path && toggled" class="advancedFilters">
      <b-field grouped>
        <b-field label="Categories" expanded>
          <b-taginput v-model="categories" :data="categoriesFiltered" autocomplete open-on-focus @input="processSearchTyping" @typing="filterCategories"/>
        </b-field>

        <b-field label="Sorting" expanded>
          <b-field>
            <b-select v-model="sortType" placeholder="Sorting Type" expanded @input="processSearchTyping">
              <option v-for="sortingType in sortingTypes" :key="sortingType" :value="sortingType">{{ sortingType }}</option> 
            </b-select>
            <b-radio-button v-model="sortDirection" native-value="-" expanded @input="processSearchTyping">Ascending</b-radio-button>
            <b-radio-button v-model="sortDirection" native-value="+" expanded @input="processSearchTyping">Descending</b-radio-button>
          </b-field>
        </b-field>
      </b-field>
    </section>
  </section>
</template>

<script>
const VALID_CATEGORIES = [
  "anime",
  "fun",
  "games",
  "moderation",
  "music",
  "nsfw",
  "utility"
];
const VALID_SORTING_TYPES = ["random", "date", "name"];

// TODO move
function createDebouncer() {
  let debounceTimeout = null;
  return function _debounce(func, delay) {
    if (debounceTimeout) {
      return;
    }
    debounceTimeout = setTimeout(function() {
      debounceTimeout = null;
      Promise.resolve(func()).then(() => (debounceTimeout = null));
    }, delay);
  };
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
      searchTerm: this.$route.query.q || "",
      sortDirection: this.$route.query.sort ? this.$route.query.sort[0] : "-",
      sortType: this.$route.query.sort ? this.$route.query.sort.slice(1) : "",
      toggled: this.$route.query.a === true,

      categories: this.$route.query.category
        ? this.$route.query.category.split(",")
        : [],
      categoriesFiltered: VALID_CATEGORIES.map(category => category),
      sortingTypes: VALID_SORTING_TYPES.map(sortingType => sortingType)
    };
  },
  computed: {
    sortTerm() {
      if (!this.sortType) {
        return "";
      }
      return this.sortDirection + this.sortType;
    },
    categoryTerm() {
      return this.categories.join(",");
    },
    query() {
      return {
        q: this.searchTerm || undefined,
        sort: this.sortTerm || undefined,
        a: this.toggled || undefined,
        category: this.categoryTerm || undefined,
        limit: 24,
        page: this.$route.query.page
      };
    }
  },
  mounted() {
    this.$refs.searchBar.focus();
    if (this.$route.query.a) {
      this.toggled = true;
    }
  },
  methods: {
    processSearchTyping(a) {
      this.searchLoading = true;
      this.searchDebouncer(() => this.processSearch(), 500);
    },
    processSearch() {
      let data = {
        path: this.path,
        query: this.query
      };
      if (this.$route.path === this.path) {
        this.$router.replace(data);
      } else {
        this.$router.push(data);
      }
      this.searchLoading = false;
    },
    toggleAdvancedFilters() {
      if (this.$route.path !== this.path) {
        this.$router.replace({
          path: this.path,
          query: this.query
        });
      } else {
        this.toggled = !this.toggled;
      }
    },
    filterCategories(text) {
      this.categoriesFiltered = VALID_CATEGORIES.filter(
        category =>
          (!text || category.startsWith(text)) &&
          !this.categories.includes(category)
      );
    }
  }
};
</script>

<style>
.advancedFilters.hidden {
  display: none;
}
.toggleButton {
  text-align: right;
  margin-bottom: 0.75rem;
}
</style>
