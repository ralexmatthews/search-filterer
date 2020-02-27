"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const distance = (string1, string2) => {
    const a = string1.trim().toLowerCase();
    const b = string2.trim().toLowerCase();
    if (!a.length || !b.length) {
        return Infinity;
    }
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
    const aWords = a.split(" ");
    const bWords = b.split(" ");
    if (aWords.length > 1 || bWords.length > 1) {
        let subQueries = aWords.length >= bWords.length ? aWords : bWords;
        let score = Infinity;
        (aWords.length < bWords.length ? aWords : bWords).forEach(subTerm => {
            const subTermScores = subQueries.map(subQuery => ({
                v: subQuery,
                d: distance(subQuery, subTerm)
            }));
            const minValue = subTermScores.reduce((acc, obj) => (acc.d < obj.d ? acc : obj), subTermScores[0]);
            score = (minValue.d + (score !== Infinity ? score : minValue.d)) / 2;
            subQueries.splice(subQueries.indexOf(minValue.v), 1);
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
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }
    return d[a.length][b.length];
};
const coreSearch = (query, list) => list.map(item => ({
    v: item,
    d: distance(query, item)
}));
exports.search = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreSearch(query, list))
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.searchPreservingOrder = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return coreSearch(query, list)
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.vagueSearch = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreSearch(query, list))
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
exports.vagueSearchPreservingOrder = ramda_1.curry((query, list) => {
    if (!query) {
        return list;
    }
    return coreSearch(query, list)
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
const coreObjectSearch = (query, keys, list) => list.map(item => {
    const scores = keys
        .map(key => ramda_1.path(key.split("."), item))
        .filter(v => typeof v === "string")
        .map(term => distance(`${term}`, query));
    return {
        v: item,
        d: Math.min(...scores)
    };
});
exports.objectSearch = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.objectSearchPreservingOrder = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.vagueObjectSearch = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
exports.vagueObjectSearchPreservingOrder = ramda_1.curry((query, keys, list) => {
    if (!query) {
        return list;
    }
    return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
const coreGetterSearch = (query, getters, list) => list.map(item => {
    const scores = getters
        .map(getter => getter(item))
        .filter(v => typeof v === "string")
        .map(term => distance(term, query));
    return {
        v: item,
        d: Math.min(...scores)
    };
});
exports.searchUsingGetters = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.searchUsingGettersPreservingOrder = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 2)
        .map(({ v }) => v);
});
exports.vagueSearchUsingGetters = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ d }) => d, coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
exports.vagueSearchUsingGettersPreservingOrder = ramda_1.curry((query, getters, list) => {
    if (!query) {
        return list;
    }
    return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 3)
        .map(({ v }) => v);
});
