			window.onload=function(){

				var hotel = document.getElementById("hotel");
				var p = hotel.getElementsByTagName("p")[0];
				var main = document.getElementById("main");
				var light = document.getElementById("light");
				var close = document.getElementById("close");
				p.onclick = function(){
					light.style.display = "block";
					main.style.display = "block";
				}
				close.onclick = function(){
					light.style.display = "none";
					main.style.display = "none";
				}
			}
			
			var myfontSize = 0,
	        winWidth,
	        rem2px,
	        remRad = 7.5;
	   		(function() {
	        function setFontSize() {
	            winWidth = document.documentElement.clientWidth || document.body.clientWidth;
	            if (winWidth > remRad * 100) {
	                winWidth = remRad * 100;
	            }

	            rem2px = function(rem) {
	                return Number((rem + '').replace('rem', '')) * winWidth / remRad;
	            };

	            myfontSize = winWidth / remRad;
	            document.getElementsByTagName('html')[0].style.fontSize = myfontSize + 'px';
	        }
	        setFontSize();
	        window.onresize = function() {
	            setFontSize();
	        };
		    })();