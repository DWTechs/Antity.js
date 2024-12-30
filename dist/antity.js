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

import { isBoolean, isStringOfLength, isValidNumber, isValidInteger, isValidFloat, isEven, isOdd, isPositive, isNegative, isPowerOfTwo, isAscii, isArrayOfLength, isEmail, isRegex, isJson, isJWT, isSymbol, isIpAddress, isSlug, isHexadecimal, isValidDate, isValidTimestamp, isFunction, isHtmlElement, isHtmlEventAttribute, isNode, isObject, isNil, isString, isProperty, isArray, isIn, isInteger } from '@dwtechs/checkard';

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
    float: {
        validate: (v, min, max, typeCheck) => isValidFloat(v, min || undefined, max || undefined, typeCheck || undefined)
    },
    even: {
        validate: (v, _min, _max, typeCheck) => isEven(v, typeCheck || undefined)
    },
    odd: {
        validate: (v, _min, _max, typeCheck) => isOdd(v, typeCheck || undefined)
    },
    positive: {
        validate: (v, _min, _max, typeCheck) => isPositive(v, typeCheck || undefined)
    },
    negative: {
        validate: (v, _min, _max, typeCheck) => isNegative(v, typeCheck || undefined)
    },
    powerOfTwo: {
        validate: (v, _min, _max, typeCheck) => isPowerOfTwo(v, typeCheck || undefined)
    },
    ascii: {
        validate: (v, _min, _max, typeCheck) => isAscii(v, typeCheck || undefined)
    },
    array: {
        validate: (v, min, max, _typeCheck) => isArrayOfLength(v, min || undefined, max || undefined)
    },
    email: {
        validate: (v, _min, _max, _typeCheck) => isEmail(v)
    },
    regex: {
        validate: (v, _min, _max, typeCheck) => isRegex(v, typeCheck || undefined)
    },
    json: {
        validate: (v, _min, _max, _typeCheck) => isJson(v)
    },
    jwt: {
        validate: (v, _min, _max, _typeCheck) => isJWT(v)
    },
    symbol: {
        validate: (v, _min, _max, _typeCheck) => isSymbol(v)
    },
    ipAddress: {
        validate: (v, _min, _max, _typeCheck) => isIpAddress(v)
    },
    slug: {
        validate: (v, _min, _max, _typeCheck) => isSlug(v)
    },
    hexadecimal: {
        validate: (v, _min, _max, _typeCheck) => isHexadecimal(v)
    },
    date: {
        validate: (v, min, max, _typeCheck) => isValidDate(v, min || undefined, max || undefined)
    },
    timestamp: {
        validate: (v, min, max, typeCheck) => isValidTimestamp(v, min || undefined, max || undefined, typeCheck || undefined)
    },
    function: {
        validate: (v, _min, _max, _typeCheck) => isFunction(v)
    },
    htmlElement: {
        validate: (v, _min, _max, _typeCheck) => isHtmlElement(v)
    },
    htmlEventAttribute: {
        validate: (v, _min, _max, _typeCheck) => isHtmlEventAttribute(v)
    },
    node: {
        validate: (v, _min, _max, _typeCheck) => isNode(v)
    },
    object: {
        validate: (v, _min, _max, _typeCheck) => isObject(v)
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

export { Entity };
