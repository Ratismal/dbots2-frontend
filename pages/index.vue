<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title">
                Discord Bots
              </h1>
              <h2 class="subtitle">
                The <b>premier</b> Discord bot list.
              </h2>
              <bot-list-search-bar path="/bots"/>
            </div>
            <div class="column is-hidden-mobile">
              <div class="level">
                <div class="level-item">
                  <div>
                    <discord-icon object-id="150061853001777154" hash="ad258d7137464ec63e32fedd003dac3a" size="128" type="avatar" />
                    <p>Insert category icon</p>
                  </div>
                </div>
                <div class="level-item">
                  <div>
                    <discord-icon object-id="150061853001777154" hash="ad258d7137464ec63e32fedd003dac3a" size="128" type="avatar" />
                    <p>Insert category icon</p>
                  </div>
                </div>
                <div class="level-item">
                  <div>
                    <discord-icon object-id="150061853001777154" hash="ad258d7137464ec63e32fedd003dac3a" size="128" type="avatar" />
                    <p>Insert category icon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="tile is-ancestor is-vertical">
        <div class="tile is-12">
          <div v-if="featuredBot0" class="tile is-parent is-4">
            <article class="tile is-child box notification is-primary featured">
              <div class="media">
                <div class="media-content">
                  <p class="title">{{ featuredBot0.name }}</p>
                  <p class="subtitle">Featured Bot</p>
                  <router-link :to="`/bots/${featuredBot0.id}/invite`" class="button is-light is-outlined">Invite</router-link>
                </div>
                <div class="media-right">
                  <figure class="image is-128x128">
                    <discord-icon :object-id="featuredBot0.id" :hash="featuredBot0.icon" size="256" type="app-icon" />
                  </figure>
                </div>
              </div>
              <hr>
              <div class="content">
                <p class="has-text-centered"><i>Easter bows.</i></p>
                <p class="has-text-left"><b>Floppy sombreros.</b></p>
                <p class="has-text-right"><b><u>Santa hats.</u></b></p>
                <p class="is-size-4 has-text-justified"><b>We're the neighborhood hat shop. You name it, we got it.</b></p>
                <p class="has-text-justified">With over 0 years of experience, HatBot has dedicated its life to providing hats for all Discord users in need. Join 50,000+ users on the daring quest to find the <i>perfect</i> hat.</p>
              </div>
            </article>
          </div>
          <div class="tile is-vertical">
            <div class="tile is-parent">
              <article class="tile is-child box notification is-info">
                <p class="title">Find the perfect music bot</p>
                <div class="columns">
                  <div v-for="bot in category0Bots" :key="bot.id" class="column">
                    <bot-list-item :bot="bot" />
                  </div>
                </div>
              </article>
            </div>
            <div class="tile is-parent">
              <article class="tile is-child box">
                <p class="title">Fresh Bots</p>
                <div class="columns">
                  <div v-for="bot in newestBots" :key="bot.id" class="column">
                    <bot-list-item :bot="bot" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div class="tile">
          <div class="tile">
            <div class="tile is-parent">
              <article class="tile is-child box">
                <p class="title">Great moderation bots</p>
                <div class="columns">
                  <div v-for="bot in category1Bots" :key="bot.id" class="column">
                    <bot-list-item :bot="bot" />
                  </div>
                </div>
              </article>
            </div>
            <div class="tile is-parent is-4">
              <article class="tile is-child box">
                <p class="title">The best anime bots</p>
                <div class="columns">
                  <div v-for="bot in category2Bots" :key="bot.id" class="column">
                    <bot-list-item :bot="bot" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BotListItem from "~/components/BotListItem.vue"
import BotListSearchBar from "~/components/BotListSearchBar.vue"
import DiscordIcon from "~/components/DiscordIcon.vue"

export default {
  components: {
    BotListItem,
    BotListSearchBar,
    DiscordIcon
  },
  middleware: "betaOnly",
  data() {
    return {
      category0Bots: [],
      category1Bots: [],
      category2Bots: [],
      newestBots: [],
      featuredBot0: null,
      featuredBot1: null
    };
  },
  asyncData(ctx) {
    return Promise.all([
      ctx.$axios.$get("/bots", {
        params: {
          category: "music",
          limit: 2,
          sort: "random"
        }
      }),
      ctx.$axios.$get("/bots", {
        params: {
          category: "moderation",
          limit: 2,
          sort: "random"
        }
      }),
      ctx.$axios.$get("/bots", {
        params: {
          category: "anime",
          limit: 1,
          sort: "random"
        }
      }),
      ctx.$axios.$get("/bots", {
        params: {
          limit: 2,
          sort: "+date"
        }
      }),
      ctx.$axios.$get("/bots", {
        params: {
          featured: true,
          limit: 2,
          sort: "random"
        }
      })
    ]).then((res) => {
      return {
        category0Bots: res[0],
        category1Bots: res[1],
        category2Bots: res[2],
        newestBots: res[3],
        featuredBot0: res[4][0],
        featuredBot1: res[4][1] || res[4][0]
      };
    }).catch((err) => {
      if(err && err.response && err.response.status) {
        return ctx.error({
          statusCode: err.response.status,
          message: err.response.data && err.response.data.message || err.message || "Internal error"
        });
      }
      return ctx.error({
        statusCode: 500,
        message: err.message || "Internal error"
      });
    });
  }
}
</script>

<style>
</style>
