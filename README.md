####安全拷贝深层次循环引用的js对象
example:  
```
var a = {
    name: 'a'
};
var b = {
    name: 'b'
};
a.refer = b;
b.shallow = {
    deep: a
};
b.shallow.nestedShallow = b.shallow;
```
```
var c = safeCopy(a);
console.log(c);
/*
{
    name: 'a',
    refer: {
        name: 'b',
        shallow: {
            deep: [Circular], // equals c
            nestedShallow: [Circular] // equals c.refer.shallow
        }
    }
}
*/
console.log(c === c.refer.shallow.deep); // true
console.log(c.refer.shallow === c.refer.shallow.nestedShallow); // true
```
```
var d = safeCopy(b);
console.log(d);
/*
{
    name: 'b',
    shallow: {
        deep: {
            name: 'a',
            refer: [Circular] // equals d
        },
        nestedShallow: [Circular] // equals d.shallow
    }
}
*/
console.log(d === d.shallow.deep.refer); // true
console.log(d.shallow === d.shallow.nestedShallow); // true
```
a.refer指向b，b.shallow.deep指向a，a和b构成循环引用。b对象内部b.shallow.nestedShallow指向b.shallow即它的外层对象，也构成了循环引用。  
此时普通的clone方法会陷入死循环，直至超出最大堆栈数，抛出异常而退出。使用`safeCopy(a)`会识别此种情况，返回一个新的循环引用结构。  
注：该函数比普通深度clone函数增加了识别是否循环引用的判断，需要更多的内存和时间来完成此函数。  

