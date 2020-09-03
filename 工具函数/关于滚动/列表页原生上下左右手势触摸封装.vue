
// 调用组件：<gesture :target="touchTarget" @goDirection="goDirection"></gesture>
// //包含上下左右滑动判断
// touchTarget: '.card-boxs',  //一般是放列表的那个ul
// goDirection    //滑动之后的回调函数
<template>
	<div class="gesture"></div>
</template>

<script>
	export default {
		name: 'gesture',
		props: ['target'],
		data() {
			return {
				startPoint: [],
				endPoint: [],
				startTime: 0,
				endTime: 0,
			};
		},
		mounted() {
			this.bind();
		},
		methods: {
			bind() {
				let { target } = this;

				target = target ? document.querySelector(target) : document;

				target.addEventListener('touchstart', (e) => {
					let touch = {};

					// 只允许一点触碰
					if(e.targetTouches.length > 1) {
						return false;
					}

					touch = e.targetTouches[0];
					this.startPoint = [touch.clientX, touch.clientY];
					this.startTime = new Date().getTime();
				});

				target.addEventListener('touchend', (e) => {
					let touch = e.changedTouches[0];
					this.endPoint = [touch.clientX, touch.clientY];
					this.endTime = new Date().getTime();
					this.handlePoint();
				});
			},

			handlePoint() {
				let { startPoint, endPoint, startTime, endTime } = this,
					interval = endTime - startTime,
					minusX = startPoint[0] - endPoint[0],
					minusY = startPoint[1] - endPoint[1],
					angle = Math.atan(minusY / minusX) * 180 / Math.PI;

				if (interval > 300) {
					return false;
				}

				if (angle <= 20 && angle >= -20 && Math.abs(minusX) > 50) {
					// 向左
					if (minusX < 0) {
						this.$emit('goDirection', 'left');
					}

	 				// 向右
					if (minusX >= 0) {
						this.$emit('goDirection', 'right');
					} 
				}

				if (((angle >= 70 && angle <= 90) || (angle >= -90 && angle <= -70)) && Math.abs(minusY) > 50) {
					// 向上
					if (minusY < 0) {
						this.$emit('goDirection', 'top');
					}

	 				// 向下
					if (minusY >= 0) {
						this.$emit('goDirection', 'bottom');
					} 
				}

			},
		}
	};
</script>