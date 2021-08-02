/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-03-12 13:50:02
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-03-15 10:26:35
 * @FilePath: \草稿\node.js
 */

//? path.join 和 path.resolve
// let path = require("path");
// let newpath = path.join("/foo", "bar", "baz/asdf", "quux");
// // console.log(newpath);
// console.log(path.resolve(__dirname, "../src/platforms/web"));
// // console.log(__dirname);

//? 代码检验
// process.env.NODE_ENV = "development";
// console.log(process.env.NODE_ENV);
// function Vue() {
//     console.log(this instanceof Vue);
//     if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
//         console.log("Vue is a constructor and should be called with the `new` keyword");
//     } else {
//         console.log(1111);
//     }
//     // this._init(options);
// }

// Vue();
// let v = new Vue();

//?
let vdom = {
    tag: "div",
    props: {},
    children: [
        "Hello World",
        {
            tag: "ul",
            props: {},
            children: [
                {
                    tag: "li",
                    props: {
                        id: 1,
                        class: "li-1",
                    },
                    children: ["第", 1],
                },
            ],
        },
    ],
};

// 创建 dom 元素
function createElement(vdom) {
    // 如果 vdom 是字符串或者数字类型，则创建文本节点，比如“Hello World”
    if (typeof vdom === "string" || typeof vdom === "number") {
        return document.createTextNode(vdom);
    }

    const { tag, props, children } = vdom;

    // 1. 创建元素
    const element = document.createElement(tag);

    // 2. 属性赋值
    setProps(element, props);

    // 3. 创建子元素
    // appendChild 在执行的时候，会检查当前的 this 是不是 dom 对象，因此要 bind 一下
    children.map(createElement).forEach(element.appendChild.bind(element));

    return element;
}

// 属性赋值
function setProps(element, props) {
    for (let key in props) {
        element.setAttribute(key, props[key]);
    }
}

//?
export function createPatchFunction(backend) {
    let i, j;
    const cbs = {};

    const { modules, nodeOps } = backend;

    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
                cbs[hooks[i]].push(modules[j][hooks[i]]);
            }
        }
    }
}
