/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-05 16:38:33
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-02-08 10:06:25
 * @FilePath: \草稿\6. call-bind-apply.js
 */
console.log(this);

let a = 1;
function fn() {
    console.log(this.a);
}
let b = "b";
fn.call(b);

// 原生JS：eval + 字符串
Function.prototype.myCall = function (ctx) {
    console.log(this); // 其中this 就是sayName 这个函数
    console.log(ctx); //  {name: "yayxs"}
    console.log("arguments", arguments);
    let tempArgs = []; // 用来存放参数
    for (let i = 1, len = arguments.length; i < len; i++) {
        console.log(arguments[i]); // 第一遍循环体 输出参数一 第二遍循环体 参数二
        tempArgs.push("arguments[" + i + "]");
    }
    console.log(tempArgs);
    ctx.tempFunc = this;
    // ctx.tempFunc()
    let evalScript = "ctx.tempFunc(" + tempArgs + ")"; //* + 调用了数组的toString方法
    eval(evalScript);
    delete ctx.tempFunc;
};
let str = "window";
function fn(arg1, arg2) {
    console.log(`str的值是：${this.str}`);
    console.log(`fn的入参的值是：${(arg1, arg2)}`);
}
let newObj = {
    str: "newObj",
};
fn.myCall(newObj);

Function.prototype.myCall = function (newObject, ...rest) {
    // 1. 将调用的函数中的this绑定到新对象上
    // 实现方法：在新对象上创建一个临时属性，
    //
    newObject.tempFunc = this; //this表示的是调用的函数，这里就是函数fn，可以console.log(this)验证下
    // 2.2 方法2： es6实现，扩展运算符扩展数组
    // let restArgs = Array.from(arguments).slice(1);
    // newObject.tempFunc(...restArgs);
    newObject.tempFunc(...rest);

    // 函数执行完毕后，将其从newObject上删去
    delete newObject.tempFunc;
};
// 测试
let str = "window";
function fn(arg1, arg2) {
    console.log(`str的值是：${this.str}`);
    console.log("arg1值是: ", arg1);
    console.log("arg2值是: ", arg2);
}
let newObj = {
    str: "newObj",
};
fn.myCall(newObj, { a: 1 }, 2);

Function.prototype.myApply = function (newObject, argArr) {
    newObject.tempFunc = this;

    let tempArgs = [];
    for (let i = 0, len = argArr.length; i < len; i++) {
        tempArgs.push("argArr[" + i + "]");
    }

    let evalScript = "newObject.tempFunc(" + tempArgs + ")";
    eval(evalScript);
    delete newObject.tempFunc;
};
let str = "window";
function fn(arg1, arg2) {
    console.log(`str的值是：${this.str}`);
    console.log("arg1值是: ", arg1);
    console.log("arg2值是: ", arg2);
}
let newObj = {
    str: "newObj",
};
fn.myApply(newObj, [{ a: 1 }, 2]);

Function.prototype.myApply = function (newObject, argArr) {
    newObject.tempFunc = this;
    if (!!argArr) newObject.tempFunc(...argArr);
    delete newObject.tempFunc;
};
let str = "window";
function fn(arg1, arg2) {
    console.log(`str的值是：${this.str}`);
    console.log("arg1值是: ", arg1);
    console.log("arg2值是: ", arg2);
}
let newObj = {
    str: "newObj",
};
fn.myApply(newObj, [{ a: 1 }, 2]);

Function.prototype.myBind = function (oThis) {
    // 判断调用bind函数的对象类型是不是 function
    if (typeof this !== "function") {
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    // 获取调用bind时传入的参数
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this, // 利用闭包保存调用bind的函数
        fNOP = function () {}, // 创建中间函数
        fBound = function () {
            // 使用了apply
            console.log(this, "this is");
            return fToBind.apply(
                // 注意！这里的this可不是调用bind的函数，而是fBound函数被调用时的this
                // 如果 new fBound() 调用，则this是fBound的一个实例对象，其原型链上有 fNOP.prototype
                this instanceof fNOP && oThis ? this : oThis || window,
                // 将调用bind时传入的参数和调用fBound时传入的参数拼接成数组传入
                aArgs.concat(Array.prototype.slice.call(arguments))
            );
        };

    // 建立原型关系，将调用bind的函数的原型设置为fNOP的原型
    // 类比，git打了个分支出来
    fNOP.prototype = this.prototype;
    // 将fBound的原型设置为fNOP的实例对象，这样通过fBound构造出来的新对象的原型链上就有fNOP.prototype1
    fBound.prototype = new fNOP();
    // fBound.prototype.constructor = fBound

    return fBound;
};
let str = "window";
function fn(arg1, arg2) {
    console.log(`str的值是：${this.str}`);
    console.log("arg1值是: ", arg1);
    console.log("arg2值是: ", arg2);
}
let newObj = {
    str: "newObj",
};
fn.myBind(newObj)();
