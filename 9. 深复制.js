/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-03-08 09:49:53
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-03-09 15:18:48
 * @FilePath: \草稿\9. 深复制.js
 */

function deepClone(target) {
    let result = Array.isArray(target) ? [] : {};
    for (key of Object.keys(target)) {
        if (typeof target[key] === "object") {
            result[key] = deepClone(target[key]);
        } else {
            result[key] = target[key];
        }
    }
    return result;
}

function deepClone2(target) {
    let uniqueList = [];
    debugger;
    function dp(target) {
        let result = Array.isArray(target) ? [] : {};
        let obj = find(uniqueList, target);
        if (obj) {
            return obj.result;
        }
        uniqueList.push({
            target: target,
            result: result,
        });
        for (key of Object.keys(target)) {
            if (typeof target[key] === "object") {
                result[key] = dp(target[key]);
            } else {
                result[key] = target[key];
            }
        }
        return result;
    }
    return dp(target);
}
function find(arr, item) {
    for (ele of arr) {
        if (ele.target === item) return ele;
    }
    return null;
}
let a = { b: 11 };
a.a = a;
bb = deepClone2(a);

let obj1 = { a: 1, b: 2 };
obj1.c = obj1;
obj1.d = { dd: 1 };
obj1.e = obj1.d;
let obj2 = deepClone2(obj1);

// let oldObj = {a:1,b:{c:2}}
// let newObj = deepClone(oldObj)
// console.log(oldObj === newObj)

let obj1 = { a: 1, b: 2 };
obj1.c = obj1;
let obj2 = deepClone(obj1);

function isObject(obj) {
    return obj !== null && typeof obj === "object";
}

function deepCloneMap(target) {
    let copyMap = new Map();

    function deepClone(target) {
        if (!isObject(target)) return target;

        if (copyMap.has(target)) return copyMap.get(target);

        let result = Array.isArray(target) ? [] : {};

        copyMap.set(target, result);

        for (key of Object.keys(target)) {
            result[key] = deepClone(target[key]);
        }

        return result;
    }
    return deepClone(target);
}
let a = { b: 11 };
a.a = a;
bb = deepCloneMap(a);

var graph = {
    A: ["B", "C"],
    B: ["A", "C", "D"],
    C: ["A", "D", "E"],
    D: ["B", "E", "F"],
    E: ["C", "D"],
    F: ["D"],
};
function BFS(graph, node) {
    let bfsResult = [];
    let visitedList = [];
    let remark = new Set();
    visitedList.push(node);
    remark.add(node);
    while (visitedList.length) {
        vet = visitedList.shift();
        bfsResult.push(vet);
        for (item of graph[vet]) {
            if (!remark.has(item)) {
                visitedList.push(item);
                remark.add(item);
            }
        }
    }
    return bfsResult;
}

let bfs = BFS(graph, "A");
console.log(bfs);

function DFS(graph, node) {
    let dfsResult = [];
    let visitedList = [];
    let remark = new Set();
    visitedList.push(node);
    remark.add(node);
    while (visitedList.length) {
        vet = visitedList.pop();
        dfsResult.push(vet);
        for (item of graph[vet]) {
            if (!remark.has(item)) {
                visitedList.push(item);
                remark.add(item);
            }
        }
    }
    return dfsResult;
}

let dfs = DFS(graph, "A");
console.log(dfs);

function isObject(obj) {
    return obj !== null && typeof obj === "object";
}
function deepCloneMapBFS(target) {
    if (!isObject(target)) return target;

    let copyMap = new Map();
    let queue = [target];

    while (queue.length) {
        let curData = queue.shift();
        let obj;
        if (copyMap.has(curData)) {
            obj = copyMap.get(curData);
            continue;
        } else {
            obj = Array.isArray(curData) ? [] : {};
            copyMap.set(curData, obj);
        }
        for (key of Object.keys(curData)) {
            let tmp = curData[key];
            if (!isObject(tmp)) {
                obj[key] = tmp;
                continue;
            }
            if (copyMap.has(tmp)) {
                obj[key] = copyMap.get(tmp);
            } else {
                obj[key] = Array.isArray(curData) ? [] : {};
                copyMap.set(tmp, obj[key]);
                queue.push(tmp);
            }
        }
    }

    return copyMap.get(target);
}
let a = { b: 11 };
a.a = a;
bb = deepCloneMapBFS(a);
