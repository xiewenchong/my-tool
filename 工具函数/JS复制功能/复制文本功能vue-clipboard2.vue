
<template>
	<div class="container">
		<div v-model="message"
		v-clipboard:copy="message"
		v-clipboard:success="onCopy"
		v-clipboard:error="onError">{{message}}</div>
	</div>
</template>
<script>
export default {
	data(){
		return {
			message: '复制的内容23333'
		}
	},
	props: {
		
	},
	watch: {
		
	},
	methods:{
		onCopy: function (e) {
			alert('You just copied: ' + e.text)
		},
		onError: function (e) {
			alert('请手动选择复制')
		}
		
	},
	filters: {
		
	},
	mounted(){
	}
}
</script>
<style>
*{
  padding: 0;
  margin: 0;
  font-size: .16rem;
}
</style>
