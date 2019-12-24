/**
 * @file Observer类用于递归监听所有key
 */

import Dep from './Dep';
import { ARRAY_METHODS } from './array-methods';

// 检测是否支持 __proto__
let hasProto = '__proto__' in {};
let arrayKeys = Object.getOwnPropertyNames(ARRAY_METHODS);

export default class Observer {
    constructor(value) {
        this.value = value;

        if (Array.isArray(value)) {
            let augment = hasProto
                ? protoAgument(value, ARRAY_METHODS, arrayKeys)
                : copyAgument(value, ARRAY_METHODS);
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

// 支持 __proto__ 直接覆盖prototype
function protoAgument (target, src) {
    target.__proto__ = src;
}

// 不支持，把方法直接盖上去
function copyAgument (target, src, keys) {
    keys.forEach(v => {
        def(target, v, src[v]);
    });
}