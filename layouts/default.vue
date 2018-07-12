<template>
  <div>
    <Navbar />
    <nuxt />
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      lightTheme: false
    };
  },
  head() {
    return {
      htmlAttrs: {
        class: this.lightTheme ? "" : "dark"
      }
    }
  },
  mounted() {
    // A really bad hack that is unfortunately required (at least for the moment).
    /* vue-meta (which is what nuxt uses for the `head` property) delays the DOM upate by `requestAnimationFrame` and for some reason that causes some fuckery which results in the class for
       the `html` tag to not update properly when Vuex gets restored from localStorage (if the user has dark theme enabled). */
    // See: https://github.com/declandewet/vue-meta/issues/224
    // It also means we gotta subscribe to Vuex updates since we cant use a computed property.

    requestAnimationFrame(() => {
      this.lightTheme = this.$store.state.userOptions.lightTheme;

      this.$store.subscribe((mut, state) => {
        this.lightTheme = state.userOptions.lightTheme;
      });
    });
  }
}
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
