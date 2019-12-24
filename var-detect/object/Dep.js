/**
 * @file 依赖收集类
 */

export default class Dep {
    constructor () {
        this.subs = []
    }

    addSub (sub) {
        this.subs.push(sub)
    }

    removeSub (sub) {
        remove(this.subs, sub)
    }

    depend () {
        if (window.target) {
            this.addSub(window.target)
        }
    }

    notify () {
        const SUBS = this.subs.slice()
        SUBS.forEach(v => {
            v.update()
        })
    }
}

function remove (arr, item) {
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}