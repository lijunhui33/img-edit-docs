import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
// i-view
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

new Vue({
  render: h => h(App),
}).$mount('#app');
