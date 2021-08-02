/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-02 09:49:43
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-02-03 11:24:15
 * @FilePath: \undefinede:\00. 学习资料\草稿\promise.js
 */
//? 创建Promise
let promise = new Promise(function (resolve, reject) {
    console.log("Promise");
    resolve();
});
//? catch 也返回一个Promise
promise
    .then(function () {
        console.log("resolved.");
        throw new Error("error");
    })
    .catch((e) => {
        console.log(`上个then抛出的错误：${e}`);
        return 1;
    })
    .then(function (num) {
        console.log(`上个then传过来的：${num}`);
    });
//? finall的实现
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    console.log(P);
    return this.then(
        (value) => P.resolve(callback()).then(() => value),
        (reason) =>
            P.resolve(callback()).then(() => {
                throw reason;
            })
    );
};
//? resolve参数是个thenable对象
let thenable = {
    then: function (resolve, reject) {
        reject(-42);
    },
};
let p1 = Promise.resolve(thenable);
p1.then(function (value) {
    console.log(value); // 42
}).catch((e) => {
    console.log(e, 11);
});
//? Promise 执行顺序
setTimeout(function () {
    console.log("three");
}, 0);
Promise.resolve("two").then(function (s) {
    console.log(s);
});
console.log("one");

//? await 中断函数
const one = () => Promise.resolve("One!");
// function myFunc() {
//   console.log("In function!");
//   one().then((res) => {
//     console.log(res);
//   });
// }
async function myFunc() {
    console.log("In function!");
    const res = await one();
    console.log(res);
}
console.log("Before function!");
myFunc();
console.log("After function!");

//? 构造函数中调用新创建对象
function Person(fn) {
    this.name = "wang";
    fn();
}
let person = new Person(() => {
    setTimeout(() => {
        console.log(person);
    }, 0);
});

//? then may be called multiple times on the same promise.
let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("promise");
    }, 0);
});

promise1
    .then((s) => {
        return promise1;
    })
    .then((s) => {
        console.log(`${s}`);
    }); //todo 微任务时 测试一下 中间夹着多个其它层级
promise1.then((s) => {
    console.log(`${s}:${s}`);
});
