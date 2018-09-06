<template>
  <section>
    <b-field class="paginator" position="is-centered">
      <b-pagination :total="total" :current.sync="page" :per-page="perPage"/>
    </b-field>
  </section>
</template>

<script>
export default {
  data() {
    return {
      total: 200
    };
  },
  computed: {
    perPage() {
      return parseInt(this.$route.query.limit) || 24;
    },
    page: {
      get() {
        let page = parseInt(this.$route.query.page);
        return isNaN(page) ? 1 : page;
      },
      set(value) {
        this.gotoPage(value);
      }
    }
  },
  methods: {
    gotoPage(page) {
      if (page < 0) page = 0;
      let route = {
        path: this.$route.path,
        query: {
          q: this.$route.query.q,
          category: this.$route.query.category,
          limit: this.$route.query.limit,
          page: page,
          sort: this.$route.query.sort
        }
      };
      this.$router.push(route);
    }
  }
};
</script>

<style>
.paginator {
  margin: 0.75rem auto;
  max-width: 400px;
}
</style>
