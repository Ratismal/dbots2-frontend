<template>
  <bot-view :bot="computedBot" :can-modify="isMod || canModify"/>
</template>

<script>
import DiscordIcon from "~/components/DiscordIcon.vue";
import BotView from "~/components/BotView.vue";

export default {
  components: {
    DiscordIcon,
    BotView
  },
  validate(ctx) {
    return /^\d{17,21}$/.test(ctx.params.id);
  },
  head() {
    return {
      title: `${this.bot.name} | Discord Bots`
    };
  },
  middleware: "betaOnly",
  asyncData(ctx) {
    return ctx.$axios.$get(`/bots/${ctx.params.id}`, {
      params: {
        description: true,
        owners: true,
      }
    }).then((bot) => {
      let owners = "";
      if(bot.owners) {
        owners = bot.owners.map((owner) => `${owner.username}#${("000" + owner.discriminator).substring(owner.discriminator.toString().length - 1)}`).join(", ");
      }
      return {
        bot: bot,
        owners: owners,

        canModify: !!bot.owners.find((owner) => owner.id === ctx.store.state.auth.user.id),
        isMod: !!(ctx.store.state.auth.user.flags & 0b10000)
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
  computed: {
    computedBot() {
      return Object.assign({}, this.bot, {owners: this.owners});
    }
  }
}
</script>

<style>
.bot-container {
  padding-top: 1em;
}
.bot-owners {
  margin-left: .5em;
}
</style>
