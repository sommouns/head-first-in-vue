/**
 * @file: 拦截器，替换array原型方法
 */

import { def } from './utils';

const ARRAY_PROTO = Array.prototype;
export const ARRAY_METHODS = Object.create(ARRAY_PROTO);

[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
].forEach(method => {

    // 缓存初始方法
    const ORIGINAL = ARRAY_PROTO[method];
    def(ARRAY_METHODS, method, function mutator (...args) {
        const res = ORIGINAL.apply(this, args);
        const ob = this.__ob__;
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
        }
        ob.dep.notify();
        return res;
    });
});