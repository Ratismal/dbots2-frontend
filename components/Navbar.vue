<template>
  <nav class="navbar is-primary" role="navigation" aria-label="dropdown navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item is-size-5" to="/">
        <b>Discord Bots</b>
      </router-link>
      <a :class="['navbar-burger', {'is-active': navbarActive}]" href="#" role="button" aria-label="menu" aria-expanded="false" @click.prevent="navbarActive = !navbarActive">
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
        <span aria-hidden="true"/>
      </a>
    </div>
    <div :class="['navbar-menu', {'is-active': navbarActive}]">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link class="navbar-link" to="/bots">
            Discover
          </router-link>

          <div class="navbar-dropdown">
            <router-link class="navbar-item" to="/categories">
              Categories
            </router-link>
            <router-link class="navbar-item" to="/bots">
              Search
            </router-link>
          </div>
        </div>
        <router-link class="navbar-item" to="/addbot">
          Add Bot
        </router-link>
        <!-- TODO generate -->
        <!-- <a class="navbar-item" disabled>
          Discord Server
        </a> -->
      </div>

      <div class="navbar-end">
        <div v-if="user" class="navbar-item">
          <div class="navbar-item has-dropdown is-hoverable">
            <router-link class="navbar-link button is-primary" to="/profile">
              <span class="icon">
                <discord-icon :object-id="user.id" :hash="user.avatar" size="64" type="avatar" />
              </span>
              <span>{{ user.username }}#{{ ("000" + user.discriminator).substring(user.discriminator.toString().length - 1) }}</span>
            </router-link>

            <div class="navbar-dropdown">
              <router-link class="navbar-item" to="/profile">Profile</router-link>
              <b-switch v-model="lightTheme" class="navbar-item" @click.native="setLightTheme">Light Theme</b-switch>
              <router-link class="navbar-item" to="/logout">Logout</router-link>
            </div>
          </div>
        </div>
        <router-link v-else class="navbar-item" to="/login">
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import DiscordIcon from "~/components/DiscordIcon.vue";

export default {
  components: {
    DiscordIcon
  },
  data() {
    return {
      navbarActive: false,
      lightTheme: this.$store.state.userOptions.lightTheme
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    }
  },
  watch: {
    $route() {
      this.navbarActive = false;
    }
  },
  methods: {
    setLightTheme() {
      this.lightTheme = !this.lightTheme;

      if (this.lightTheme) this.$store.commit("userOptions/enableLightTheme");
      else this.$store.commit("userOptions/disableLightTheme");
    }
  }
}
</script>

<style>
.navbar-burger {
  color: white;
}
.navbar-end .icon img {
  margin-right: .5em;
}
.switch.navbar-item {
  width: 100%;
}
</style>
