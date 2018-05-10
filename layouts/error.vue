<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 v-if="error.statusCode === 404" class="title">Page not found</h1>
        <h1 v-else class="title">An error occurred</h1>
        <router-link to="/" class="button">Home</router-link>
      </div>
    </section>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue"

export default {
  components: {
    Navbar
  },
  props: {
    error: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
</style>
