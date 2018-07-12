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
export default {
  layout: "default",
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
