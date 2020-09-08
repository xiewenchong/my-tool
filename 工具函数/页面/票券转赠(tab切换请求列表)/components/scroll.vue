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
		                        this.$emit('reachBbottom', i);
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