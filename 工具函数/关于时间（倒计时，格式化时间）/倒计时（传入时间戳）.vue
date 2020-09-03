<template>
  <div class="countdown">
    <slot name="prefix"></slot>
    <span class="hour number">{{hour|timeFormat}}</span>
    <span>:</span>
    <span class="minute number">{{minute|timeFormat}}</span>
    <span>:</span>
    <span class="second number">{{second|timeFormat}}</span>
    <slot name="suffix"></slot>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      timer: "",
      current: "",
      endStamp: 0
    };
  },
  props: {
    end: {
      type: [String, Number],
      default: "2019-01-05 18:00:00"
    }
  },
  filters: {
    timeFormat: function(val) {
      return val >= 10 ? val : "0" + val;
    }
  },
  watch: {
    end(v) {
      this.endStamp = typeof v == Number ? v : new Date(v).getTime();
      clearInterval(this.timer);
      this.timer = setInterval(this.update.bind(this), 100);
    }
  },
  mounted() {
    this.timer = setInterval(this.update.bind(this), 100);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    update: function() {
      this.current = Date.now();
      let diff = this.endStamp - this.current;
      if (diff <= 0) {
        clearTimeout(this.timer);
        this.second = (0).toFixed(1);
        this.emitOver();
        return;
      }
      const msPerHour = 1000 * 60 * 60;
      //   const minute
      let hour = diff / msPerHour;
      let minute = (diff % msPerHour) / 60000;
      let second = (diff % 60000) / 1000;
      this.hour = parseInt(hour);
      this.minute = parseInt(minute);
      this.second = second.toFixed(1);
    },
    emitOver(){
      if(this.end == 0) return;
      this.$emit("over");
    }
  }
};
</script>

<style lang="scss">
  .countdown {
    font-size: 26px;
    font-weight: 500;
    color: #fff;
    // line-height: 48px;

    .number {
      // font-size: 26px;
      background-color: #E97A30;
      display: inline-block;
      border-radius:3px;
      // width: 44px;
      padding: 0 7px;
      text-align: center;
      line-height: 44px;
      height: 44px;
      margin-left: 10px;
      margin-right: 10px;
      &.hour{
        margin-left: 0;
      }
      &.second {
        margin-right: 0;
      }
    }
  }
</style>
