import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = process.env.NODE_ENV == "production";

import { Button, Input, Loading } from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;

import "element-ui/lib/theme-chalk/index.css";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
