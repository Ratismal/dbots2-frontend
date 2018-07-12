export const state = () => ({
  lightTheme: false
});

export const mutations = {
  enableLightTheme(state) {
    state.lightTheme = true;
  },
  disableLightTheme(state) {
    state.lightTheme = false;
  }
};
