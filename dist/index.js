"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const distance = (() => {
    const cache = {};
    return (string1, string2) => {
        const cacheKey = string1.length > string2.length
            ? `string1:${string1} --- string2:${string2}`
            : `string1:${string2} --- string2:${string1}`;
        if (cacheKey in cache) {
            return cache[cacheKey];
        }
        if (!string1.length || !string2.length) {
            return 0;
        }
        const a = string1.trim().toLowerCase();
        const b = string2.trim().toLowerCase();
        if (a === b) {
            return -2;
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
        if (a.split(" ").length > 1 && b.split(" ").length > 1) {
            let subQueries = b.split(" ");
            let score = Infinity;
            a.split(" ").forEach(subTerm => {
                const subTermScores = subQueries.map(subQuery => ({
                    v: subQuery,
                    d: distance(subQuery, subTerm)
                }));
                const minValue = subTermScores.reduce((acc, obj) => (acc.d < obj.d ? acc : obj), subTermScores[0]);
                score = ramda_1.mean([minValue.d].concat(score !== Infinity ? score : minValue.d));
                subQueries = subQueries.filter(item => item !== minValue.v);
            });
            return score;
        }
        const d = [];
        for (let i = 0; i <= a.length; i++) {
            d.push([i]);
        }
        for (let j = 0; j <= b.length; j++) {
            d[0][j] = j;
        }
        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                d[i][j] = ramda_1.min(ramda_1.min(d[i - 1][j] + 1, d[i][j - 1] + 1), d[i - 1][j - 1] + cost);
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                    d[i][j] = ramda_1.min(d[i][j], d[i - 2][j - 2] + 1);
                }
            }
        }
        cache[cacheKey] = d[a.length][b.length];
        return d[a.length][b.length];
    };
})();
const coreSearch = (query, list) => list.map(item => ({
    v: item,
    d: distance(query, item)
}));
exports.search = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreSearch(query, list))
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.searchPreservingOrder = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return coreSearch(query, list)
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.vagueSearch = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreSearch(query, list))
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
exports.vagueSearchPreservingOrder = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return coreSearch(query, list)
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
const coreObjectSearch = (query, keys, list) => list.map(item => {
    const scores = keys
        .map(key => ramda_1.path(key.split("."), item))
        .filter(ramda_1.complement(ramda_1.isNil))
        .map(term => {
        if (typeof term !== "string") {
            return 0;
        }
        return distance(term, query);
    });
    return {
        v: item,
        d: scores.reduce(ramda_1.min, Infinity)
    };
});
exports.objectSearch = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.objectSearchPreservingOrder = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.vagueObjectSearch = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
exports.vagueObjectSearchPreservingOrder = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
const coreGetterSearch = (query, getters, list) => list.map(item => {
    const scores = getters
        .map(getter => getter(item))
        .filter(ramda_1.complement(ramda_1.isNil))
        .map(term => {
        if (typeof term !== "string") {
            return 0;
        }
        return distance(term, query);
    });
    return {
        v: item,
        d: scores.reduce(ramda_1.min, Infinity)
    };
});
exports.searchUsingGetters = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.searchUsingGettersPreservingOrder = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 2)
        .map(ramda_1.prop("v"));
});
exports.vagueSearchUsingGetters = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(ramda_1.prop("d"), coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
exports.vagueSearchUsingGettersPreservingOrder = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 3)
        .map(ramda_1.prop("v"));
});
