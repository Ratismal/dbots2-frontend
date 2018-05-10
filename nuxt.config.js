module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: "Discord Bots",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "reeee" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  },
  modules: [
    ["nuxt-buefy", {
      materialDesignIcons: false
    }],
    ["@nuxtjs/axios", {
      prefix: "/api/v1",
      proxy: true,
      retry: {
        retryDelay: () => 500 + ~~(Math.random() * 500)
      }
    }]
  ],
  plugins: [
    "~/plugins/auth"
  ],
  proxy: {
    "/api/": process.env.DBOTS2_API_ORIGIN || "https://bots-beta.discord.pw"
  }
}
