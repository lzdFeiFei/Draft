/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-04-27 10:57:33
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-04-27 14:57:25
 * @FilePath: \草稿\my-promise-2.js
 */

function Promise(executor) {
  var self = this;
  self.status = 'pending';
  self.data = '';
  self.onResolvedCallBack = [];
  self.onRejectedCallBack = [];

  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    // setTimeout(function () {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.data = value;
      for (var i = 0; i < self.onResolvedCallBack.length; i++) {
        self.onResolvedCallBack[i](value);
      }
    }
    // });
  }

  function reject(reason) {
    setTimeout(function () {
      if (self.status === 'pending') {
        self.status = 'rejected';
        self.data = reason;
        for (var i = 0; i < self.onRejectedCallBack.length; i++) {
          self.onRejectedCallBack[i](reason);
        }
      }
    });
  }

  try {
    executor(resolve, reject);
  } catch (reason) {
    reject(reason);
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  var then;
  var thenCalledOrThrow = false;

  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise!'));
  }

  if (x instanceof Promise) {
    if (x.status === 'pending') {
      x.then(function (v) {
        resolvePromise(promise2, v, resolve, reject);
      }, reject);
    }
  } else {
    x.then(resolve, reject);
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          function (y) {
            if (thenCalledOrThrow) return;
            thenCalledOrThrow = true;
            return resolvePromise(promise2, y, resolve, reject);
          },
          function (r) {
            if (thenCalledOrThrow) return;
            thenCalledOrThrow = true;
            return reject(r);
          },
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (thenCalledOrThrow) return;
      thenCalledOrThrow = true;
      return reject(e);
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  var promise2;
  onResolved =
    typeof onResolved === 'function'
      ? onResolved
      : function (v) {
          return v;
        };
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : function (r) {
          throw r;
        };

  if (self.status === 'resolved') {
    console.log('is resolved');
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onResolved(self.data);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }));
  }

  if (self.status === 'rejected') {
    return (promise2 = new Promise(function (resolve, reject) {
      setTimeout(function () {
        try {
          var x = onRejected(self.data);
          resolvePromise(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.status === 'pending') {
    return (promise2 = new Promise(function (resolve, reject) {
      self.onResolvedCallBack.push(function (value) {
        try {
          var x = onResolved(value);
          resolvePromise(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
      self.onRejectedCallBack.push(function (reason) {
        try {
          var x = onRejected(reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }
};

var p1 = new Promise((res, rej) => {
  console.log('p1');
  res(123);
});

p1.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log(error);
  },
);

// const promise = new Promise((resolve, reject) => {
//   resolve('成功');
// }).then(
//   (data) => {
//     console.log('success', data);
//   },
//   (err) => {
//     console.log('faild', err);
//   },
// );
