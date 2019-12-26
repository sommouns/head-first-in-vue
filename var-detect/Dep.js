/**
 * @file 依赖收集类
 */
let uid = 0;
export default class Dep {
    constructor() {
        const id = uid++;
        this.subs = [];
    }

    addSub (sub) {
        this.subs.push(sub);
    }

    removeSub (sub) {
        remove(this.subs, sub);
    }

    depend () {
        if (window.target) {
            window.target.addSub(this);
        }
    }

    notify () {
        const SUBS = this.subs.slice();
        SUBS.forEach(v => {
            v.update();
        });
    }

    removeSub (sub) {
        const index = this.subs.indexOf(sub);
        if (index > -1) {
            return this.subs.splice(index, 1);
        }
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}