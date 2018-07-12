<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          Add a Bot
        </h1>
        <bot-form :edit="false"/>
      </div>
    </section>
  </div>
</template>

<script>
import BotForm from "~/components/BotForm.vue";

export default {
  components: {
    BotForm
  },
  middleware: ["authenticated", "betaOnly"]
}
</script>

<style>

</style>
