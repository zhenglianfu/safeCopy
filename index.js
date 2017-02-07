/**
 * Created by zhenglianfu on 2017/1/30.
 */
// 深拷贝对象时，识别循环引用对象，不拷贝深层次对象
// 不考虑Date RegExp等类对象
// 构造出新的深层次数据结构，循环的节点都替换成新的克隆对象，copy一个循环，循环的最后一个节点的指针指向新的对象
function safeCopy(obj){
    // 构造树形结构，判断当前拷贝节点加入之后能否构成环形结构，若有则跳过该节点停止深拷贝该节点，否则继续
    // 只需要向上检索，不需要向下检索，不需要children来持有子节点对象
    var root = createNode(null, null);
    function createNode(val, parent){
        return {
            value: val,
            // children: [],
            parent: parent
        }
    }
    function addNode(value, parent) {
        var newNode = createNode(value, parent);
        // parent.children.push(newNode);
        return newNode;
    }
    function existCircularParent(node){
        var v = node.value;
        var parent = node.parent;
        // 对象节点才能构成循环，指针指向构成闭环结构
        // 指向父级节点才能形成闭环
        if (parent && v && typeof v === 'object') {
            // 一直向上查找，是否与父级的值绝对相同
            while (parent) {
                if (v === parent.value) {
                    return parent;
                } else {
                    parent = parent.parent;
                }
            }
            return null;
        } else {
            return null;
        }
    }
    function recursiveCopy(value, parent){
        var copy = null;
        var node = null;
        var circularNode = null;
        if (value && typeof value === 'object') {
            node = addNode(value, parent);
            circularNode = existCircularParent(node);
            if (circularNode) {
                // 返回recursiveNode.newValue，组成新的循环体
                return circularNode.newValue;
            } else {
                // es5
                if (Array.isArray(value)) {
                    copy = [];
                    // 进入反射枚举之前赋值
                    node.newValue = copy;
                    for (var i = 0, len = value.length; i < len; i++) {
                        copy[i] = recursiveCopy(value[i], node);
                    }
                } else {
                    copy = {};
                    node.newValue = copy;
                    for (var i in value) {
                        copy[i] = recursiveCopy(value[i], node);
                    }
                }
                return copy;
            }
        } else {
            // 基本类型，已经是叶子节点，没有必要添加到树形结构中了
            return value;
        }
    }
    return recursiveCopy(obj, root);
}
module.exports = safeCopy;