<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Edit a Bot
        </h1>
        <bot-form :old-bot="bot" edit />
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
  middleware: ["authenticated", "betaOnly"],
  asyncData(ctx) {
    return ctx.$axios.$get(`/bots/${ctx.params.id}`, {
      params: {
        description: true,
        owners: true,
      }
    }).then((bot) => {
      return {
        id: ctx.params.id,
        bot: bot
      };
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
  }
}
</script>

<style>

</style>
