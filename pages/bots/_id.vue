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
