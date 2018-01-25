/* eslint-disable no-new */

import Vue from 'vue';
import App from './app';
import router from './routers';

Vue.config.productionTip = false;
Vue.config.ignoredElements.push('code-view');

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
});
