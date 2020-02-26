import {
  curry,
  mean,
  min,
  path,
  prop,
  sortBy,
  zip,
  complement,
  isNil,
  memoizeWith
} from "ramda";

const distance: (a: string, b: string) => number = (() => {
  const cache: { [key: string]: number } = {};

  return (string1: string, string2: string) => {
    const cacheKey =
      string1.length > string2.length
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
    } else if (b.length > a.length) {
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
        const minValue = subTermScores.reduce(
          (acc, obj) => (acc.d < obj.d ? acc : obj),
          subTermScores[0]
        );
        score = mean(
          [minValue.d].concat(score !== Infinity ? score : minValue.d)
        );
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

        d[i][j] = min(
          min(d[i - 1][j] + 1, d[i][j - 1] + 1),
          d[i - 1][j - 1] + cost
        );

        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }

    cache[cacheKey] = d[a.length][b.length];
    return d[a.length][b.length];
  };
})();

const coreSearch = (query: string, list: string[]) =>
  list.map(item => ({
    v: item,
    d: distance(query, item)
  }));

export const search = curry(
  memoizeWith(
    (query: string, list: string[]) => `${query} --- ${JSON.stringify(list)}`,
    (query: string, list: string[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreSearch(query, list))
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const searchPreservingOrder = curry(
  memoizeWith(
    (query: string, list: string[]) => `${query} --- ${JSON.stringify(list)}`,
    (query: string, list: string[]) => {
      if (!query) {
        return list;
      }
      return coreSearch(query, list)
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const vagueSearch = curry(
  memoizeWith(
    (query: string, list: string[]) => `${query} --- ${JSON.stringify(list)}`,
    (query: string, list: string[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreSearch(query, list))
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);

export const vagueSearchPreservingOrder = curry(
  memoizeWith(
    (query: string, list: string[]) => `${query} --- ${JSON.stringify(list)}`,
    (query: string, list: string[]) => {
      if (!query) {
        return list;
      }
      return coreSearch(query, list)
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);

const coreObjectSearch = <T>(query: string, keys: string[], list: T[]) =>
  list.map(item => {
    const scores = keys
      .map(key => path(key.split("."), item))
      .filter(complement(isNil))
      .map(term => {
        if (typeof term !== "string") {
          return 0;
        }

        return distance(term, query);
      });
    return {
      v: item,
      d: scores.reduce(min, Infinity)
    };
  });

export const objectSearch = curry(
  memoizeWith(
    <T>(query: string, keys: string[], list: T[]) =>
      `${query} --- ${JSON.stringify(keys)} --- ${JSON.stringify(list)}`,
    <T>(query: string, keys: string[], list: T[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const objectSearchPreservingOrder = curry(
  memoizeWith(
    <T>(query: string, keys: string[], list: T[]) =>
      `${query} --- ${JSON.stringify(keys)} --- ${JSON.stringify(list)}`,
    <T>(query: string, keys: string[], list: T[]) => {
      if (!query) {
        return list;
      }
      return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const vagueObjectSearch = curry(
  memoizeWith(
    <T>(query: string, keys: string[], list: T[]) =>
      `${query} --- ${JSON.stringify(keys)} --- ${JSON.stringify(list)}`,
    <T>(query: string, keys: string[], list: T[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreObjectSearch(query, keys, list))
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);

export const vagueObjectSearchPreservingOrder = curry(
  memoizeWith(
    <T>(query: string, keys: string[], list: T[]) =>
      `${query} --- ${JSON.stringify(keys)} --- ${JSON.stringify(list)}`,
    <T>(query: string, keys: string[], list: T[]) => {
      if (!query) {
        return list;
      }
      return coreObjectSearch(query, keys, list)
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);

const coreGetterSearch = <T>(query: string, getters: Function[], list: T[]) =>
  list.map(item => {
    const scores = getters
      .map(getter => getter(item))
      .filter(complement(isNil))
      .map(term => {
        if (typeof term !== "string") {
          return 0;
        }

        return distance(term, query);
      });
    return {
      v: item,
      d: scores.reduce(min, Infinity)
    };
  });

export const searchUsingGetters = curry(
  memoizeWith(
    <T>(query: string, getters: Function[], list: T[]) =>
      `${query} --- ${JSON.stringify(
        getters.map(v => v.name || Math.random())
      )} --- ${JSON.stringify(list)}`,
    <T>(query: string, getters: Function[], list: T[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const searchUsingGettersPreservingOrder = curry(
  memoizeWith(
    <T>(query: string, getters: Function[], list: T[]) =>
      `${query} --- ${JSON.stringify(
        getters.map(v => v.name || Math.random())
      )} --- ${JSON.stringify(list)}`,
    <T>(query: string, getters: Function[], list: T[]) => {
      if (!query) {
        return list;
      }
      return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 2)
        .map(prop("v"));
    }
  )
);

export const vagueSearchUsingGetters = curry(
  memoizeWith(
    <T>(query: string, getters: Function[], list: T[]) =>
      `${query} --- ${JSON.stringify(
        getters.map(v => v.name || Math.random())
      )} --- ${JSON.stringify(list)}`,
    <T>(query: string, getters: Function[], list: T[]) => {
      if (!query) {
        return list;
      }
      return sortBy(prop("d"), coreGetterSearch(query, getters, list))
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);

export const vagueSearchUsingGettersPreservingOrder = curry(
  memoizeWith(
    <T>(query: string, getters: Function[], list: T[]) =>
      `${query} --- ${JSON.stringify(
        getters.map(v => v.name || Math.random())
      )} --- ${JSON.stringify(list)}`,
    <T>(query: string, getters: Function[], list: T[]) => {
      if (!query) {
        return list;
      }
      return coreGetterSearch(query, getters, list)
        .filter(({ d }) => d < 3)
        .map(prop("v"));
    }
  )
);
