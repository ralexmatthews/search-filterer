const {
  curry,
  mean,
  memoizeWith,
  min,
  path,
  prop,
  sortBy,
  xprod,
  zip
} = require("ramda");

const distance = curry(
  memoizeWith(
    (string1, string2) =>
      string1.length > string2.length
        ? `${string1}${string2}`
        : `${string2}${string1}`,
    (a, b) => {
      if (!a.length || !b.length) {
        return 0;
      }
      const string1 = a.trim();
      const string2 = b.trim();

      if (string1 === string2) {
        return -2;
      }

      const split1 = string1.split(" ");
      const split2 = string2.split(" ");
      if (split1.length > 1 && split2.length === split1.length) {
        return mean(zip(split1, split2).map(v => distance(...v)));
      }

      if (string1.length > string2.length) {
        if (string1.substr(0, string2.length) === string2) {
          return -1;
        }
        if (string1.includes(string2)) {
          return 0;
        }
      } else if (string2.length > string1.length) {
        if (string2.substr(0, string1.length) === string1) {
          return -1;
        }
        if (string2.includes(string1)) {
          return 0;
        }
      }

      const d = [];

      for (let i = 0; i <= string1.length; i++) {
        d.push([i]);
      }

      for (let j = 0; j <= string2.length; j++) {
        d[0][j] = j;
      }

      for (let i = 1; i <= string1.length; i++) {
        for (let j = 1; j <= string2.length; j++) {
          const cost = string1[i] === string2[j] ? 0 : 1;

          d[i][j] = min(
            min(d[i - 1][j] + 1, d[i][j - 1] + 1),
            d[i - 1][j - 1] + cost
          );

          if (
            i > 1 &&
            j > 1 &&
            string1[i] === string2[j - 1] &&
            string1[i - 1] === string2[j]
          ) {
            d[i][j] = min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }

      return d[string1.length][string2.length];
    }
  )
);

const coreSearch = (query, list) =>
  list.map(v => ({ v, d: distance(query, v) }));

export const search = curry((query, list) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreSearch(query, list))
    .filter(({ d }) => d < 1)
    .map(prop("v"));
});

export const searchPreservingOrder = curry((query, list) => {
  if (!query) {
    return list;
  }
  return coreSearch(query, list)
    .filter(({ d }) => d < 1)
    .map(prop("v"));
});

export const vagueSearch = curry((query, list) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreSearch(query, list))
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});

export const vagueSearchPreservingOrder = curry((query, list) => {
  if (!query) {
    return list;
  }
  return coreSearch(query, list)
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});

const coreObjectSearch = (query, keys, list) =>
  list.map(item => ({
    v: item,
    d: xprod(
      query.split(" "),
      keys.map(key => path(key.split("."), item))
    )
      .map(([q, v]) => distance(q, v))
      .reduce(min, Infinity)
  }));

export const objectSearch = curry((query, keys, list) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreObjectSearch(query, keys, list))
    .filter(({ d }) => d < 1)
    .map(prop("v"));
});

export const objectSearchPreservingOrder = curry((query, keys, list) => {
  if (!query) {
    return list;
  }
  return coreObjectSearch(query, keys, list)
    .filter(({ d }) => d < 1)
    .map(prop("v"));
});

export const vagueObjectSearch = curry((query, keys, list) => {
  if (!query) {
    return list;
  }
  return sortBy(prop("d"), coreObjectSearch(query, keys, list))
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});

export const vagueObjectSearchPreservingOrder = curry((query, keys, list) => {
  if (!query) {
    return list;
  }
  return coreObjectSearch(query, keys, list)
    .filter(({ d }) => d < 2)
    .map(prop("v"));
});
