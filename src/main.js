import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueFlags from "@growthbunker/vueflags";

Vue.use(VueFlags, {
  iconPath: "/icons/country/",
});

Vue.config.productionTip = false;

import axios from "axios";

axios.defaults.baseURL = "/";

Vue.prototype.$ajax = axios;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
