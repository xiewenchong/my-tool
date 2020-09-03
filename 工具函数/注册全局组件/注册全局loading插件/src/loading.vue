<template>
	<transition name="fade">
        <div class="wrapper" v-show="isshow">
            <img src="@/assets/images/loading.png" alt="" width="40" height="40" class="img">
        </div>
    </transition>
</template>

<script>
export default {
  data: function() {
    return {
    	isshow:false,
    };
  }
};
</script>

<style lang="scss" scoped>
img
{
animation:load linear infinite .8s;
-moz-animation:load linear infinite .8s; /* Firefox */
-webkit-animation:load linear infinite .8s; /* Safari and Chrome */
-o-animation:load linear infinite .8s; /* Opera */
}
.wrapper {
	position: fixed;
	top: 50%;
	left: 50%;
	max-width: 80%;
	transform: translate(-50%,-50%);
	padding: 10px;
	box-sizing: border-box;
	font-size: 4vw;
	color: #fff;
	text-align: center;
	background-color: rgba(0, 0, 0, 0.7);
	border-radius: 5px;
	z-index: 999;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease-out;
}
.fade-enter {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
@keyframes load
{
0%   {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
}

@-moz-keyframes load /* Firefox */
{
0%   {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
}

@-webkit-keyframes load /* Safari and Chrome */
{
0%   {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
}

@-o-keyframes load /* Opera */
{
0%   {transform: rotate(0deg);}
100% {transform: rotate(360deg);}
}
</style>