import Vue from 'vue';
import { EvMenu } from 'evwt';
import App from './App.vue';
import '@/style/style.css';
import '@/icons';
import menu from './menu';

Vue.config.productionTip = false;

Vue.use(EvMenu, menu);

new Vue({
  render: (h) => h(App)
}).$mount('#app');
