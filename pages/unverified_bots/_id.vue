<template>
  <div>
    <section class="section">
      <div class="container bot-container">
        <div class="box">
          <div class="columns">
            <figure class="column is-narrow">
              <p class="image is-128x128">
                <discord-icon :object-id="bot.id" :hash="bot.icon" size="256" type="app-icon" />
              </p>
            </figure>
            <div class="column">
              <div class="content">
                <p>
                  <strong class="title is-3 bot-name">{{ bot.name }}</strong> <small class="bot-owners">by {{ owners }}</small>
                  <br>
                  {{ bot.tagline }}
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <router-link :to="`/unverified_bots/${bot.id}/invite`" class="level-item">
                    <span>Invite</span>
                  </router-link>
                  <a v-if="!!bot.website" :href="bot.website" target="_blank" rel="noopener" class="level-item">
                    <span>Website</span>
                  </a>
                </div>
              </nav>
            </div>
            <div class="column is-narrow">
              <b-field v-if="isMod || canModify">
                <p class="control">
                  <router-link :to="`/unverified_bots/${bot.id}/edit`" class="button">Edit</router-link>
                </p>
                <p v-if="isMod" class="control">
                  <button v-if="verifyLoading" class="button is-warning" disabled loading>Verify</button>
                  <button v-else class="button is-warning" @click="verifyModalActive = true">Verify</button>
                </p>
                <p class="control">
                  <button v-if="deleteLoading" class="button is-danger" disabled loading>Delete</button>
                  <button v-else class="button is-danger" @click="deleteModalActive = true">Delete</button>
                </p>
              </b-field>
              <span class="tag">1000 servers</span>
              <br>
              <span class="tag">Open Source</span>
              <br>
              <span class="tag is-warning">Unverified</span>
            </div>
          </div>
        </div>
        <div v-html="bot.description"/>
      </div>
    </section>
    <b-modal :can-cancel="['escape', 'outside']" :active.sync="verifyModalActive" has-modal-card>
      <div class="modal-card animation-content">
        <header class="modal-card-head">
          <p class="modal-card-title">Verify {{ bot.name }}?</p>
        </header>
        <section class="modal-card-body is-flex">
          <div class="media">
            <div class="media-left">
              <p class="image is-48x48">
                <discord-icon :object-id="bot.id" :hash="bot.icon" size="128" type="app-icon" />
              </p>
            </div>
            <div class="media-content">
              <p>Are you sure you want to <b>verify</b> {{ bot.name }}?</p>
            </div>
          </div>
          <b-notification :active.sync="verifyError" type="is-danger">
            {{ verifyErrorMessage }}
          </b-notification>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="verifyModalActive = false">Cancel</button>
          <button :disabled="verifyLoading" :loading="verifyLoading" class="button is-warning" @click="verifyBot">Verify</button>
        </footer>
      </div>
    </b-modal>
    <b-modal :can-cancel="['escape', 'outside']" :active.sync="deleteModalActive" has-modal-card>
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
  </div>
</template>

<script>
import DiscordIcon from "~/components/DiscordIcon.vue"

export default {
  components: {
    DiscordIcon
  },
  validate(ctx) {
    return /^\d{17,21}$/.test(ctx.params.id);
  },
  head() {
    return {
      title: `${this.bot.name} | Discord Bots`
    }
  },
  middleware: "betaOnly",
  data() {
    return {
      verifyError: false,
      verifyErrorMessage: "",
      verifyLoading: false,
      verifyModalActive: false,

      deleteConfirmText: "",
      deleteError: false,
      deleteErrorMessage: "",
      deleteLoading: false,
      deleteModalActive: false
    };
  },
  asyncData(ctx) {
    return ctx.$axios.$get(`/unverified_bots/${ctx.params.id}`, {
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
  methods: {
    verifyBot() {
      if(this.verifyLoading) {
        return;
      }

      this.verifyLoading = true;
      return this.$axios.$post(`/unverified_bots/${this.bot.id}/verify`).then(() => {
        this.verifyModalActive = false;
        this.verifyLoading = false;

        this.$router.push(`/bots/${this.bot.id}`);
      }).catch((err) => {
        console.error(err);
        this.verifyLoading = false;

        this.verifyError = true;
        if(err.response) {
          this.verifyErrorMessage = err.response.data && err.response.data.error || `Unknown error (${err.response.status})`;
        } else {
          this.verifyErrorMessage = err.message || "Unknown error";
        }
      });
    },
    deleteBot() {
      if(this.deleteLoading) {
        return;
      }

      this.deleteLoading = true;
      return this.$axios.$delete(`/unverified_bots/${this.bot.id}`).then(() => {
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

<style>
.bot-container {
  padding-top: 1em;
}
.bot-owners {
  margin-left: .5em;
}
</style>
