<template>
  <section class="section">
    <div class="container bot-container">
      <div class="box">
        <div class="columns">
          <figure class="column is-narrow">
            <p class="image is-128x128">
              <discord-icon v-if="bot.icon" :object-id="bot.id" :hash="bot.icon" size="256" type="app-icon" />
              <img v-else src="https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png" alt="Default Discord avatar" class="is-rounded">
            </p>
          </figure>
          <div class="column">
            <div class="content">
              <p>
                <strong class="title is-3 bot-name">{{ bot.name }}</strong> <small class="bot-owners">by {{ bot.owners }}</small>
                <br>
                {{ bot.tagline }}
              </p>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                <router-link v-if="!isPreview" :to="`/bots/${bot.id}/invite`" class="level-item dark-link">
                  <span>Invite</span>
                </router-link>
                <a v-else href="#" class="level-item dark-link">
                  <span>Invite</span>
                </a>
                <a v-if="!!bot.website" :href="bot.website" target="_blank" rel="noopener" class="level-item dark-link">
                  <span>Website</span>
                </a>
              </div>
            </nav>
          </div>
          <div class="column is-narrow">
            <b-field v-if="canModify && !isPreview">
              <p class="control">
                <router-link :to="`/bots/${bot.id}/edit`" class="button">Edit</router-link>
              </p>
              <p class="control">
                <button v-if="deleteLoading" class="button is-danger" disabled loading>Delete</button>
                <button v-else class="button is-danger" @click="deleteModalActive = true">Delete</button>
              </p>
            </b-field>
            <span class="tag">1000 servers</span>
            <br>
            <span class="tag">Open Source</span>
          </div>
        </div>
      </div>
      <div class="bot-description" v-html="bot.description"/>
    </div>
    <b-modal v-if="canModify && !isPreview" :can-cancel="['escape', 'outside']" :active.sync="deleteModalActive" has-modal-card>
      <div class="modal-card animation-content">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete {{ bot.name }}?</p>
        </header>
        <section class="modal-card-body is-flex">
          <div class="media">
            <div class="media-left">
              <p class="image is-48x48">
                <discord-icon :object-id="bot.id" :hash="bot.icon" size="128" type="app-icon" />
              </p>
            </div>
            <div class="media-content">
              <p>Are you sure you want to <b>delete</b> {{ bot.name }}?</p>
              <p>To confirm, type the bot's name:</p>
              <b-field>
                <b-input v-model="deleteConfirmText"/>
              </b-field>
            </div>
          </div>
          <b-notification :active.sync="deleteError" type="is-danger">
            {{ deleteErrorMessage }}
          </b-notification>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="deleteModalActive = false">Cancel</button>
          <button :disabled="deleteLoading || (deleteConfirmText !== bot.name)" :loading="deleteLoading" class="button is-danger" @click="deleteBot">Delete</button>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import DiscordIcon from "./DiscordIcon.vue";

export default {
  components: {
    DiscordIcon
  },
  props: {
    bot: {
      type: Object,
      required: true,
      validator(val) {
        return (typeof val.id === "string" && (/^\d{17,21}$/.test(val.id) || val.id === "0")) &&
          typeof val.name === "string" &&
          typeof val.owners === "string" &&
          typeof val.tagline === "string" &&
          typeof val.description === "string" &&
          (val.website && typeof val.website === "string" || true) &&
          (val.icon && typeof val.icon === "string" || true)
      }
    },
    canModify: {
      type: Boolean,
      default: false
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deleteLoading: false,
      deleteModalActive: false,
      deleteConfirmText: "",

      deleteError: false,
      deleteErrorMessage: ""
    };
  },
  methods: {
    deleteBot() {
      if(this.deleteLoading) {
        return;
      }

      this.deleteLoading = true;
      return this.$axios.$delete(`/bots/${this.bot.id}`).then(() => {
        this.deleteModalActive = false;
        this.deleteLoading = false;

        this.$router.push("/profile");
      }).catch((err) => {
        console.error(err);
        this.deleteLoading = false;

        this.deleteError = true;
        if(err.response) {
          this.deleteErrorMessage = err.response.data && err.response.data.error || `Unknown error (${err.response.status})`;
        } else {
          this.deleteErrorMessage = err.message || "Unknown error";
        }
      });
    }
  }
}
</script>
