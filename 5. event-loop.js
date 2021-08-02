/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-04 13:58:04
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-02-05 16:39:14
 * @FilePath: \草稿\event-loop.js
 */
//? 什么才是回调函数
// function a() {
//     console.log("a");
// }

// function b(fn) {
//     console.log("callback");
//     fn();
// }

// function c() {
//     console.log("not callback");
//     a();
// }

// function d() {
//     function a() {
//         console.log("a in d");
//     }
//     console.log("not callback");
//     a();
// }

// b(a);
// c();
// d();

setTimeout(() => {
    console.log("我是第一个宏任务");
    Promise.resolve().then(() => {
        console.log("我是第一个宏任务里的第一个微任务");
    });
    Promise.resolve().then(() => {
        console.log("我是第一个宏任务里的第二个微任务");
    });
}, 0);

setTimeout(() => {
    console.log("我是第二个宏任务");
}, 0);

Promise.resolve().then(() => {
    console.log("我是第一个微任务");
    setTimeout(() => {
        console.log("我是第三个宏任务");
        Promise.resolve().then(() => {
            console.log("我是第3个宏任务里的第一个微任务");
        });
        Promise.resolve().then(() => {
            console.log("我是第3个宏任务里的第二个微任务");
        });
    }, 0);
});

console.log("执行同步任务");

// 防抖
function debounce(fn, delay) {
    let timer = null; //借助闭包
    return function () {
        if (timer) {
            clearTimeout(timer); //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
        }
        timer = setTimeout(fn, delay);
    };
}
function showTop() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log("滚动条位置：" + scrollTop);
}
window.onscroll = debounce(showTop, 1000);
// 节流
function throttle(fn, delay) {
    let valid = true;
    return function () {
        if (!valid) {
            //休息时间 暂不接客
            return false;
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false;
        setTimeout(() => {
            fn();
            valid = true;
        }, delay);
    };
}
/* 请注意，节流函数并不止上面这种实现方案,
   例如可以完全不借助setTimeout，可以把状态位换成时间戳，然后利用时间戳差值是否大于指定间隔时间来做判定。
   也可以直接将setTimeout的返回的标记当做判断条件-判断当前定时器是否存在，如果存在表示还在冷却，并且在执行fn之后消除定时器表示激活，原理都一样
    */

function showTop() {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    console.log("滚动条位置：" + scrollTop);
}
window.onscroll = throttle(showTop, 1000);

function fn() {
    console.log(this.a);
}
let obj = {
    a: 1,
    fn: fn,
};
obj.fn();

const o4 = {
    text: "o4",
    fn: o1.fn,
};

function outer() {
    let a = 1;
    const inner = function () {
        console.log("inner", this);
        const inner2 = function () {
            console.log("inne2", this);
        };
        inner2();
    };
    inner();
}
outer();
function outer2() {
    let a = 1;
    const inner = () => {
        console.log("inner", this);
        const inner2 = () => {
            console.log("inne2", this);
        };
        inner2();
    };
    inner();
}
outer2();
function outer3() {
    let a = 1;
    const inner = function () {
        console.log("inner", this);
        const inner2 = () => {
            console.log("inne2", this);
        };
        inner2();
    };
    inner();
}
outer3();
function outer4() {
    let a = 1;
    const inner = () => {
        console.log("inner", this);
        const inner2 = function () {
            console.log("inne2", this);
            ``;
        };
        inner2();
    };
    inner();
}
outer4();

let testObj = {
    outer,
    outer2,
    outer3,
    outer4,
};
testObj.outer();
testObj.outer2();
testObj.outer3();
testObj.outer4();
