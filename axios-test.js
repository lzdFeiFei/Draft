/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-05-06 10:21:41
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-05-08 08:57:08
 * @FilePath: \草稿\axios-test.js
 */
function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
}

var obj = { a: 1 };
var fnn = function () {
  let arr = Array.from(arguments);
  console.log(this);
  console.log(arr);
};
var instance = bind(fnn, obj);
// console.log(instance);
console.log(instance(12, 3, 4));

var chain = [1, undefined];
var requestInterceptorChain = [2, 3, 5, 6];
Array.prototype.unshift.apply(chain);
Array.prototype.unshift.apply(chain, requestInterceptorChain);
