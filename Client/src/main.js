import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";

import routes from "./routes";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const router = new VueRouter({
  routes
});

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {BootstrapVue} from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(Vuelidate);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

axios.defaults.withCredentials=true;
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  // username: localStorage.username,
  username: undefined,
  isAdmin:undefined,
  lastSearch:undefined,
  login(username,isAdmin) {
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin",isAdmin);
    this.username = username;
    this.isAdmin=isAdmin;
    console.log("login", this.username);
  },
  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("lastSearch");
    this.username = undefined;
    this.isAdmin=undefined;
    this.lastSearch=undefined;
  },
  saveLastSearch(querySearch){
    localStorage.setItem("lastSearch",querySearch);
    this.lastSearch=querySearch;
  }
};
console.log(shared_data);
// Vue.prototype.$root.store = shared_data;

new Vue({
  router,
  data() {
    return {
      store: shared_data
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000
      });
    }
  },
  render: (h) => h(App)
}).$mount("#app");
