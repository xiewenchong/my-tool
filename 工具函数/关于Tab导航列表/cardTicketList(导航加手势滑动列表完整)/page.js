// 页面JS逻辑文件
import tabs from './components/tab.vue';
import list from './components/list.vue';

let page = {
    name: 'page',
    data() {
        return {
            tabI: 0,
            isPopularizer: false, //是否推广员
        };
    },
    components: {
        tabs,
        list
    },
    methods: {
        // 顶部tab点击索引
        tabIndex(i) {
            this.tabI = i;
        },
    },
    mounted() {},
    created() {
        window.databus.verifyIfPopularizer().done(() => {
            // 是推广员
            this.isPopularizer = true;
            // app下并且是游客身份表示为未登录
            if (this.isInApp && this.isTourist) {
                this.isPopularizer = false;
            }
        }).fail(() => {});
    },
};

export default page;