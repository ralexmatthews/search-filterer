"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const distance = (string1, string2) => {
    const a = string1
        .trim()
        .toLowerCase()
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const b = string2
        .trim()
        .toLowerCase()
        .replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
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
        (aWords.length < bWords.length ? aWords : bWords).forEach((subTerm) => {
            const subTermScores = subQueries.map((subQuery) => ({
                v: subQuery,
                d: distance(subQuery, subTerm),
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
const scoreListOfStrings = (query, list) => list.map((item) => ({
    item,
    distance: distance(query, item),
}));
/** For taking 1 item, 1 path, and returning an array of strings to score */
const getListOfItemsToScore = (item, path) => {
    if (path.length === 0) {
        return [];
    }
    if (path.length === 1) {
        const newItem = item[path[0]];
        if (Array.isArray(newItem)) {
            if (typeof newItem[0] !== "string") {
                return [];
            }
            return newItem;
        }
        if (typeof newItem !== "string") {
            return [];
        }
        return [newItem];
    }
    const newItem = item[path[0]];
    return Array.isArray(newItem)
        ? newItem.reduce((totalArray, subItem) => totalArray.concat(getListOfItemsToScore(subItem, path.slice(1))), [])
        : getListOfItemsToScore(newItem, path.slice(1));
};
const scoreListOfObjectsWithKeys = (query, keys, list) => list.map((item) => ({
    item,
    distance: Math.min(...keys.map((key) => {
        const itemsToScore = getListOfItemsToScore(item, key.split("."));
        return Math.min(...itemsToScore.map((subItem) => distance(query, subItem)));
    })),
}));
const isArray = (arg) => Array.isArray(arg);
const scoreListOfObjectsWithGetters = (query, getters, list) => list.map((item) => ({
    item,
    distance: Math.min(...getters.map((getter) => {
        const itemsToScore = getter(item);
        if (!itemsToScore) {
            return Infinity;
        }
        if (isArray(itemsToScore)) {
            return itemsToScore[0]
                ? Math.min(...itemsToScore
                    .filter(Boolean)
                    .map((subItem) => distance(query, subItem)))
                : Infinity;
        }
        else {
            return distance(query, itemsToScore);
        }
    })),
}));
exports.search = (query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfStrings(query, list))
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.searchPreservingOrder = (query, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfStrings(query, list)
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.vagueSearch = (query, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfStrings(query, list))
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
exports.vagueSearchPreservingOrder = (query, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfStrings(query, list)
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
exports.objectSearch = (query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfObjectsWithKeys(query, keys, list))
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.objectSearchPreservingOrder = (query, keys, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfObjectsWithKeys(query, keys, list)
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.vagueObjectSearch = (query, keys, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfObjectsWithKeys(query, keys, list))
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
exports.vagueObjectSearchPreservingOrder = (query, keys, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfObjectsWithKeys(query, keys, list)
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
exports.searchUsingGetters = (query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfObjectsWithGetters(query, getters, list))
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.searchUsingGettersPreservingOrder = (query, getters, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfObjectsWithGetters(query, getters, list)
        .filter(({ distance }) => distance < 2)
        .map(({ item }) => item);
};
exports.vagueSearchUsingGetters = (query, getters, list) => {
    if (!query) {
        return list;
    }
    return ramda_1.sortBy(({ distance }) => distance, scoreListOfObjectsWithGetters(query, getters, list))
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
exports.vagueSearchUsingGettersPreservingOrder = (query, getters, list) => {
    if (!query) {
        return list;
    }
    return scoreListOfObjectsWithGetters(query, getters, list)
        .filter(({ distance }) => distance < 3)
        .map(({ item }) => item);
};
