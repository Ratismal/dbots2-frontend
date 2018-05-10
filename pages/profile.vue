<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Your Bots
        </h1>
        <hr>
        <bot-list-item-grid :bots="ownedBots"/>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Your Unverified Bots
        </h1>
        <hr>
        <bot-list-item-grid :bots="unverifiedBots" unverified/>
      </div>
    </section>
  </div>
</template>

<script>
import BotListItemGrid from "~/components/BotListItemGrid.vue"

export default {
  components: {
    BotListItemGrid
  },
  head() {
    return {
      title: "Profile | Discord Bots"
    }
  },
  middleware: "betaOnly",
  data() {
    return {
      ownedBots: [],
      unverifiedBots: []
    };
  },
  asyncData(ctx) {
    return Promise.all([
      ctx.$axios.$get("/users/@me/bots"),
      ctx.$axios.$get("/users/@me/unverified_bots")
    ]).then((res) => {
      return {
        ownedBots: res[0],
        unverifiedBots: res[1]
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
  }
}
</script>

<style>
</style>
