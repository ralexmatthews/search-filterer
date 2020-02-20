"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var distance = ramda_1.memoizeWith(function (string1, string2, vague) {
    return string1.length > string2.length
        ? "" + string1 + string2 + vague
        : "" + string2 + string1 + vague;
}, function (string1, string2, vague) {
    if (!string1.length || !string2.length) {
        return 0;
    }
    var a = string1.trim();
    var b = string2.trim();
    if (a === b) {
        return -2;
    }
    if (vague) {
        var split1 = a.split(" ");
        var split2 = b.split(" ");
        if (split1.length > 1 && split2.length === split1.length) {
            return ramda_1.mean(ramda_1.zip(split1, split2).map(function (v) { return distance.apply(void 0, v); }));
        }
    }
    if (a.length > b.length) {
        if (a.substr(0, b.length) === b) {
            return -1;
        }
        if (!!a.match(b)) {
            return 0;
        }
    }
    else if (b.length > a.length) {
        if (b.substr(0, a.length) === a) {
            return -1;
        }
        if (!!b.match(a)) {
            return 0;
        }
    }
    var d = [];
    for (var i = 0; i <= a.length; i++) {
        d.push([i]);
    }
    for (var j = 0; j <= b.length; j++) {
        d[0][j] = j;
    }
    for (var i = 1; i <= a.length; i++) {
        for (var j = 1; j <= b.length; j++) {
            var cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = ramda_1.min(ramda_1.min(d[i - 1][j] + 1, d[i][j - 1] + 1), d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = ramda_1.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }
    return d[a.length][b.length];
});
var coreSearch = function (query, list, vague) {
    return list.map(function (v) { return ({ v: v, d: distance(query, v, vague) }); });
};
exports.search = ramda_1.curry(function (query, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreSearch(query, list))
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.searchPreservingOrder = ramda_1.curry(function (query, list) {
    if (!query) {
        return list;
    }
    return coreSearch(query, list)
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueSearch = ramda_1.curry(function (query, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreSearch(query, list, true))
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueSearchPreservingOrder = ramda_1.curry(function (query, list) {
    if (!query) {
        return list;
    }
    return coreSearch(query, list, true)
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
var coreObjectSearch = function (query, keys, list, vague) {
    return list.map(function (item) { return ({
        v: item,
        d: ramda_1.xprod(query.split(" "), keys.map(function (key) { return ramda_1.path(key.split("."), item); }))
            .map(function (_a) {
            var q = _a[0], v = _a[1];
            return distance(q, "" + v, vague);
        })
            .reduce(ramda_1.min, Infinity)
    }); });
};
exports.objectSearch = ramda_1.curry(function (query, keys, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreObjectSearch(query, keys, list))
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.objectSearchPreservingOrder = ramda_1.curry(function (query, keys, list) {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list)
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueObjectSearch = ramda_1.curry(function (query, keys, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreObjectSearch(query, keys, list, true))
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueObjectSearchPreservingOrder = ramda_1.curry(function (query, keys, list) {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list, true)
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
var coreGetterSearch = function (query, getters, list, vague) {
    return list.map(function (item) { return ({
        v: item,
        d: ramda_1.xprod(query.split(" "), getters.map(function (getter) { return getter(item); }))
            .map(function (_a) {
            var q = _a[0], v = _a[1];
            return distance(q, "" + v, vague);
        })
            .reduce(ramda_1.min, Infinity)
    }); });
};
exports.searchUsingGetters = ramda_1.curry(function (query, getters, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreGetterSearch(query, getters, list))
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.searchUsingGettersPreservingOrder = ramda_1.curry(function (query, getters, list) {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list)
        .filter(function (_a) {
        var d = _a.d;
        return d < 2;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueSearchUsingGetters = ramda_1.curry(function (query, getters, list) {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreGetterSearch(query, getters, list, true))
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
exports.vagueSearchUsingGettersPreservingOrder = ramda_1.curry(function (query, getters, list) {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list, true)
        .filter(function (_a) {
        var d = _a.d;
        return d < 3;
    })
        .map(ramda_1.prop("v"));
});
