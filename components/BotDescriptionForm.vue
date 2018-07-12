<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field :type="isInvalidDescription ? 'is-danger' : ''" :message="isInvalidDescription" label="Description">
          <b-input v-model="editedDescription" type="textarea" minlength="32" maxlength="16000" placeholder="Now describe the bot! Go into detail!" required @blur="validateDescription" @input="validateDescription"/>
        </b-field>
        <div class="buttons">
          <b-checkbox v-model="previewColumnActive" class="button is-text">Preview</b-checkbox>
          <a v-if="editedDescription" class="button is-text" href="#" @click="previewModalActive = true">Full Preview</a>
          <a v-else class="button is-text" href="#" disabled @click.prevent>Full Preview</a>
          <b-modal :active.sync="previewModalActive" :has-modal-card="true" class="preview-modal" >
            <div class="modal-card description-preview">
              <header class="modal-card-head">
                <p class="modal-card-title">Preview</p>
              </header>
              <section class="modal-card-body">
                <nav-bar />
                <bot-view :bot="previewBot" :is-preview="true"/>
              </section>
            </div>
          </b-modal>
        </div>
      </div>
      <div v-if="previewColumnActive" class="column">
        <label class="label">Preview</label>
        <div class="bot-description" v-html="editedDescription"/>
      </div>
    </div>
    <b-notification :active.sync="notifyError" type="is-danger" v-html="notifyErrorMessage"/>
    <b-field grouped>
      <p class="control">
        <button v-if="submitted" disabled class="button is-success">Success <b-icon icon="checkmark"/></button>
        <button v-else-if="submitLoading" disabled class="button is-primary is-loading">Submit</button>
        <button v-else :disabled="!!isInvalidDescription" class="button is-primary" @click.prevent="submitData">Submit</button>
      </p>
      <p class="control">
        <router-link :to="endpoint + '/edit'" class="button">Edit Bot</router-link>
      </p>
    </b-field>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";
import BotView from "~/components/BotView.vue";

export default {
  components: { BotView, NavBar: Navbar },
  middleware: ["authenticated", "betaOnly"],
  props: {
    bot: {
      type: Object,
      default: () => {
        return {};
      }
    },
    description: {
      type: String,
      default: () => {
        return "";
      }
    },
    unverified: { // Whether or not the bot is unverified
      type: Boolean,
      default: false
    }
  },
  validate(ctx) {
    return /^\d{17,21}$/.test(ctx.params.id);
  },
  data() {
    return {
      editedDescription: "",

      isInvalidDescription: "",

      submitLoading: false,
      submitted: false,

      notifyError: false,
      notifyErrorMessage: "",

      previewColumnActive: false,
      previewModalActive: false
    };
  },
  computed: {
    sanitizedDescription() {
      // TODO: actually implement
      return this.editedDescription;
    },
    previewBot() {
      return Object.assign({}, this.bot, {
        description: this.sanitizedDescription,
        owners: this.bot.owners.map(o => o.tag).join(", ")
      });
    },
    endpoint() {
      let endpoint = this.unverified ? "/unverified_bots" : "/bots";
      endpoint += "/" + this.$route.params.id;
      return endpoint;
    }
  },
  mounted() {
    this.populateData();
  },
  methods: {
    populateData() {
      this.editedDescription = this.description;
    },

    validateDescription() {
      if(this.editedDescription.length < 32) {
        return this.isInvalidDescription = "Too short";
      }
      if(this.editedDescription.length > 16000) {
        return this.isInvalidDescription = "Too long";
      }

      return this.isInvalidDescription = "";
    },

    submitData() {
      if(this.validateDescription()) {
        return;
      }

      if(this.isInvalidDescription || this.submitLoading) {
        return;
      }

      this.submitLoading = true;
      this.$axios.$patch(this.endpoint + (this.unverified ? "/description" : "/modified_description"), {
        description: this.editedDescription
      }).then(() => {
        this.submitLoading = false;
        this.submitted = true;

        this.$router.push(this.endpoint);
      }).catch((err) => {
        console.error(err);
        this.submitLoading = false;

        this.notifyError = true;
        if(err.response) {
          let msg = `Unknown error (${err.response.status})`;
          if(err.response) {
            if(err.response.data) {
              if(err.response.data.error) {
                msg = err.response.data.error;
                if(err.response.data.messages && err.response.data.messages.join) {
                  msg += "\n  " + err.response.data.messages.join("\n  ");
                }
              }
            }
          }
          this.notifyErrorMessage = msg.replace(/\n/g, "<br />");
        } else {
          this.notifyErrorMessage = err.message || "Unknown error";
        }
      });
    }
  }
}
</script>

<style>
.description-preview {
  width: 100%;
  position: relative;
}
.preview-modal > .animation-content {
  width: 100%
}
.bot-container {
  padding-top: 1em;
  width: 100%;
}
.bot-owners {
  margin-left: .5em;
}
</style>
