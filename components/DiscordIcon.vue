<template>
  <img :class="{'is-rounded': !square}" :src="avatarURL">
</template>

<script>
export default {
  props: {
    format: {
      type: String,
      default: "jpg"
    },
    hash: {
      type: String,
      default: ""
    },
    objectId: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "128"
    },
    square: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    avatarURL() {
      if(!this.hash) {
        return "";
      }
      return `https://images.discordapp.net/${this.type}s/${this.objectId}/${this.hash}.${this.format}?size=${this.size}`;
    }
  }
}
</script>

<style>
img.is-rounded {
  border-radius: 50%;
}
</style>
