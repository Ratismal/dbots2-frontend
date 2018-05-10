<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-fullhd">
            <router-link to="/categories/moderation">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-2by1">
                    <img src="https://bulma.io/images/placeholders/640x320.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="title is-4">Moderation</p>
                  <div class="content">
                    <p>As your server grows, so does the number of spammers determined to ruin someone's day. But fear not! Here's the place find bots for cleaning chat, blocking raids, and more!</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-fullhd">
            <router-link to="/categories/music">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-2by1">
                    <img src="https://bulma.io/images/placeholders/640x320.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="title is-4">Music</p>
                  <div class="content">
                    <p>Whether it's an intense gaming session or a chaotic karaoke night, music bots have become useful integrations for every Discord voice channel. Discover airhorn soundboards, music video streamers, and more!</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-fullhd">
            <router-link to="/categories/utility">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-2by1">
                    <img src="https://bulma.io/images/placeholders/640x320.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="title is-4">Utility</p>
                  <div class="content">
                    <p>Here's a collection of bots with nifty commands like avatar grabbing, role assignment, voice recording, and more!</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="column is-12-mobile is-6-tablet is-4-desktop is-3-fullhd">
            <router-link to="/categories/gaming">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-2by1">
                    <img src="https://bulma.io/images/placeholders/640x320.png" alt="Placeholder image">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="title is-4">Gaming</p>
                  <div class="content">
                    <p>Search League summoners. View WoW patch notes. Look up osu! scores. Discover a bot that integrates with your favorite games.</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
  },
  head() {
    return {
      title: "Categories | Discord Bots"
    }
  },
  middleware: "betaOnly",
  data() {
    return {
    };
  }
}
</script>

<style>
</style>
