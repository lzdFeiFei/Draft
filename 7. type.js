/*
 * @Description:
 * @Author: lv.zhd
 * @Date: 2021-02-18 13:57:26
 * @LastEditors: lv.zhd
 * @LastEditTime: 2021-02-26 09:56:14
 * @FilePath: \草稿\7. type.js
 */
console.log(typeof undefined === "undefined");
typeof true;
typeof 42;
typeof "42";
typeof { life: 42 };
typeof Symbol();

function myNew() {
    Constructor = [].shift.call(arguments);
    // 通过 o.__proto__ 直接和 Constructor.prototype 建立联系
    // const o = {}
    // o.__proto__ = Constructor.prototype
    // Object.create 以 Constructor.prototype为原型创建对象 o
    const o = Object.create(Constructor.prototype);

    Constructor.apply(o, arguments);

    return o;
}

function Person(name, age) {
    this.name = name;
    this.age = age;
}

var myPerson = myNew(Person, "wang", 12);

function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
function createBook(obj) {
    var o = new inheritObject(obj);
    o.getName = function (name) {
        console.log(name);
    };
    return o;
}
var book = {
    name: "js book",
    likeBook: ["css Book", "html book"],
};
// var newBook = inheritObject(book);
// newBook.name = 'ajax book';
// newBook.likeBook.push('react book');
// var otherBook = inheritObject(book);
// otherBook.name = 'canvas book';
// otherBook.likeBook.push('node book');
// console.log(newBook,otherBook);
var newBook = createBook(book);
newBook.name = "ajax book";
newBook.likeBook.push("react book");
var otherBook = createBook(book);
otherBook.name = "canvas book";
otherBook.likeBook.push("node book");
console.log(newBook, otherBook);
console.log(newBook.likeBook, otherBook.likeBook);
