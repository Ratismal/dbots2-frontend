<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Add a Bot
        </h1>

        <form>
          <b-field grouped>
            <b-field :type="isInvalidClientID ? 'is-danger' : ''" :message="isInvalidClientID" label="Client ID" expanded>
              <b-input v-model="clientID" minlength="18" required @input="validateClientID" @blur="validateClientID"/>
            </b-field>
            <b-field :type="isInvalidLibrary ? 'is-danger' : ''" :message="isInvalidLibrary" label="Library">
              <b-select v-model="library" placeholder="Select a library:" required @input="validateLibrary" @blur="validateLibrary">
                <option v-for="library in libraries" :key="library" :value="library">{{ library }}</option>
              </b-select>
            </b-field>
            <b-field :type="isInvalidWebsite ? 'is-danger' : ''" :message="isInvalidWebsite" label="Website" expanded>
              <b-input v-model="website" type="url" minlength="3" @input="validateWebsite" @blur="validateWebsite"/>
            </b-field>
          </b-field>
          <b-field grouped>
            <b-field :type="isInvalidPrefixes ? 'is-danger' : ''" :message="isInvalidPrefixes" label="Prefix(es)" expanded>
              <b-taginput v-model="prefixes" :confirm-key-codes="[13]" minlength="1" placeholder="!, @mention" @input="validatePrefixes" @blur="validatePrefixes"/>
            </b-field>
            <b-field :type="isInvalidOwners ? 'is-danger' : ''" :message="isInvalidOwners" label="Owners" expanded>
              <b-taginput v-model="owners" :data="searchOwnersResult" :loading="searchOwnersLoading" field="tag" autocomplete @typing="searchOwners" @add="addOwner" @remove="removeOwner">
                <template slot-scope="props">
                  <div class="level">
                    <div class="level-item">
                      <discord-icon :hash="props.option.avatar" :object-id="props.option.id" size="32" type="avatar" />
                    </div>
                    <div class="level-item">
                      {{ props.option.username }}#{{ ("000" + props.option.discriminator).substring(props.option.discriminator.toString().length - 1) }}
                    </div>
                  </div>
                </template>
              </b-taginput>
            </b-field>
            <b-field :type="isInvalidCategories ? 'is-danger' : ''" :message="isInvalidCategories" label="Categories" expanded>
              <b-taginput v-model="categories" :data="categoriesFiltered" autocomplete open-on-focus @input="validateCategories" @blur="validateCategories" @typing="filterCategories"/>
            </b-field>
          </b-field>
          <b-field>
            <b-input :value="invite" disabled expanded placeholder="Insert invite URL"/>
            <div class="control">
              <a class="button" @click.prevent="inviteModalActive = true">Edit</a>
            </div>
          </b-field>
          <b-field :type="isInvalidTagline ? 'is-danger' : ''" :message="isInvalidTagline" label="Tagline">
            <b-input v-model="tagline" minlength="8" maxlength="200" placeholder="A short description of your bot" required @blur="validateTagline" @input="validateTagline"/>
          </b-field>
          <b-field :type="isInvalidDescription ? 'is-danger' : ''" :message="isInvalidDescription" label="Description">
            <b-input v-model="description" type="textarea" minlength="32" maxlength="16000" placeholder="Now describe the bot! Go into detail!" required @blur="validateDescription" @input="validateDescription"/>
          </b-field>
          <b-notification :active.sync="notifyError" type="is-danger" v-html="notifyErrorMessage"/>
          <b-field grouped>
            <p class="control">
              <button v-if="submitted" disabled class="button is-success">Success <b-icon icon="checkmark"/></button>
              <button v-else-if="submitLoading" disabled class="button is-primary is-loading">Submit</button>
              <button v-else :disabled="isInvalidAny" class="button is-primary" @click.prevent="submitData">Submit</button>
            </p>
            <p class="control">
              <button v-if="saveLoading" disabled class="button is-loading">Save Draft</button>
              <button v-else class="button" @click.prevent="saveData">Save Draft</button>
            </p>
          </b-field>
        </form>
      </div>
    </section>
    <b-modal :active.sync="inviteModalActive" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Invite Link Generator</p>
        </header>
        <section class="modal-card-body">
          <b-field :type="isInvalidPermissions ? 'is-danger' : ''">
            <b-input v-model="invitePermissions" type="number" placeholder="Permissions number" expanded @blur="validatePermissions" @input="validatePermissions"/>
            <p class="control">
              <a href="https://discordapi.com/permissions.html" target="_blank" rel="noopener" class="button">
                <b-icon icon="calculator"/>
              </a>
            </p>
          </b-field>
          <b-checkbox v-model="inviteCodeGrant">Require Code Grant</b-checkbox>
          <b-field :type="isInvalidInviteScopes ? 'is-danger' : ''" :message="isInvalidInviteScopes" label="Scopes">
            <b-taginput v-model="inviteScopes" :data="inviteScopesFiltered" autocomplete @blur="validateInviteScopes" @input="validateInviteScopes" @typing="filterInviteScopes"/>
          </b-field>
          <b-field :type="isInvalidRedirectURI ? 'is-danger' : ''" :message="isInvalidRedirectURI" label="Redirect URI">
            <b-input v-model="inviteRedirectURI" @blur="validateRedirectURI" @input="validateRedirectURI"/>
          </b-field>

          <p>
            <a :href="invite" class="long-link">{{ invite }}</a>
          </p>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="inviteModalActive = false">Close</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import DiscordIcon from "~/components/DiscordIcon.vue"

