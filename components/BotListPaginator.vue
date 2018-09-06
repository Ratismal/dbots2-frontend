<template>
  <section>
    <b-field class="paginator" position="is-centered">
      <div class="control">
        <button class="button" @click="gotoPage(0)">First</button>
      </div>
      <div class="control">
        <button class="button" @click="gotoPage(page - 1)">Prev</button>
      </div>
      <div class="control">
        <button class="button is-static">Page {{ pageLabel }}</button>
      </div>
      <div class="control">
        <button class="button" @click="gotoPage(page + 1)">Next</button>
      </div>
      <!-- API doesn't return the max number of bots, can't calculate last page? -->
      <div class="control">
        <button disabled class="button">Last</button>
      </div>
    </b-field>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    pageLabel() {
      return (this.page + 1).toString();
    },
    page() {
      return parseInt(this.$route.query.page) || 0;
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
          page: this.$route.query.page,
          sort: this.$route.query.sort
        }
      };
      route.query.page = page;
      console.log(route);
      this.$router.push(route);
    }
  }
};
</script>

<style>
.paginator {
  margin: 0.75rem 0;
}
</style>
