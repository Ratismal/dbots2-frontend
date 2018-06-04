<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Edit a Bot
        </h1>
        <bot-form :edit="true" :old-bot="bot" :unverified="false"/>
      </div>
    </section>
  </div>
</template>

<script>
import BotForm from "~/components/BotForm.vue";

export default {
  components: {
    BotForm
  },
  validate(ctx) {
    return /^\d{17,21}$/.test(ctx.params.id);
  },
  asyncData(ctx) {
    return ctx.$axios.$get(`/bots/${ctx.params.id}`, {
      params: {
        description: true,
        owners: true,
      }
    }).then((bot) => {
      let owners = "";

      return { id: ctx.params.id, bot };
    }).catch((err) => {
      console.error(err, err.response);
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
  middleware: ["authenticated", "betaOnly"],
  computed: {
    computedBot() {
      return Object.assign({}, this.bot, {owners: this.owners});
    }
  }
}
</script>

<style>

</style>
