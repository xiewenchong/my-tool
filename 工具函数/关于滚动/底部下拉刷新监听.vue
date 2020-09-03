<!-- 滚动加载 
父组件调用方法：直接调用即可，这里的reachBbottom只是父组件的监听方法，用于调用请求数据；
而target 指的是滚动加载的目标DOM  如scrollTarget: '.card-box'    一般把整个列表的节点传过去
<scrolls :target="scrollTarget" @reachBbottom="reachBbottom" ref="scrolls"></scrolls>
-->

<template>
	<div class="scroll"></div>
</template>

<script>
	export default {
		name: 'scroll',
		props: ['target'],
		data() {
			return {
				scrollTimeout: [],
			};
		},
		watch: {
		},
		mounted() {
			this.bind();
		},
		methods: {
			bind() {
				let { target } = this;

				target = target ? document.querySelectorAll(target) : document;

				for (let i = 0; i < target.length; i++) {
					target[i].addEventListener('scroll', (e) => {
						clearTimeout(this.scrollTimeout[i]);
	                	this.scrollTimeout[i] = setTimeout(() => {
							let childTarget = e.target,
								{ scrollHeight, clientHeight, scrollTop } = childTarget;

							if (scrollTop >= scrollHeight - clientHeight - 50) {
		                        // this.$emit('reachBbottom', i);   //其实这里就是如果判断是底部了，那就调用父组件的方法加载数据
		                    }
		                }, 50);
					});
				}
			},

			isBottom(i) {
				let { target } = this;

				target = target ? document.querySelectorAll(target) : document;

				let { scrollHeight, clientHeight, scrollTop } = target[i];

				if (scrollTop >= scrollHeight - clientHeight) {
                    this.$emit('reachBbottom', i);
                }
			}
		}
	};
</script>