// typeof操作符可以准确判断一个变量是否为下面几个原始类型：
typeof 'ConardLi'  // string
typeof 123  // number
typeof true  // boolean
typeof Symbol()  // symbol
typeof undefined  // undefined
// 复制代码你还可以用它来判断函数类型：
typeof function(){}  // function
// 复制代码不适用场景
// 当你用typeof来判断引用类型时似乎显得有些乏力了：
typeof [] // object
typeof {} // object
typeof new Date() // object
typeof /^\d*$/; // object
// 复制代码除函数外所有的引用类型都会被判定为object。
// 另外typeof null === 'object'也会让人感到头痛，这是在JavaScript初版就流传下来的bug，后面由于修改会造成大量的兼容问题就一直没有被修复...



// instanceof操作符可以帮助我们判断引用类型具体是什么类型的对象：
[] instanceof Array // true
new Date() instanceof Date // true
new RegExp() instanceof RegExp // true
// 复制代码我们先来回顾下原型链的几条规则：

// 1.所有引用类型都具有对象特性，即可以自由扩展属性
// 2.所有引用类型都具有一个__proto__（隐式原型）属性，是一个普通对象
// 3.所有的函数都具有prototype（显式原型）属性，也是一个普通对象
// 4.所有引用类型__proto__值指向它构造函数的prototype
// 5.当试图得到一个对象的属性时，如果变量本身没有这个属性，则会去他的__proto__中去找

// [] instanceof Array实际上是判断Array.prototype是否在[]的原型链上。
// 所以，使用instanceof来检测数据类型，不会很准确，这不是它设计的初衷：
[] instanceof Object // true
// function(){}  instanceof Object // true
// 复制代码另外，使用instanceof也不能检测基本数据类型，所以instanceof并不是一个很好的选择。




// 我们可以直接调用Object原型上未被覆盖的toString()方法，使用call来改变this指向来达到我们想要的效果。
//***如果此方法在自定义对象中未被覆盖，toString才会达到预想的效果，事实上，大部分引用类型比如Array、Date、RegExp等都重写了toString方法。
Object.prototype.toString.call(obj)


// JQ源码中：
var class2type = {};
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

type: function( obj ) {
	if ( obj == null ) {
		return obj + "";
	}
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[Object.prototype.toString.call(obj) ] || "object" :
		typeof obj;
}

//如isFunction直接可以使用jQuery.type(obj) === "function"这样的判断。
isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
}


