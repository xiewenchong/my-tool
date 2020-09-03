<!-- 仅当前页面使用的组件 -->
<template>
    <div class="layer" v-show="showLayer">
        <transition name="y-layer__mask">
            <div class="y-layer__mask" v-show="showMask" @click="close"></div>
        </transition>
        <div class="y-layer__panel animate" :class="[{show : animateClass}]" v-show="showPanel">
            <div>222</div>
            <div>444</div>
            <div>333</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'layer',
        props: {},
        data() {
            return {
                showLayer:false,
                showMask:false,
                showPanel:false,
                animateClass:'',
                timer:'',
            };
        },
        methods:{
            open() {
                clearTimeout(this.timer);
                this.showLayer = true;
                this.showPanel = true;
                setTimeout(() => {
					this.animateClass = true;
					this.showMask = true;
				}, 16);
            },
            close() {
                this.showMask = false;
                this.animateClass = false;
                this.timer = setTimeout(() => {
					this.showLayer = false;
                    this.showPanel = false;
                    this.animateClass = '';
				}, 400);
            }
        },
    };
</script>
<style lang="scss" scoped>
	@mixin transform($t) {
		transform: $t;
		-webkit-transform: $t;
	}

	@mixin transition($t) {
		transition: $t;
		-webkit-transition: $t;
	}
    .layer {
        position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 10000;
		touch-action: none;
        -webkit-overflow-scrolling: touch;
        
        .y-layer__mask {
			position: fixed;
		    left: 0;
		    top: 0;
		    width: 100%;
		    height: 100%;
		    background: rgba(0,0,0,.3);
		    opacity: 1;
		    @include transition(all 0.4s);
		    @include transform(translateZ(0));
		    z-index: 100;
        }
        .y-layer__mask-enter {
			opacity: 0;
		}

		.y-layer__mask-leave-to {
			opacity: 0;
		}
        
        .y-layer__panel {
			position: absolute;
			left: 50%;
			top: 50%;
			width: 6.06rem;
			max-height: 90%;
			min-height: 4.8rem;
			background-color: #fff;
			border-radius: 0.16rem;
	    	opacity: 0;
			z-index: 101;
			overflow: auto;
            will-change: transform;

			&.animate {
				@include transform(translate3d(-50%,-50%, 0) scale(0.5));
				@include transition(all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55));
				
				&.show {
					@include transform(translate3d(-50%,-50%,0) scale(1));
		        	opacity: 1;
				}

				&.hide {
					@include transform(translate3d(-50%,-50%,0) scale(0.5));
		        	opacity: 0;
				}
			}
        }
    }
</style>