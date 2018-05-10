<template>
  <div>
    <section class="section">
      <div v-if="error" class="container">
        <h1 class="title">
          Error logging in
        </h1>
        <a href="#" class="button is-danger" @click.prevent="redirectLogin">Retry?</a>
      </div>
      <div v-else class="container">
        <h1 class="title">
          Logging in with Discord...
        </h1>
        <a class="button is-loading">Loading</a>
      </div>
    </section>
  </div>
</template>

<script>
import Cookie from "js-cookie";

export default {
  data() {
    return {
      error: ""
    };
  },
  mounted() {
    if(!this.$route.query.code) {
      if(this.$store.state.auth.user) {
        this.$router.replace("/");
      } else {
        this.redirectLogin();
      }
      return;
    }

    this.postLogin().catch((err) => {
      console.log(err);
      this.error = "Error logging in";
    });
  },
  methods: {
    async postLogin() {
      const { token } = await this.$axios.$post("/login", {
        code: this.$route.query.code,
        redirect_uri: window.location.origin + window.location.pathname
      });
      const user = await this.$axios.$get("/users/@me", {
        headers: {
          Authorization: token
        }
      });

      this.$store.commit("auth/setToken", token);
      this.$store.commit("auth/setUser", user);
      Cookie.set("dbauth", token);
      this.$axios.setHeader("Authorization", token);

      this.$router.push("/");
    },
    redirectLogin() {
      window.location.href = "https://discordapp.com/oauth2/authorize"
        + "?client_id=152988350679220225"
        + "&scope=identify"
        + "&response_type=code"
        + "&redirect_uri=" + encodeURIComponent(window.location.origin + window.location.pathname);
    }
  }
}
</script>

<style>
</style>
