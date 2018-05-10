<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="level">
          <div class="media-left">
            <figure class="image is-64x64">
              <discord-icon :object-id="bot.id" :hash="bot.icon" size="64" type="app-icon" />
            </figure>
          </div>
          <div class="media-content bot-item-header">
            <p class="title is-4">{{ bot.name }}</p>
            <p v-if="bot.owners" class="subtitle is-6">by {{ owners }}</p>
          </div>
        </div>
      </div>
      <div class="content">
        <span v-if="unverified" class="tag is-warning">Unverified</span>
      </div>
      <div class="content">
        {{ bot.tagline }}
      </div>
    </div>
    <footer class="card-footer">
      <router-link :to="`${basePath}/invite`" class="card-footer-item">Invite</router-link>
      <router-link :to="basePath" class="card-footer-item">View</router-link>
    </footer>
  </div>
</template>

<script>
import DiscordIcon from "./DiscordIcon"

export default {
  components: {
    DiscordIcon
  },
  props: {
    bot: {
      type: Object,
      default: () => ({})
    },
    unverified: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    basePath() {
      if(this.unverified) {
        return `/unverified_bots/${this.bot.id}`;
      }
      return `/bots/${this.bot.id}`;
    },
    owners() {
      if(!this.bot.owners) {
        return "";
      }
      return this.bot.owners.map((owner) => `${owner.username}#${("000" + owner.discriminator).substring(owner.discriminator.toString().length - 1)}`).join(", "); // left-pad lol
    }
  }
}
</script>

<style>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-footer {
  margin-top: auto;
}
.card-footer-item {
  padding: 0.5rem;
}
.bot-item-header {
  overflow-y: hidden;
}
</style>
