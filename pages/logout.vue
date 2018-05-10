<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Logging out...
        </h1>
        <a class="button is-loading">Loading</a>
      </div>
    </section>
  </div>
</template>

<script>
import Cookie from "js-cookie";

export default {
  middleware: "authenticated",
  data() {
    return {
      error: ""
    };
  },
  mounted() {
    this.$store.commit("auth/setToken", null);
    this.$store.commit("auth/setUser", null);
    Cookie.remove("dbauth");
    this.$axios.setHeader("Authorization", "");

    this.$router.push("/");
  }
}
</script>

<style>
</style>
