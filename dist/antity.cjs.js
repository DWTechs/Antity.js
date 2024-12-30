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

function isAscii(c, ext = true) {
    return isInteger(c, false) && ((ext && c >= 0 && c <= 255) || (c >= 0 && c <= 127));
}
function isInteger(n, type = true) {
    if (!isNumber(n, type))
        return false;
    const int = Number.parseInt(String(n), 10);
    return type ? n === int : n == int;
}
function isFloat(n, type = true) {
    if (isSymbol(n))
        return false;
    const modulo = n % 1 !== 0;
    return type ? (Number(n) === n && modulo) : (Number(n) == n && modulo);
}
function isEven(n, type = true) {
    return isInteger(n, type) && !(n & 1);
}
function isOdd(n, type = true) {
    return isInteger(n, type) && Boolean(n & 1);
}
function isOrigin(n, type = true) {
    return type ? n === 0 : n == 0;
}
function isPositive(n, type = true) {
    return isNumber(n, type) && n > 0;
}
function isNegative(n, type = true) {
    return isNumber(n, type) && n < 0;
}
function isPowerOfTwo(n, type = true) {
    return isInteger(n, type) && !isOrigin(n, type) && (n & (n - 1)) === 0;
}

function isValidNumber(n, min = -999999999, max = 999999999, type = true) {
    return isNumber(n, type) && n >= min && n <= max;
}
function isValidInteger(n, min = -999999999, max = 999999999, type = true) {
    return isInteger(n, type) && n >= min && n <= max;
}
function isValidFloat(n, min = -999999999.9, max = 999999999.9, type = true) {
    return isFloat(n, type) && n >= min && n <= max;
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
function isJson(s) {
    if (!isString(s))
        return false;
    try {
        JSON.parse(s);
    }
    catch (e) {
        return false;
    }
    return true;
}
function isRegex(r, type = true) {
    if (type)
        return r instanceof RegExp;
    try {
        new RegExp(r);
    }
    catch (e) {
        return false;
    }
    return true;
}
const emailReg = /^(?=[a-z0-9@.!$%&'*+\/=?^_‘{|}~-]{6,254}$)(?=[a-z0-9.!#$%&'*+\/=?^_‘{|}~-]{1,64}@)[a-z0-9!#$%&'*+\/=?^‘{|}~]+(?:[\._-][a-z0-9!#$%&'*+\/=?^‘{|}~]+)*@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?=[a-z0-9-]{2,63}$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
function isEmail(e) {
    return !isSymbol(e) && emailReg.test(String(e).toLowerCase());
}
const ipReg = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
function isIpAddress(i) {
    return !isSymbol(i) && ipReg.test(i);
}
const b64Reg = /^[A-Za-z0-9\-_]+={0,2}$/;
function isJWT(t) {
    if (!isString(t))
        return false;
    const p = t.split('.');
    if (p.length !== 3)
        return false;
    const header = p[0];
    const payload = p[1];
    const signature = p[3];
    if (b64Reg.test(header) && b64Reg.test(payload) && b64Reg.test(signature)) {
        try {
            return isJson(atob(header)) && isJson(atob(payload));
        }
        catch (e) {
            return false;
        }
    }
    return false;
}
const slugReg = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;
function isSlug(s) {
    return isString(s) && slugReg.test(s);
}
const hexadecimal = /^(#|0x|0h)?[0-9A-F]+$/i;
function isHexadecimal(s) {
    return isString(s) && hexadecimal.test(s);
}

function isObject(o, empty = false) {
    return o !== null && typeof o === "object" && !isArray(o) && (empty ? !!Object.keys(o).length : true);
}
function isProperty(val, obj) {
    const v = String(val);
    return isString(v, true) && isObject(obj) ? Object.keys(obj).includes(v) : false;
}

function isHtmlElement(h) {
    return Boolean(typeof HTMLElement === "object"
        ? h instanceof HTMLElement
        : h &&
            typeof h === "object" &&
            h.nodeType === 1 &&
            typeof h.nodeName === "string");
}
function isHtmlEventAttribute(h) {
    switch (h) {
        case "onafterprint":
        case "onbeforeprint":
        case "onbeforeunload":
        case "onerror":
        case "onhashchange":
        case "onload":
        case "onmessage":
        case "onoffline":
        case "ononline":
        case "onpagehide":
        case "onpageshow":
        case "onpopstate":
        case "onresize":
        case "onstorage":
        case "onunload":
        case "onblur":
        case "onchange":
        case "oncontextmenu":
        case "onfocus":
        case "oninput":
        case "oninvalid":
        case "onreset":
        case "onsearch":
        case "onselect":
        case "onsubmit":
        case "onkeydown":
        case "onkeypress":
        case "onkeyup":
        case "onclick":
        case "ondblclick":
        case "onmousedown":
        case "onmousemove":
        case "onmouseout":
        case "onmouseover":
        case "onmouseup":
        case "onmousewheel":
        case "onwheel":
        case "ondrag":
        case "ondragend":
        case "ondragenter":
        case "ondragleave":
        case "ondragover":
        case "ondragstart":
        case "ondrop":
        case "onscroll":
        case "oncopy":
        case "oncut":
        case "onpaste":
        case "onabort":
        case "oncanplay":
        case "oncanplaythrough":
        case "oncuechange":
        case "ondurationchange":
        case "onemptied":
        case "onended":
        case "onerror":
        case "onloadeddata":
        case "onloadedmetadata":
        case "onloadstart":
        case "onpause":
        case "onplay":
        case "onplaying":
        case "onprogress":
        case "onratechange":
        case "onseeked":
        case "onseeking":
        case "onstalled":
        case "onsuspend":
        case "ontimeupdate":
        case "onvolumechange":
        case "onwaiting":
        case "ontoggle":
            return true;
        default:
            return false;
    }
}
function isNode(n) {
    return Boolean(typeof Node === "object"
        ? n instanceof Node
        : n &&
            typeof n === "object" &&
            typeof n.nodeType === "number" &&
            typeof n.nodeName === "string");
}

function isDate(d) {
    return !isNaN(d) && d instanceof Date;
}
const minDate = new Date('1/1/1900');
const maxDate = new Date('1/1/2200');
function isValidDate(d, min = minDate, max = maxDate) {
    return isDate(d) && d >= min && d <= max;
}
function isTimestamp(t, type = true) {
    return isInteger(t, type) && isNumeric(new Date(parseInt(t + '')).getTime());
}
function isValidTimestamp(t, min = -2208989361000, max = 7258114800000, type = true) {
    return isTimestamp(t, type) && t >= min && t <= max;
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

exports.Entity = Entity;
