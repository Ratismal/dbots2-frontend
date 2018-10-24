import Vue from "vue";

Vue.directive("lazy-src", {
  bind(el, binding, vnode) {
    if (el._lazyload) el._lazyload = null;
    let img = el._lazyload = new Image();
    let originalSource = el.src;
    let errorSource = binding.value;
    let loadingSource = el.src = binding.value;

    img.onerror = () => {
      el.src = errorSource;
    };
    img.onload = () => {
      el.src = originalSource;
    };
    img.src = originalSource;
  },
  update() {console.log("update"), this},
  unbind() {console.log("unbind"), this},
  componentUpdated() {console.log("componentUpdated"), this},
  inserted() {console.log("inserted"), this},
});
