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
        validate: (v, min, max, typeCheck) => isValidInteger(v, min !== null && min !== void 0 ? min : undefined, max !== null && max !== void 0 ? max : undefined, typeCheck || undefined)
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
    constructor(key, type, min, max, required, safe, typeCheck, methods, sanitize, normalize, validate, sanitizer, normalizer, validator) {
        if (!isString(key, "!0"))
            throw new Error(`Property "key" must be a string. Received ${key}`);
        if (!isProperty(Types, type))
            throw new Error(`Property "type" must be a valid type. Received ${type}`);
        if (isArray(methods)) {
            for (const m of methods) {
                if (!isIn(Methods, m))
                    throw new Error(`Property "methods" must be an array of REST methods. Received ${m}`);
            }
        }
        this.key = key;
        this.type = type;
        this.min = this.interval(min, type, 0, "1900-01-01T00:00:00Z");
        this.max = this.interval(max, type, 999999999, "2200-12-31T00:00:00Z");
        this.required = isBoolean(required) ? required : false;
        this.safe = isBoolean(safe) ? safe : true;
        this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
        this.methods = methods || Methods;
        this.sanitize = isBoolean(sanitize) ? sanitize : true;
        this.normalize = isBoolean(normalize) ? normalize : false;
        this.validate = isBoolean(validate) ? validate : true;
        this.sanitizer = isFunction(sanitizer) ? sanitizer : null;
        this.normalizer = isFunction(normalizer) ? normalizer : null;
        this.validator = isFunction(validator) ? validator : null;
    }
    interval(val, type, integerDefault, dateDefault) {
        if (type === "date")
            return isDate(val) ? val : new Date(dateDefault);
        return (isNumber(val, true) && isInteger(val, true)) ? val : integerDefault;
    }
}

class Entity {
    constructor(name, properties) {
        this._name = name;
        this._properties = [];
        this._unsafeProps = [];
        for (const p of properties) {
            const prop = new Property(p.key, p.type, p.min, p.max, p.required, p.safe, p.typeCheck, p.methods, p.sanitize, p.normalize, p.validate, p.sanitizer, p.normalizer, p.validator);
            this._properties.push(prop);
            if (!prop.safe)
                this._unsafeProps.push(prop.key);
        }
    }
    get name() {
        return this._name;
    }
    get unsafeProps() {
        return this._unsafeProps;
    }
    get properties() {
        return this._properties;
    }
    set name(name) {
        if (!isString(name, "!0"))
            throw new Error('name must be a string of length > 0');
        this._name = name;
    }
    getProp(key) {
        return this.properties.find(p => p.key === key);
    }
    normalize(req, _res, next) {
        var _a;
        const rows = (_a = req.body) === null || _a === void 0 ? void 0 : _a.rows;
        if (!isArray(rows, "!0"))
            return next({ status: 400, msg: "Normalize: no rows found in request body" });
        for (const r of rows) {
            for (const { key, type, sanitize, normalize, sanitizer, normalizer, } of this.properties) {
                let v = r[key];
                if (v) {
                    if (sanitize) {
                        log.debug(`sanitize ${key}: ${type} = ${v}`);
                        v = this.sanitize(v, sanitizer);
                    }
                    if (normalize && isFunction(normalizer)) {
                        log.debug(`normalize ${key}: ${type} = ${v}`);
                        v = normalizer(v);
                    }
                    r[key] = v;
                }
            }
        }
        next();
    }
    validate(req, _res, next) {
        var _a;
        const rows = (_a = req.body) === null || _a === void 0 ? void 0 : _a.rows;
        const method = req.method;
        if (!isArray(rows, "!0"))
            return next({ status: 400, msg: "Sanitize: no rows found in request body" });
        if (!isIn(Methods, method))
            return next({
                status: 400,
                msg: `Invalid REST method. Received: ${method}. Must be one of: ${Methods.toString()}`
            });
        for (const r of rows) {
            for (const { key, type, min, max, required, typeCheck, methods, validate, validator } of this.properties) {
                const v = r[key];
                if (isIn(methods, method)) {
                    if (required) {
                        const rq = this.require(v, key, type);
                        if (rq)
                            return next(rq);
                    }
                    if (v && validate) {
                        const ct = this.control(v, key, type, min, max, typeCheck, validator);
                        if (ct)
                            return next(ct);
                    }
                }
            }
        }
        next();
    }
    require(v, key, type) {
        log.debug(`require ${key}: ${type} = ${v}`);
        return isNil(v) ? { status: 400, msg: `Missing ${key} of type ${type}` } : null;
    }
    control(v, key, type, min, max, typeCheck, cb) {
        log.debug(`control ${key}: ${type} = ${v}`);
        let val;
        if (cb)
            val = cb(v);
        else
            val = Types[type].validate(v, min, max, typeCheck);
        let c = "";
        if (!isNil(min))
            c += ` and >= ${min}`;
        if (!isNil(max))
            c += ` and <= ${max}`;
        return val ? null : { status: 400, msg: `Invalid ${key}, must be of type ${type}${c}` };
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
                    if (isString(o, "!0", null))
                        o = o.trim();
                }
            }
        }
        return v;
    }
}

export { Entity };
