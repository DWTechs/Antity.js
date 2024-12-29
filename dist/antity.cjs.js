/*
MIT License

Copyright (c) 2024 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Antity.js
*/

'use strict';

/*
MIT License

Copyright (c) 2009 DWTechs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/DWTechs/Checkard.js
*/

function isNumeric(n) {
    return !isNaN(n - parseFloat(n));
}
function getTag(t) {
    return t == null ? t === undefined ? '[object Undefined]' : '[object Null]' : toString.call(t);
}

function isBoolean(b) {
    return typeof b === "boolean";
}
function isNumber(n, type = true) {
    return !isSymbol(n) && !((n === null || n === void 0 ? void 0 : n.constructor) === Array) && (type ? Number(n) === n : isNumeric(n));
}
function isSymbol(s) {
    const type = typeof s;
    return type === 'symbol' || (type === 'object' && s != null && getTag(s) === '[object Symbol]');
}
function isNil(n) {
    return n == null;
}

function isFunction(func) {
    return Boolean(func && getTag(func) === "[object Function]");
}

const comparisons = {
    '=': (a, b) => a == b,
    '<': (a, b) => a < b,
    '>': (a, b) => a > b,
    '<=': (a, b) => a <= b,
    '>=': (a, b) => a >= b
};
function isInteger(n, type = true) {
    if (!isNumber(n, type))
        return false;
    const int = Number.parseInt(String(n), 10);
    return type ? n === int : n == int;
}

function isValidNumber(n, min = -999999999, max = 999999999, type = true) {
    return isNumber(n, type) && n >= min && n <= max;
}
function isValidInteger(n, min = -999999999, max = 999999999, type = true) {
    return isInteger(n, type) && n >= min && n <= max;
}

function isArray(a, comp, len) {
    return (a === null || a === void 0 ? void 0 : a.constructor) === Array ? (comp && isValidInteger(len, 0, 999999999)) ? comparisons.hasOwnProperty(comp) ? comparisons[comp](a.length, len) : false : true : false;
}
function isArrayOfLength(a, min = -999999999, max = 999999999) {
    if (isArray(a, null, null)) {
        const n = a.length;
        return n >= min && n <= max;
    }
    return false;
}
function isIn(val, arr) {
    return isArray(arr, '>', 0) ? arr.includes(val) : false;
}

function isString(s, required = false) {
    return typeof s === "string" && (required ? !!s : true);
}
function isStringOfLength(s, min = 0, max = 999999999) {
    if (isString(s, false)) {
        const l = s.length;
        return l >= min && l <= max;
    }
    return false;
}

function isObject(o, empty = false) {
    return o !== null && typeof o === "object" && !isArray(o) && (empty ? !!Object.keys(o).length : true);
}
function isProperty(val, obj) {
    const v = String(val);
    return isString(v, true) && isObject(obj) ? Object.keys(obj).includes(v) : false;
}

const Methods = ["GET", "PATCH", "PUT", "POST", "DELETE"];

const Types = {
    boolean: {
        validate: (v, _min, _max, _typeCheck) => isBoolean(v)
    },
    string: {
        validate: (v, min, max, _typeCheck) => isStringOfLength(v, min, max)
    },
    number: {
        validate: (v, min, max, typeCheck) => isValidNumber(v, min || undefined, max || undefined, typeCheck || undefined)
    },
    integer: {
        validate: (v, min, max, typeCheck) => isValidInteger(v, min || undefined, max || undefined, typeCheck || undefined)
    },
    array: {
        validate: (v, min, max, _typeCheck) => isArrayOfLength(v, min, max)
    }
};
const Required = {
    validate: (v) => !isNil(v)
};

class Property {
    constructor(key, type, min, max, required, typeCheck, methods, sanitize, normalize, control, sanitizer, normalizer, controller) {
        if (!isString(key, true))
            throw new Error(`Property key must be a string. Received ${key}`);
        if (!isProperty(type, Types))
            throw new Error(`Property type must be a valid type. Received ${type}`);
        if (isArray(methods)) {
            for (const m of methods) {
                if (!isIn(m, Methods))
                    throw new Error(`Property methods must be an array of REST Methods. Received ${m}`);
            }
        }
        this.key = key;
        this.type = type;
        this.min = isInteger(min, true) ? min : 0;
        this.max = isInteger(max, true) ? max : 999999999;
        this.required = isBoolean(required) ? required : false;
        this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
        this.methods = methods || Methods;
        this.sanitize = isBoolean(sanitize) ? sanitize : true;
        this.normalize = isBoolean(normalize) ? normalize : false;
        this.control = isBoolean(control) ? control : true;
        this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
        this.normalizer = isFunction(normalizer) ? normalizer : null;
        this.controller = isFunction(controller) ? controller : null;
    }
}

const Messages = {
    missing: (key) => `Missing ${key}`,
    invalid: (key, type) => `Invalid ${key}, must be of type ${type}`,
};

class Entity {
    constructor(name, table, properties) {
        this.name = name;
        this.table = table;
        this.properties = this.init(properties);
    }
    init(properties) {
        const props = [];
        for (const p of properties) {
            props.push(new Property(p.key, p.type, p.min, p.max, p.required, p.typeCheck, p.methods, p.sanitize, p.normalize, p.control, p.sanitizer, p.normalizer, p.controller));
        }
        return props;
    }
    cols(method) {
        const cols = [];
        for (const p of this.properties) {
            if (isIn(method, p.methods))
                cols.push(p.key);
        }
        return cols;
    }
    normalize(rows) {
        for (const r of rows) {
            for (const { key, sanitize, normalize, sanitizer, normalizer, } of this.properties) {
                let v = r[key];
                if (v) {
                    if (sanitize)
                        v = this.sanitize(v, sanitizer);
                    if (normalize && normalizer)
                        v = normalizer(v);
                    r[key] = v;
                }
            }
        }
        return rows;
    }
    validate(rows, method) {
        for (const r of rows) {
            for (const { key, type, min, max, required, typeCheck, methods, control, controller } of this.properties) {
                const v = r[key];
                if (method && isIn(method, methods)) {
                    if (required) {
                        const rq = this.require(v, key);
                        if (rq)
                            return rq;
                    }
                    if (v && control) {
                        const ct = this.control(v, key, type, min, max, typeCheck, controller);
                        if (ct)
                            return ct;
                    }
                }
            }
        }
        return null;
    }
    require(v, key) {
        return Required.validate(v) ? null : Messages.missing(key);
    }
    control(v, key, type, min, max, typeCheck, cb) {
        if (cb)
            return cb(v) ? null : Messages.invalid(key, type);
        return Types[type].validate(v, min, max, typeCheck) ? null : Messages.invalid(key, type);
    }
    sanitize(v, cb) {
        if (cb)
            return cb(v);
        if (isArray(v, null, null)) {
            for (let d of v) {
                d = this.trim(d);
            }
            return v;
        }
        return this.trim(v);
    }
    trim(v) {
        if (isString(v, true))
            return v.trim();
        if (isObject(v, true)) {
            if (v.has)
                for (const p in v) {
                    if (v.prototype.hasOwnProperty.call(p)) {
                        let o = v[p];
                        if (isString(o, true))
                            o = o.trim();
                    }
                }
            return v;
        }
    }
}

exports.Entity = Entity;
