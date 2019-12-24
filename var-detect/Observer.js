/**
 * @file Observer类用于递归监听所有key
 */

import Dep from './Dep';
import { ARRAY_METHODS } from './array-methods';

export default class Observer {
    constructor(value) {
        this.value = value;

        if (Array.isArray(value)) {
            value.__proto__ = ARRAY_METHODS;
        } else {
            this.walk(value);
        }
    }

    walk (obj) {
        const keys = Object.keys(obj);
        keys.forEach(v => {
            defineReactive(obj, v, obj[v]);
        });
    }
}

function defineReactive (data, key, val) {

    // 递归转换子对象
    if (typeof val === 'object') {
        new Observer(val);
    }

    let dep = new Dep();
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get () {
            dep.depend();
            return val;
        },
        set (newVal) {
            if (val === newVal) {
                return;
            }

            val = newVal;
            dep.notify();
        }
    });
}