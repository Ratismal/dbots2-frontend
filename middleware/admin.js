export default function ({ store, redirect }) {
  if(!store.state.auth.user) {
    return redirect("/login");
  }
  if(!(store.state.auth.user.flags & 0b100000)) {
    return redirect("/forbidden");
  }
}
