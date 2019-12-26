/**
 * @file Watcher类用于作为中介，监听变化并传递
 */

import { traverse } from './utils';

export default class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm;

        if (options) {
            this.deep = !!options.deep;
        } else {
            this.deep = false;
        }

        this.deps = [];
        this.depsID = new Set();

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }
        this.cb = cb;
        this.value = this.get();
    }

    get () {
        window.target = this;

        // 先取一下，去触发getter，就自动将watcher添加到Dep中去了
        let value = this.getter.call(this.vm, this.vm);

        if (this.deep) {
            traverse(value);
        }

        window.target = undefined;
        return value;
    }

    update () {
        const oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldValue);
    }

    addDep (dep) {
        const id = dep.id;
        if (!this.depsID.has(id)) {
            this.depsID.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
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

function teardown () {
    let i = this.deps.length;
    while (i--) {
        this.deps[i].removeSub(this);
    }
}

Vue.prototype.$watch = function (expOrFn, cb, options = {}) {
    const vm = this;
    const watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
        cb.call(vm, watcher.value);
    }
    return function unWatchFn () {
        watcher.teardown();
    };
};