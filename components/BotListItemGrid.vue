<template>
  <div class="columns is-multiline">
    <template v-if="bots.length > 0">
      <div v-for="bot in bots" :key="bot.id" class="column is-12-mobile is-6-tablet is-4-desktop is-3-fullhd">
        <bot-list-item :bot="bot" :unverified="unverified"/>
      </div>
    </template>
    <div v-else class="column is-12-mobile">
      <p><i>A stray tumbleweed bounces across the barren desert.</i></p>
    </div>
  </div>
</template>

<script>
import BotListItem from "~/components/BotListItem.vue"

export default {
  components: {
    BotListItem
  },
  props: {
    bots: {
      type: Array,
      default: () => []
    },
    unverified: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
</style>
