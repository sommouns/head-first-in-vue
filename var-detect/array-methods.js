/**
 * @file: 拦截器，替换array原型方法
 */

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
    Object.defineProperty(ARRAY_METHODS, method, {
        value: function mutator (...args) {
            return ORIGINAL.apply(this, args);

            // TODO: 发送消息
        },
        enumerable: true,
        writable: true,
        configurable: true
    });
});