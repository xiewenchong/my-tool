
			phone: function(val) {
				if(val.length == 11) {
					return val.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
				} else {
					return val;
				}
			}