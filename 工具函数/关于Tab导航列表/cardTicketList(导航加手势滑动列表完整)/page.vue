<!-- 页面html代码 -->
<template lang="html">
    <div class="cardTicketList-page" v-cloak>
        <tabs @tabIndex="tabIndex" :isPopularizer="isPopularizer"></tabs>
    	<list :tabIndex="tabI"></list>
    </div>
</template>
<!-- 以下基本不变 -->
<script>
    import conf from './page.js';
    export default conf;
</script>
<style scoped lang="scss">
    @import "./page.scss";
</style>