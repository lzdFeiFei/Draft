/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-02 14:48:46
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-04-21 08:48:53
 * @FilePath: \dpcg-hcbaiap-texte:\00. 学习资料\草稿\4. my-promise.js
 */
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

const resolvePromise = (promise2, x, resolve, reject) => {
    // console.log("promise2", promise2);
    // console.log("x", x);
    if (promise2 === x) {
        console.log("error");
        return reject(new Error("Chaining cycle detected for promise #<Promise>"));
    }
    let called;
    if ((typeof x === "object" && x != null) || typeof x === "function") {
        try {
            let then = x.then;
            if (typeof then === "function") {
                then.call(
                    x,
                    (y) => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                );
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
};

class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; //* 并联； 链式调用：串联
        this.onRejectedCallbacks = [];

        let resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallbacks.forEach((fn) => fn());
            }
        };

        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach((fn) => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (err) => {
                      throw err;
                  };

        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                // console.log("成功回调函数组", this.onResolvedCallbacks);
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });

        return promise2;

        // if (this.status === FULFILLED) {
        //     onFulfilled(this.value);
        // }
        // if (this.status === REJECTED) {
        //     onRejected(this.reason);
        // }
        // if (this.status === PENDING) {
        //     this.onResolvedCallbacks.push(() => {
        //         onFulfilled(this.value);
        //     });
        //     this.onRejectedCallbacks.push(() => {
        //         onRejected(this.reason);
        //     });
        // }
    }
}

//? 测试
// const promise = new Promise((resolve, reject) => {
//   resolve("成功");
// }).then(
//   (data) => {
//     console.log("success", data);
//   },
//   (err) => {
//     console.log("faild", err);
//   }
// );
// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("成功");
//     }, 2000);
// }).then(
//     (data) => {
//         console.log("success", data);
//     },
//     (err) => {
//         console.log("faild", err);
//     }
// );
// const promise = new Promise((resolve, reject) => {
//     reject("失败");
// })
//     .then()
//     .then()
//     .then(
//         (data) => {
//             console.log(data);
//         },
//         (err) => {
//             console.log("err", err);
//         }
//     );
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
// promise1.then((s) => {
//     console.log(`${s}:${s}`);
// });

var promise1 = new Promise((res, rej) => {
    res(1);
});

var promise2 = promise1.then((value) => {
    console.log(value + 1);
    return "p2";
});

var promise3 = promise1.then((value) => {
    console.log(value * 2);
    return "p3";
});
