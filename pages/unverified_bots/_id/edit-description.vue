<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Edit {{ bot.name }}
        </h1>
        <bot-description-form :bot="bot" :description="description" unverified/>
      </div>
    </section>
  </div>
</template>

<script>
import BotDescriptionForm from "~/components/BotDescriptionForm.vue";

export default {
  components: {
    BotDescriptionForm
  },
  validate(ctx) {
    return /^\d{17,21}$/.test(ctx.params.id);
  },
  middleware: ["authenticated", "betaOnly"],
  asyncData(ctx) {
    return ctx.$axios.$get(`/unverified_bots/${ctx.params.id}`, {
      params: {
        description: true,
        owners: true
      }
    }).then((bot) => {
      return {
        bot: bot,
        description: bot.description
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
