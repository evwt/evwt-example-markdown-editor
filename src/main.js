import Vue from 'vue';
import { EvMenu, EvStore } from 'evwt';
import App from './App.vue';
import '@/style/style.css';
import '@/icons';
import menu from './menu';

Vue.config.productionTip = false;

Vue.use(EvMenu, menu);
Vue.use(EvStore);

// Setting window.$app here so it can be accessed during tests
window.$app = new Vue({
  render: (h) => h(App)
}).$mount('#app');

// EVWT Test Suite - Not needed for normal apps
window.$app.$evmenu.$on('input', item => {
  window.evwtTestEvMenuEvent1 = JSON.stringify(item);
});

window.$app.$evmenu.$on('input:show-preview', item => {
  window.evwtTestEvMenuEvent2 = JSON.stringify(item);
});
