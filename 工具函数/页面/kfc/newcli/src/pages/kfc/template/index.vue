<template>
  <!-- <keep-alive :include="kpAlive"> -->
    <router-view/>
<!-- </keep-alive> -->
</template>

<script>

export default {
  name: "index",
  components: {
  },
  computed: {
    kpAlive() {
        return this.$store.getters.kpAliveRouter;
    }
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {},
};
</script>

<style lang="scss" src="./index.scss"></style>
