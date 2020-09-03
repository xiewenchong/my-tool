/* eslint-disable */
import $ from '../jquery'

var factory = function() {

	function isValidPhone(val) {
		return /^1\d{10}$/.test(val);
	}

	function isValidCode(val) {
		return /^[0-9]{4}$/.test(val);
	}

	function isValidPwd(val) {
		return val.length >= 6;
	}

	//判断富文本框返回的html字符串是否为空
	function isEmptyHtml(htmlStr) {
		if(!htmlStr) {
			return true;
		}
		var $div = $("<div>" + htmlStr + "</div>");
		$div.find("img").each(function() {
			this.src = "";
		});
		if($div.text().replace(/\r|\n|\s| /g, "") == "" && $div.has("img").length == 0 && $div.has("embed").length == 0) {
			return true;
		}
		return false;
	}

	//验证邮箱
	function isEmail(str) {
		return /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(str);
	}

	//判断是否全为汉字
	function isAllChineseCharacters(str) {
		var reg = /^[\u4E00-\u9FA5]+$/;
		if(!reg.test(str)) {
			return false;
		}
		return true;
	}

	//判断是否符合规范的姓名,字数在2~10个汉字/4~20个英文字母；
	function isOrderlyName(str) {
		if(!/^[a-z\u4E00-\u9FA5]+$/i.test(str)) {
			return false;
		}
		var length = str.replace(/[\u4E00-\u9FFF]/g, "").length + str.replace(/[a-z]/gi, "").length * 2;
		if(length > 20 || length < 4) {
			return false;
		}
		return true;
	}
	//微信帐号
	function isWechatNumber(str) {
		return /^[a-zA-Z\d_]{5,}$/.test(str)
	}

	//验证身份证是否正确，并执行回调函数，只验证码18位的身份证，15位的已经过期了
	function isIdCard(id, callback) {		
		if(typeof id == "undefined" || id == "") {
			toast("请填写身份证号码");
			return false;
		}

		var arrSplit = [],
			reg = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/);
		arrSplit = id.match(reg);
		if(!arrSplit) {
			toast("请填写正确的身份证号码");
			return false;
		}

        //不检验区域码
		if(false && typeof window.iosCountys == "undefined") {
			loadScript(location.protocol + "//" + location.hostname + "/srcv2/js/lib/areaData.js?v=" + window.staticVersion, function() {
				isIdCardCallback();
			});
		} else {
			isIdCardCallback();
		}

		function toast(text, millisecond) {
			if(typeof text == 'object' || typeof text == 'function') {
				text = JSON.stringify(text);
			}
			$(".ycf-toast").remove();
			$toast = $('<div class="ycf-toast">' + text + '</div>');

			$("body").append($toast);
			var oneRowHeight = $toast.height(),
				oneMultRowHeight = $toast.addClass('mult-row').height();
			if(oneRowHeight == oneMultRowHeight) {
				$toast.removeClass('mult-row');
			}
			clearTimeout(toast.timer);
			if(!millisecond) {
				millisecond = 3000;
			}
			toast.timer = setTimeout(function() {
				$(".ycf-toast").remove();
			}, millisecond);
		}

		function loadScript(url, callback) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			if(typeof(callback) != "undefined") {
				if(script.readyState) {
					script.onreadystatechange = function(e) {
						if(script.readyState == "loaded" || script.readyState == "complete") {
							script.onreadystatechange = null;
							callback(e);
						}
					};
				} else {
					script.onload = function(e) {
						callback(e);
					};
				}
			}
			script.src = url;
			script.async = true;
			script.charset = "utf-8";
			document.head.appendChild(script);
		}

		function isIdCardCallback() {
			//检查区域码是否正确
			/*if ($.inArray(arrSplit[1], iosCountys.map(function(item) {
			                    return item.id;
			                })) == -1) {
			                toast("身份证区域码错误");
			                return false;
			}*/

			//检查生日日期是否正确 
			var birth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			if(!(birth.getFullYear() == arrSplit[2] && (birth.getMonth() + 1) == arrSplit[3] && birth.getDate() == arrSplit[4])) {
				//toast("身份证号码出生日期错误");
				toast("请填写正确的身份证号码");
				return false;
			} else {
				//检验18位身份证的校验码是否正确。 
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10 
				var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //系数
				var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; //校验码对照表
				var sum = 0;
				for(var i = 0; i < 17; i++) {
					sum += +id[i] * arrInt[i];
				}
				if(arrCh[sum % 11].toLocaleLowerCase() != id[17].toLocaleLowerCase()) {
					//toast("身份证号码最后一位校验码错误");
					toast("请填写正确的身份证号码");
					return false;
				}
				callback();
			}
		}
	}

	/*简单校验各类证件*/

	function isID(value) { // 旅客身份证号
		var length = value.length;

		if(!value) {
			return "请填写身份证号";
		} else if(!/^[0-9xX]+$/.test(value)) {
			return "身份证号格式有误";
		} else if(length != 18) {
			return "身份证号格式有误";
		}
		return "";
	}

	function isOfficers(value) { // 军官证
		var length = value.length;
		if(!value) {
			return '请填写军官证';
		} else if(!/^[0-9a-zA-Z]+$/.test(value)) {
			return "军官证格式有误";
		} else if(length < 4) {
			return "军官证格式有误";
		} else if(length > 20) {
			return "军官证格式有误";
		}
		return "";
	}

	function isHKMPass(value) { // 旅客港澳通行证
		var length = value.length;

		if(!value) {
			return "请填写港澳通行证";
		} else if(!/^[0-9a-zA-Z]+$/.test(value)) {
			return "港澳通行证格式有误";
		} else if(length < 9) {
			return "港澳通行证格式有误";
		} else if(length > 11) {
			return "港澳通行证格式有误";
		}
		return "";
	}

	function isTWPass(value) { // 旅客台湾通行证
		var length = value.length;
		if(!value) {
			return "请填写赴台通行证";
		} else if(!/^[0-9a-zA-Z]+$/.test(value)) {
			return "赴台通行证格式有误";
		} else if(length < 9) {
			return "赴台通行证格式有误";
		} else if(length > 11) {
			return "赴台通行证格式有误";
		}
		return "";
	}

	function isMTP(value) { // 旅客台胞证号
		var length = value.length;

		if(!value) {
			return "请填写台胞证号";
		} else if(!/^[0-9a-zA-Z]+$/.test(value)) {
			return "台胞证号格式有误";
		} else if(length < 9) {
			return "台胞证号格式有误";
		} else if(length > 11) {
			return "台胞证号格式有误";
		}
		return "";
	}

	function isPassPort(value) { // 旅客护照号
		var length = value.length;

		if(!value) {
			return "请填写护照号";
		} else if(!/^[0-9a-zA-Z]+$/.test(value)) {
			return "护照号格式有误";
		} else if(length < 8) {
			return "护照号格式有误";
		} else if(length > 9) {
			return "护照号格式有误";
		}
		return "";
	}

	function isNumber(val) {
		return /^[0-9]{1,}$/.test(val);
	}

	return {
		isValidPwd: isValidPwd,
		isValidPhone: isValidPhone,
		isValidCode: isValidCode,
		isEmptyHtml: isEmptyHtml,
		isEmail: isEmail,
		isAllChineseCharacters: isAllChineseCharacters,
		isWechatNumber:isWechatNumber,
		isOrderlyName: isOrderlyName,
		isIdCard: isIdCard,
		isID: isID,
		isHKMPass: isHKMPass,
		isTWPass: isTWPass,
		isMTP: isMTP,
		isPassPort: isPassPort,
		isOfficers: isOfficers,
		isNumber: isNumber,
	}
};

export default factory()