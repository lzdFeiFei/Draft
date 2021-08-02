/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-08 13:40:34
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-02-08 14:44:31
 * @FilePath: \草稿\6. this.js
 */
function foo() {
    console.log(this.a);
}
foo.a = "a";
foo();

function foo() {
    var a = 2;
    this.bar();
}
function bar() {
    console.log(this.a);
}
foo();

var a = "window";
function outer() {
    let a = "outer";
    function foo() {
        let a = "foo";
        console.log(this);
        this.bar(); // Uncaught TypeError: this.bar is not a function
    }
    function bar() {
        let a = "bar";
        console.log(this.a);
    }
    foo();
}
outer();

function foo() {
    function bar() {
        function baz() {
            console.log(this);
        }
        baz();
    }
    bar();
}
foo();

function foo() {
    console.log(this.a);
}

let obj = {
    a: "a",
    foo: foo,
};

obj.foo();

function foo() {
    return () => {
        console.log(this.a);
    };
}
var obj1 = {
    a: "obj1",
};
var obj2 = {
    a: "obj2",
};
var bar = foo.call(obj1);
bar.call(obj2);
