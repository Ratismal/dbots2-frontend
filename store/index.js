export const state = () => ({
});

export const mutations = {
};

export const actions = {
  nuxtServerInit({ dispatch }, ctx) {
    return Promise.all([
      dispatch("auth/nuxtServerInit", ctx)
    ]);
  }
};
