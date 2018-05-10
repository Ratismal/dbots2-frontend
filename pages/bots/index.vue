<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Discover Discord Bots
        </h1>
        <h2 class="subtitle">
          Find the perfect bot for your server
        </h2>
        <bot-list-search-bar path="/bots"/>
      </div>
      <hr>
      <div class="container">
        <bot-list-item-grid :bots="bots"/>
      </div>
    </section>
  </div>
</template>

<script>
import BotListItemGrid from "~/components/BotListItemGrid.vue"
import BotListSearchBar from "~/components/BotListSearchBar.vue"

export default {
  components: {
    BotListItemGrid,
    BotListSearchBar
  },
  head() {
    return {
      title: "Discover Bots | Discord Bots"
    }
  },
  middleware: "betaOnly",
  data() {
    return {
      bots: []
    };
  },
  asyncData(ctx) {
    return ctx.$axios.$get("/bots", {
      params: {
        limit: ctx.query.limit,
        page: ctx.query.page,
        q: ctx.query.q,
        sort: ctx.query.sort
      }
    }).then((bots) => {
      return {
        bots: bots
      };
    }).catch((err) => {
      if(err && err.response && err.response.status) {
        return ctx.error({
          statusCode: err.response.status,
          message: err.response.data && err.response.data.message || err.message || "Internal error"
        });
      }
      return ctx.error({
        statusCode: 500,
        message: err.message || "Internal error"
      });
    });
  },
  watchQuery: ["limit", "page", "q", "sort"]
}
</script>
