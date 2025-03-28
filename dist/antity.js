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

import { isBoolean, isStringOfLength, isValidNumber, isValidInteger, isValidFloat, isEven, isOdd, isPositive, isNegative, isPowerOfTwo, isAscii, isArrayOfLength, isEmail, isRegex, isJson, isJWT, isSymbol, isIpAddress, isSlug, isHexadecimal, isValidDate, isValidTimestamp, isFunction, isHtmlElement, isHtmlEventAttribute, isNode, isObject, isString, isProperty, isArray, isIn, isDate, isNumber, isInteger, isNil } from '@dwtechs/checkard';
import { log } from '@dwtechs/winstan';

const Operations = ["select", "insert", "update", "merge", "delete"];

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

class Property {
    constructor(key, type, min, max, required, safe, typeCheck, operations, sanitize, normalize, control, sanitizer, normalizer, controller) {
        if (!isString(key, "!0"))
            throw new Error(`Property "key" must be a string. Received ${key}`);
        if (!isProperty(Types, type))
            throw new Error(`Property "type" must be a valid type. Received ${type}`);
        if (isArray(operations)) {
            for (const o of operations) {
                if (!isIn(Operations, o))
                    throw new Error(`Property "operations" must be an array of SQL operations. Received ${o}`);
            }
        }
        this.key = key;
        this.type = type;
        this.min = this.interval(min, type, 0, "1900-01-01T00:00:00Z");
        this.max = this.interval(max, type, 999999999, "2200-12-31T00:00:00Z");
        this.required = isBoolean(required) ? required : false;
        this.safe = isBoolean(safe) ? safe : true;
        this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
        this.operations = operations || Operations;
        this.sanitize = isBoolean(sanitize) ? sanitize : true;
        this.normalize = isBoolean(normalize) ? normalize : false;
        this.control = isBoolean(control) ? control : true;
        this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
        this.normalizer = isFunction(normalizer) ? normalizer : null;
        this.controller = isFunction(controller) ? controller : null;
    }
    interval(val, type, integerDefault, dateDefault) {
        if (type === "date")
            return isDate(val) ? val : new Date(dateDefault);
        return (isNumber(val, true) && isInteger(val, true)) ? val : integerDefault;
    }
}

const Messages = {
    missing: (key) => `Missing ${key}`,
    invalid: (key, type) => `Invalid ${key}, must be of type ${type}`,
};

const Methods = ["GET", "PATCH", "PUT", "POST", "DELETE"];

function method(method) {
    switch (method) {
        case "GET":
            return Operations[0];
        case "PATCH":
            return Operations[2];
        case "PUT":
            return Operations[2];
        case "POST":
            return Operations[1];
        case "DELETE":
            return Operations[4];
        default:
            return undefined;
    }
}
var map = { method };

class Entity {
    constructor(table, properties) {
        this._table = table;
        this._properties = [];
        this._cols = {
            select: [],
            insert: [],
            update: [],
            merge: [],
            delete: []
        };
        this._unsafeProps = [];
        for (const p of properties) {
            const prop = new Property(p.key, p.type, p.min, p.max, p.required, p.safe, p.typeCheck, p.operations, p.sanitize, p.normalize, p.control, p.sanitizer, p.normalizer, p.controller);
            this._properties.push(prop);
            for (const o of p.operations) {
                const c = this._cols[o];
                if (o === "update")
                    c.push(`${p.key} = $${c.length + 1}`);
                else
                    c.push(p.key);
            }
            if (!prop.safe)
                this._unsafeProps.push(prop.key);
        }
    }
    get table() {
        return this._table;
    }
    get unsafeProps() {
        return this._unsafeProps;
    }
    get cols() {
        return this._cols;
    }
    get properties() {
        return this._properties;
    }
    getColsByOp(operation, stringify, pagination) {
        const cols = pagination && operation === "select" ? [...this._cols[operation], "COUNT(*) OVER () AS total"] : this.cols[operation];
        return stringify ? cols.join(', ') : cols;
    }
    getProperty(key) {
        return this.properties.find(p => p.key === key);
    }
    normalize(rows) {
        for (const r of rows) {
            for (const { key, type, sanitize, normalize, sanitizer, normalizer, } of this.properties) {
                let v = r[key];
                if (v) {
                    if (sanitize) {
                        log.debug(`sanitize ${key}: ${type} = ${v}`);
                        v = this.sanitize(v, sanitizer);
                    }
                    if (normalize && normalizer) {
                        log.debug(`normalize ${key}: ${type} = ${v}`);
                        v = normalizer(v);
                    }
                    r[key] = v;
                }
            }
        }
        return rows;
    }
    validate(rows, operation) {
        if (!isIn(Methods, operation))
            return null;
        const o = map.method(operation);
        for (const r of rows) {
            for (const { key, type, min, max, required, typeCheck, operations, control, controller } of this.properties) {
                const v = r[key];
                if (isIn(operations, o)) {
                    if (required) {
                        const rq = this.require(v, key, type);
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
    require(v, key, type) {
        log.debug(`require ${key}: ${type} = ${v}`);
        return isNil(v) ? Messages.missing(key) : null;
    }
    control(v, key, type, min, max, typeCheck, cb) {
        log.debug(`control ${key}: ${type} = ${v}`);
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
        if (isString(v, "!0"))
            return v.trim();
        if (isObject(v, true)) {
            for (const k in v) {
                if (Object.prototype.hasOwnProperty.call(v, k)) {
                    let o = v[k];
                    if (isString(o, "!0"))
                        o = o.trim();
                }
            }
        }
        return v;
    }
}

export { Entity };
