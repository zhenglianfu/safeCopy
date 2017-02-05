####安全拷贝深层次循环引用的js对象
example:  
```
var a = {
    name: 'Git',
    refer: []
};
var b = {
    name: 'SVN',
    refer: []
};
var c = {
    name: 'NULL'
};
a.refer[0] = b;
a.refer[1] = c;
b.refer[0] = a;
var d = safeCopy(a);
console.log(d); 
/* {
    name: 'Git',
    refer: [
        {
            name: 'SVN',
            refer: [Circular]
        },
        {
            name: 'NULL'    
        }]
}  */
```
深度拷贝a对象时，a.refer对应的数组([b, c])被深度拷贝。b对象需被深度拷贝，b中又有存在指向a的指针，构成了循环引用，此时普通的clone方法会陷入死循环，直至超出最大堆栈数，抛出异常而退出。  
使用`safeCopy(a)`会识别此种情况，返回一个新的循环引用结构。  
注：该函数比普通深度clone函数增加了识别是否循环引用的判断，需要更多的内存和时间来完成此函数。  

