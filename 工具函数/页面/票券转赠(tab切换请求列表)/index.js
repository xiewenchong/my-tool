/**
 * 打包入口文件，基本不动
 */
import page from './page.vue';
import { renderParams } from '@/assets/js/common';

global.vm = new window.Vue({
    template: '',
    render: h => {
        return renderParams(h, page);
    }
}).$mount('#app');
