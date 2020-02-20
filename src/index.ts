import {
  curry,
  mean,
  memoizeWith,
  min,
  path,
  prop,
  sortBy,
  xprod,
  zip
} from "ramda";

const distance: (a: string, b: string, vague?: boolean) => number = memoizeWith(
  (string1: string, string2: string, vague?: boolean) =>
    string1.length > string2.length
      ? `${string1}${string2}${vague}`
      : `${string2}${string1}${vague}`,
  (string1: string, string2: string, vague?: boolean) => {
    if (!string1.length || !string2.length) {
      return 0;
    }
    const a = string1.trim();
    const b = string2.trim();

    if (a === b) {
      return -2;
    }

    if (vague) {
      const split1 = a.split(" ");
      const split2 = b.split(" ");
      if (split1.length > 1 && split2.length === split1.length) {
        return mean(zip(split1, split2).map(v => distance(...v)));
      }
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

    return d[a.length][b.length];
  }
);

const coreSearch = (query: string, list: string[], vague?: boolean) =>
  list.map(v => ({ v, d: distance(query, v, vague) }));

export const search = curry((query: string, list: string[]) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreSearch(query, list))
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});

export const searchPreservingOrder = curry((query: string, list: string[]) => {
  if (!query) {
    return list;
  }
  return coreSearch(query, list)
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});

export const vagueSearch = curry((query: string, list: string[]) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreSearch(query, list, true))
    .filter(({ d }) => d < 3)
    .map(prop("v"));
});

export const vagueSearchPreservingOrder = curry(
  (query: string, list: string[]) => {
    if (!query) {
      return list;
    }
    return coreSearch(query, list, true)
      .filter(({ d }) => d < 3)
      .map(prop("v"));
  }
);

const coreObjectSearch = <T>(
  query: string,
  keys: string[],
  list: T[],
  vague?: boolean
) =>
  list.map(item => ({
    v: item,
    d: xprod(
      query.split(" "),
      keys.map(key => path(key.split("."), item))
    )
      .map(([q, v]) => distance(q, `${v}`, vague))
      .reduce(min, Infinity)
  }));

export const objectSearch = curry(
  <T>(query: string, keys: string[], list: T[]) => {
    if (!query) {
      return list;
    }
    return sortBy(prop("d"), coreObjectSearch(query, keys, list))
      .filter(({ d }) => d < 2)
      .map(prop("v"));
  }
);

export const objectSearchPreservingOrder = curry(
  <T>(query: string, keys: string[], list: T[]) => {
    if (!query) {
      return list;
    }
    return coreObjectSearch(query, keys, list)
      .filter(({ d }) => d < 2)
      .map(prop("v"));
  }
);

export const vagueObjectSearch = curry(
  <T>(query: string, keys: string[], list: T[]) => {
    if (!query) {
      return list;
    }
    return sortBy(prop("d"), coreObjectSearch(query, keys, list, true))
      .filter(({ d }) => d < 3)
      .map(prop("v"));
  }
);

export const vagueObjectSearchPreservingOrder = curry(
  <T>(query: string, keys: string[], list: T[]) => {
    if (!query) {
      return list;
    }
    return coreObjectSearch(query, keys, list, true)
      .filter(({ d }) => d < 3)
      .map(prop("v"));
  }
);

const coreGetterSearch = <T>(
  query: string,
  getters: Function[],
  list: T[],
  vague?: boolean
) =>
  list.map(item => ({
    v: item,
    d: xprod(
      query.split(" "),
      getters.map(getter => getter(item))
    )
      .map(([q, v]) => distance(q, `${v}`, vague))
      .reduce(min, Infinity)
  }));

export const searchUsingGetters = curry(
  <T>(query: string, getters: Function[], list: T[]) => {
    if (!query) {
      return list;
    }
    return sortBy(prop("d"), coreGetterSearch(query, getters, list))
      .filter(({ d }) => d < 2)
      .map(prop("v"));
  }
);

export const searchUsingGettersPreservingOrder = curry(
  <T>(query: string, getters: Function[], list: T[]) => {
    if (!query) {
      return list;
    }
    return coreGetterSearch(query, getters, list)
      .filter(({ d }) => d < 2)
      .map(prop("v"));
  }
);

export const vagueSearchUsingGetters = curry(
  <T>(query: string, getters: Function[], list: T[]) => {
    if (!query) {
      return list;
    }
    return sortBy(prop("d"), coreGetterSearch(query, getters, list, true))
      .filter(({ d }) => d < 3)
      .map(prop("v"));
  }
);

export const vagueSearchUsingGettersPreservingOrder = curry(
  <T>(query: string, getters: Function[], list: T[]) => {
    if (!query) {
      return list;
    }
    return coreGetterSearch(query, getters, list, true)
      .filter(({ d }) => d < 3)
      .map(prop("v"));
  }
);