const VALID_CATEGORIES = ["anime", "fun", "games", "moderation", "music", "nsfw", "utility"];
const VALID_LIBRARIES = ["Discord.Net", "discord.js", "Eris", "discord.py", "Custom Library"];
const VALID_SCOPES = ["bot", "connections", "email", "identify", "guilds", "guilds.join", "gdm.join", "messages.read", "rpc", "rpc.api", "rpc.notifications.read", "webhook.incoming"];

// TODO move
function createDebouncer() {
  let debounceTimeout = null;
  return function _debounce(func, delay) {
    if(debounceTimeout) {
      return;
    }
    debounceTimeout = setTimeout(function() {
      Promise.resolve(func()).catch((err) => console.error(err)).then(() => debounceTimeout = null);
    }, delay);
  }
}

export default {
  components: {
    DiscordIcon
  },
  middleware: ["authenticated", "betaOnly"],
  data() {
    let currentUser = this.$store.state.auth.user;
    currentUser.tag = `${currentUser.username}#${("000" + currentUser.discriminator).substring(currentUser.discriminator.toString().length - 1)}`; // left-pad lol
    return {
      clientID: "",
      library: null,
      website: "",
      prefixes: [],
      owners: [currentUser],
      categories: [],
      tagline: "",
      description: "",

      isInvalidClientID: "",
      isInvalidLibrary: "",
      isInvalidWebsite: "",
      isInvalidPrefixes: "You must have at least one prefix",
      isInvalidOwners: "",
      isInvalidCategories: "You must have at least one category",
      isInvalidTagline: "",
      isInvalidDescription: "",

      searchOwnersDebouncer: createDebouncer(),
      searchOwnersLoading: false,
      searchOwnersQuery: "",
      searchOwnersResult: [],

      categoriesFiltered: VALID_CATEGORIES.map((category) => category),
      libraries: VALID_LIBRARIES.map((library) => library),

      inviteModalActive: false,
      invitePermissions: 0,
      inviteCodeGrant: false,
      inviteScopes: ["bot"],
      inviteScopesFiltered: [],
      inviteRedirectURI: "",

      isInvalidPermissions: "",
      isInvalidInviteScopes: "",
      isInvalidRedirectURI: "",

      saveLoading: false,
      submitLoading: false,
      submitted: false,

      notifyError: false,
      notifyErrorMessage: ""
    };
  },
  computed: {
    invite() {
      let inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${this.clientID}`;
      if(this.invitePermissions) {
        inviteURL += `&permissions=${this.invitePermissions}`;
      }
      if(this.inviteCodeGrant) {
        inviteURL += "&response_type=code";
      }
      if(this.inviteScopes.length > 0) {
        inviteURL += `&scope=${encodeURIComponent(this.inviteScopes.join(" "))}`;
      }
      if(this.inviteRedirectURI) {
        inviteURL += `&redirect_uri=${encodeURIComponent(this.inviteRedirectURI)}`;
      }
      return inviteURL;
    },
    isInvalidAny() {
      return !!(this.isInvalidClientID || this.isInvalidLibrary || this.isInvalidWebsite || this.isInvalidPrefixes || this.isInvalidOwners || this.isInvalidCategories || this.isInvalidTagline || this.isInvalidDescription || this.isInvalidPermissions || this.isInvalidInviteScopes || this.isInvalidRedirectURI);
    }
  },
  mounted() {
    try {
      let botFormDraft = window.localStorage.getItem("botFormDraft");
      botFormDraft = JSON.parse(botFormDraft);
      if(botFormDraft) {
        if(botFormDraft.clientID) {
          this.clientID = botFormDraft.clientID;
        }
        if(botFormDraft.library) {
          this.library = botFormDraft.library;
        }
        if(botFormDraft.website) {
          this.website = botFormDraft.website;
        }
        if(botFormDraft.prefixes) {
          this.prefixes = botFormDraft.prefixes;
        }
        if(botFormDraft.owners) {
          this.owners = botFormDraft.owners;
        }
        if(botFormDraft.categories) {
          this.categories = botFormDraft.categories;
        }
        if(botFormDraft.tagline) {
          this.tagline = botFormDraft.tagline;
        }
        if(botFormDraft.description) {
          this.description = botFormDraft.description;
        }
        if(botFormDraft.invitePermissions) {
          this.invitePermissions = botFormDraft.invitePermissions;
        }
        if(botFormDraft.inviteCodeGrant) {
          this.inviteCodeGrant = botFormDraft.inviteCodeGrant;
        }
        if(botFormDraft.inviteScopes) {
          this.inviteScopes = botFormDraft.inviteScopes;
        }
        if(botFormDraft.inviteRedirectURI) {
          this.inviteRedirectURI = botFormDraft.inviteRedirectURI;
        }
        this.validateAll();
      }
    } catch(err) {
      console.error(err);
      window.localStorage.removeItem("botFormDraft");
    }
  },
  methods: {
    validateClientID() {
      if(!(/^\d{18,21}$/.test(this.clientID))) {
        return this.isInvalidClientID = "Invalid client ID";
      }

      return this.isInvalidClientID = "";
    },
    validateLibrary() {
      if(!this.library) {
        return this.isInvalidLibrary = "You must choose a library";
      }

      if(!VALID_LIBRARIES.includes(this.library)) {
        return this.isInvalidLibrary = `Invalid library: ${this.library}`;
      }

      return this.isInvalidLibrary = "";
    },
    validateWebsite() {
      if(this.website) {
        if(!(/^https?:\/\//.test(this.website))) {
          return this.isInvalidWebsite = "Invalid URL (missing http(s)://)";
        }
        if(!(/^https?:\/\/[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/.test(this.website))) {
          return this.isInvalidWebsite = "Invalid URL";
        }
      }

      return this.isInvalidWebsite = "";
    },
    validatePrefixes() {
      if(this.prefixes.length <= 0) {
        return this.isInvalidPrefixes = "You must have at least one prefix";
      }

      for(let prefix of this.prefixes) {
        if(/@\w/.test(prefix) && prefix !== "@mention") {
          return this.isInvalidPrefixes = "For mentions, use '@mention'";
        }
      }

      return this.isInvalidPrefixes = "";
    },
    validateOwners() {
      if(this.owners.length <= 0) {
        return this.isInvalidOwners = "You must have at least one owner";
      }

      for(let owner of this.owners) {
      }

      return this.isInvalidOwners = "";
    },
    validateCategories() {
      if(this.categories.length <= 0) {
        return this.isInvalidCategories = "You must have at least one category";
      }

      for(let category of this.categories) {
        if(!VALID_CATEGORIES.includes(category)) {
          return this.isInvalidCategories = `Invalid category: ${category}`;
        }
      }

      return this.isInvalidCategories = "";
    },
    validateTagline() {
      if(this.tagline.length < 8) {
        return this.isInvalidTagline = "Too short";
      }
      if(this.tagline.length > 200) {
        return this.isInvalidTagline = "Too long";
      }

      return this.isInvalidTagline = "";
    },
    validateDescription() {
      if(this.description.length < 32) {
        return this.isInvalidDescription = "Too short";
      }
      if(this.description.length > 16000) {
        return this.isInvalidDescription = "Too long";
      }

      return this.isInvalidDescription = "";
    },

    validatePermissions() {
      if(isNaN(this.invitePermissions)) {
        return this.isInvalidPermissions = "Invalid permissions number";
      }
      this.invitePermissions = +this.invitePermissions;
      if(this.invitePermissions < 0) {
        return this.isInvalidPermissions = "Invalid permissions number";
      }

      return this.isInvalidPermissions = "";
    },
    validateInviteScopes() {
      if(!this.inviteScopes.includes("bot")) {
        return this.isInvalidInviteScopes = "You must have the bot scope";
      }

      for(let scope of this.inviteScopes) {
        if(!VALID_SCOPES.includes(scope)) {
          return this.isInvalidInviteScopes = `Invalid scope: ${scope}`;
        }
      }

      return this.isInvalidInviteScopes = "";
    },
    validateRedirectURI() {
      if(this.inviteRedirectURI) {
        if(!(/^https?:\/\//.test(this.inviteRedirectURI))) {
          return this.isInvalidRedirectURI = "Invalid URL (missing http(s)://)";
        }
        if(!(/^https?:\/\/[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/.test(this.inviteRedirectURI))) {
          return this.isInvalidRedirectURI = "Invalid URL";
        }
      }

      return this.isInvalidRedirectURI = "";
    },
    validateAll() {
      let res = false;
      res |= !!this.validateClientID();
      res |= !!this.validateLibrary();
      res |= !!this.validateWebsite();
      res |= !!this.validatePrefixes();
      res |= !!this.validateOwners();
      res |= !!this.validateCategories();
      res |= !!this.validateTagline();
      res |= !!this.validateDescription();
      res |= !!this.validatePermissions();
      res |= !!this.validateInviteScopes();
      res |= !!this.validateRedirectURI();
      return res;
    },

    searchOwners(query) {
      this.searchOwnersQuery = query;
      if(!query) {
        this.searchOwnersResult = [];
        return;
      }

      this.searchOwnersLoading = true;
      this.searchOwnersDebouncer(() => {
        if(!this.searchOwnersQuery) {
          this.searchOwnersResult = [];
          this.searchOwnersLoading = false;
          return;
        }

        return this.$axios.$get("/users", {
          params: {
            q: this.searchOwnersQuery,
            limit: 50
          }
        }).catch((err) => {
          console.error(err);
          return [];
        }).then((res) => {
          this.searchOwnersLoading = false;
          this.searchOwnersResult = res.map((user) => {
            user.tag = `${user.username}#${("000" + user.discriminator).substring(user.discriminator.toString().length - 1)}`; // left-pad lol
            return user;
          });
        });
      }, 250);
    },
    addOwner(newOwner) {
      let alreadyFound = false;
      for(let index in this.owners) { // Duplicate tag prevention
        if(this.owners[index].id === newOwner.id) {
          if(alreadyFound) {
            this.owners.splice(index, 1);
            break;
          } else {
            alreadyFound = true;
          }
        }
      }

      this.validateOwners();
    },
    removeOwner(oldOwner) {
      for(let index in this.owners) {
        if(this.owners[index].id === oldOwner.id) {
          this.owners.splice(index, 1);
          break;
        }
      }

      this.validateOwners();
    },

    filterCategories(text) {
      this.categoriesFiltered = VALID_CATEGORIES.filter((category) => (!text || category.startsWith(text)) && !this.categories.includes(category));
    },
    filterInviteScopes(text) {
      this.inviteScopesFiltered = VALID_SCOPES.filter((scope) => (!text || scope.startsWith(text)) && !this.inviteScopes.includes(scope));
    },

    saveData() {
      this.saveLoading = true;
      window.localStorage.setItem("botFormDraft", JSON.stringify({
        clientID: this.clientID,
        library: this.library,
        website: this.website,
        prefixes: this.prefixes,
        owners: this.owners,
        categories: this.categories,
        tagline: this.tagline,
        description: this.description,
        invitePermissions: this.invitePermissions,
        inviteCodeGrant: this.inviteCodeGrant,
        inviteScopes: this.inviteScopes,
        inviteRedirectURI: this.inviteRedirectURI
      }));
      this.saveLoading = false;
      // TODO send notification
    },

    submitData() {
      if(this.validateAll()) {
        return;
      }

      if(this.isInvalidAny || this.submitLoading) {
        return;
      }

      this.submitLoading = true;
      let flags = 0;
      if(this.inviteCodeGrant) {
        flags |= 0b1; // Kenobi
      }
      this.$axios.$post("/unverified_bots", {
        id: this.clientID,
        categories: this.categories,
        flags: flags,
        library: this.library,
        owner_ids: this.owners.map((owner) => owner.id),
        permissions: this.invitePermissions,
        prefixes: this.prefixes,
        redirect_uri: this.inviteRedirectURI,
        scopes: this.inviteScopes,
        tagline: this.tagline,
        website: this.website,

        description: this.description // Separate object, but ride-along
      }).then(() => {
        this.submitLoading = false;
        this.submitted = true;

        this.$router.push("/profile");
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
.long-link {
  word-wrap: break-word;
}
</style>
