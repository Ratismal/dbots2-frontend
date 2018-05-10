export default function ({ store, redirect }) {
  if(!store.state.auth.user) {
    return redirect("/login");
  }
  if(!(store.state.auth.user.flags & 0b10000)) {
    return redirect("/forbidden");
  }
}
