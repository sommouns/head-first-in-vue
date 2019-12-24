/**
 * @file Watcher类用于作为中介，监听变化并传递
 */

export default class Watcher {
    constructor(vm, expOrFn, cb) {
        this.vm = vm;

        // 解析 a.b.c
        this.getter = parsePath(expOrFn);
        this.cb = cb;
        this.value = this.get();
    }

    get () {
        window.target = this;

        // 先取一下，去触发getter，就自动将watcher添加到Dep中去了
        let value = this.getter.call(this.vm, this.vm);
        window.target = undefined;
        return value;
    }

    update () {
        const oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldValue);
    }
}

const BAIL_RE = /[^\w.$]/;
function parsePath (path) {

    // 过滤非法字符
    if (BAIL_RE.test(path)) {
        return;
    }
    const SEGMENTS = path.split('');

    // 逐层遍历，获取最终需要get的值
    return function (obj) {
        SEGMENTS.forEach(v => {
            if (!obj) return;
            obj = obj[v];
        });
        return obj;
    };
}