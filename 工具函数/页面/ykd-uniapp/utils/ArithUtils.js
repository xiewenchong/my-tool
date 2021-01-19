/**
 * TanLingHui
 * 浮点转整形的工具库
 * @type {{priceToFen: module.exports.priceToFen, fenToPriceStr: module.exports.fenToPriceStr, priceToStr: module.exports.priceToStr}}
 */
module.exports = {

    /*自己写一个js函数，将float类型数据装换成string的类型然后截取你省略的那位的后一位和5比较。
     将结果加上你使用toFixed的值就好了*/
    roundEx:function (price) {

        return price.toFixed(2);

        /*
        var scale = 2;

        var priceStr = price.toString();
        var dotIdx = priceStr.indexOf(".");
        if( dotIdx<0 ){
            return price;
        }
        var subBegin = dotIdx+1;
        if( subBegin>=priceStr.length){
            return price;
        }
        var subStr = priceStr.substring(subBegin,priceStr.length);
        if( subStr.length<=scale){
            return price;
        }
        var bitToCut = new Number(subStr.substring(scale,scale+1));
        var finalPrice = price.toFixed(scale);
        if( bitToCut>=5){
            finalPrice+=0.01;
        }
        return finalPrice;
        */
    },

	priceToFen:function(price){
        if(price<0.0){
            //throw new IllegalStateException("price<0.0f");
            return -1;
        }
        if(price===0.0){
            return 0;
        }

        
        var rawStr = price.toString();
        //if( rawStr.contains("E")||rawStr.contains("e")){
        //    return 0;
        //}
        
        

        var pIdx = rawStr.indexOf(".");
        if(pIdx===-1){//没有小数点，是个整数？？
            return 100 * parseInt(rawStr);
        }

        var bitCountAfterPoint = rawStr.length-(pIdx+1);
        if( bitCountAfterPoint>2){
            //throw new IllegalStateException("fuck1");
            //return -2;
        }

        var result=0;
        if( pIdx>0){
	        var yuanStr = rawStr.substring(0,pIdx);
	       	result +=  parseInt(yuanStr)*100;
    	}

        if( bitCountAfterPoint>0){
            var jiaoStr = rawStr.substring(pIdx+1,pIdx+2);
            result += parseInt(jiaoStr)*10;
        }

        if( bitCountAfterPoint>1 ){
            var fenStr = rawStr.substring(pIdx+2,pIdx+3);
            result +=  parseInt(fenStr);
        }

        return result;
    },


    fenToPriceStr:function(rawFen){
        //Log.w("","rawFen:"+rawFen);
        if( rawFen<0){
            return "价格小于0";//throw new IllegalStateException("rawFen<0");
        }
        if( rawFen===0){
            return "0";
        }

        var yuan = /*new Number*/parseInt(rawFen/100);
        var jiao = /*new Number*/parseInt((rawFen - yuan*100)/10);
        var fen  = /*new Number*/(rawFen - yuan*100 - jiao*10);
        //console.log("yuan:"+yuan+",jiao:"+jiao+",fen:"+fen);
        var sb = "";
        sb += (new Number(yuan).toString());
        if( jiao>0||fen>0){
            sb +=".";
            sb += jiao;//(new Number(jiao).toString());
            if(fen>0){
                sb += fen;//(new Number(jiao).toString()) + ( new Number(fen).toString());
            }
        }
        return sb;
    },

    priceToStr:function(price){
        return this.fenToPriceStr(this.priceToFen(price));
    }


}
