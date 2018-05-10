export default ({ store, app: { $axios }}) => {
  if(store.state.auth && store.state.auth.token) {
    $axios.setToken(store.state.auth.token);
  }
};
