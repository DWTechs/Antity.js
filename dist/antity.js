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

import { isBoolean, isStringOfLength, isValidNumber, isValidInteger, isArrayOfLength, isNil, isString, isProperty, isArray, isIn, isInteger, isFunction, isObject } from '@dwtechs/checkard';

const Verbs = ["GET", "PATCH", "PUT", "POST", "DELETE"];

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
    constructor(key, type, min, max, required, typeCheck, verbs, sanitize, normalize, control, sanitizer, normalizer, controller) {
        if (!isString(key, true))
            throw new Error(`Property key must be a string. Received ${key}`);
        if (!isProperty(type, Types))
            throw new Error(`Property type must be a valid type. Received ${type}`);
        if (isArray(verbs)) {
            for (const v of verbs) {
                if (!isIn(v, Verbs))
                    throw new Error(`Property verbs must be an array of REST Verbs. Received ${v}`);
            }
        }
        this.key = key;
        this.type = type;
        this.min = isInteger(min, true) ? min : 0;
        this.max = isInteger(max, true) ? max : 999999999;
        this.required = isBoolean(required) ? required : false;
        this.typeCheck = isBoolean(typeCheck) ? typeCheck : false;
        this.verbs = verbs || Verbs;
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
    constructor(name, properties) {
        this.name = name;
        this.properties = this.init(properties);
    }
    init(properties) {
        const props = [];
        for (const p of properties) {
            props.push(new Property(p.key, p.type, p.min, p.max, p.required, p.typeCheck, p.verbs, p.sanitize, p.normalize, p.control, p.sanitizer, p.normalizer, p.controller));
        }
        return props;
    }
    validate(rows, verb) {
        for (const r of rows) {
            for (const { key, type, min, max, required, typeCheck, verbs, sanitize, normalize, control, sanitizer, normalizer, controller } of this.properties) {
                const v = r[key];
                if (verb && isIn(verb, verbs)) {
                    if (sanitize)
                        r[key] = this.sanitize(v, sanitizer);
                    if (normalize && normalizer)
                        r[key] = this.normalize(v, normalizer);
                    if (required)
                        return this.require(v, key);
                    if (control)
                        return this.control(v, key, type, min, max, typeCheck, controller);
                }
            }
        }
        return null;
    }
    require(v, key) {
        return Required.validate(v) ? Messages.missing(key) : null;
    }
    control(v, key, type, min, max, typeCheck, cb) {
        if (cb)
            return !cb(v) ? Messages.invalid(key, type) : null;
        return !Types[type].validate(v, min, max, typeCheck) ? Messages.invalid(key, type) : null;
    }
    normalize(v, cb) {
        return cb ? cb(v) : v;
    }
    sanitize(v, cb) {
        if (cb)
            return cb(v);
        if (isArray(v, null, null))
            for (let d of v) {
                d = this.trim(d);
            }
        else
            v = this.trim(v);
        return v;
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
