/**
	
 	局部滚动，需设置固定height 
	v-loadmore="方法名"
**/
export default {
	inserted(el,binding) {
		el.addEventListener("scroll", ()=>{
			const containerHeight = el.clientHeight;
			const scrollTop = el.scrollTop;
			const contentHeight = el.scrollHeight;
			if(scrollTop + containerHeight >= contentHeight) {
				binding.value();
			}
		})
	}
}