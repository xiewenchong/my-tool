<template lang="html">
<div class="red-envelopes" :class="{open: redEnvelopes}" @click="userRedEnvelopes">
    <div class="switch-box">
        <div class="circle"></div>
        <div class="bar"></div>
    </div>
</div>
</template>
<script>
    export default {
        name: 'demo',
        props: {},
        data() {
            return {
                redEnvelopes: false,
            };
        },
        methods: {
            userRedEnvelopes() {
                this.redEnvelopes = !this.redEnvelopes;
            },
        }
    };
</script>
<style lang="scss" scoped>
.red-envelopes {
    &.open {
        .switch-box {
            .bar:after {
                left: 0;
            }

            .circle {
                left: 34px;
            }
        }
    }
    .switch-box {
        position: relative;
        width: 72px;
        height: 40px;
        margin: 30px 0 0 28px;
        float: right;

        .bar {
            position: relative;
            width: 72px;
            height: 40px;
            border-radius: 20px;
            overflow: hidden;
        }

        .bar:before {
            content: '';
            width: 72px;
            height: 40px;
            position: absolute;
            left: 0;
            top: 0;
            background: linear-gradient(-117deg,rgba(218,218,218,1),rgba(195,195,195,1));
            border-radius: 20px;
            overflow: hidden;
            z-index: 1;
        }

        .bar:after {
            content: '';
            display: inline-block;
            width: 72px;
            height: 40px;
            position: absolute;
            left: -80px;
            top: 0;
            background: #FF7124;
            border-radius: 20px;
            transition: all 0.3s;
            z-index: 2;
        }

        .circle {
            display: block;
            width: 36px;
            height: 36px;
            position: absolute;
            left: 2px;
            top: 2px;
            background:rgba(255,255,255,1);
            box-shadow:0px 9px 12px 0px rgba(0, 0, 0, 0.13);
            border-radius: 50%;
            transition: all 0.3s;
            z-index: 3;
        }
    }
}
</style>