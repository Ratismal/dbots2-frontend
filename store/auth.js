const cookieparser = require("cookieparser");

export const state = () => ({
  token: null,
  user: null
});

export const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  async nuxtServerInit({ commit }, { app, req }) {
    let token = null;
    if(req.headers.cookie) {
      try {
        let parsed = cookieparser.parse(req.headers.cookie);
        token = parsed.dbauth;

        const user = await app.$axios.$get("/users/@me", {
          headers: {
            Authorization: token
          }
        });

        commit("setUser", user);
        app.$axios.setToken(token);
      } catch(err) {
        token = null;
      }
    }

    commit("setToken", token);
  }
};
