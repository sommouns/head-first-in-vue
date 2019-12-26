import { isObject } from "util";

export function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    });
}

const seenObjects = new Set();
export function traverse (val) {
    _traverse(val);
    seenObjects.clear();
}

function _traverse (val, seen) {
    let i, keys;
    const isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
        return;
    }
    if (val.__ob__) {
        const depId = val.__ob__.dep.depId;
        if (seen.has(depId)) {
            return;
        }
        seen.add(depId);
    }
    if (isA) {
        i = val, length;
        while (i--) _traverse(vla[i], seen);
    } else {
        keys = Object.keys(val);
        i = keys.length;
        while (i--) _traverse(vla[i], seen);
    }
}