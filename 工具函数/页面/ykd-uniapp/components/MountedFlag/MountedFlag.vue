<template name="MountedFlag">
	<view style="width:100%;height:1px;"/>
</template>

<script>
	export default {
		name:"MountedFlag",
		props:{
			flagId:String
		},
		data() {
			return {
				
			};
		},
		mounted:function(){
			this.$emit("onMounted",this.flagId)
		}
	}
</script>

<style>
	
</style>
