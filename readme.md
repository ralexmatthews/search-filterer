# search-filterer

A fuzzy search library using a slightly tweaked Damerau–Levenshtein distance algorithm. To see it in action before downloading, feel free to visit the [example page](https://amatthews4851.github.io/search-filterer/)

## Installation

To install, use your package manager of choice:

```shell
yarn add search-filterer
```

```shell
npm install --save search-filterer
```

## Exports

All functions listed here are curried and are named exports. They will return a new list consisting of items in the `list` that passed the checks. To use, simply

```ts
import { search, objectSearch } from "search-filterer";

const myList = ["foo", "bar", "baz"];

const results = search("bar", myList); // ["bar", "baz"]

const myListOfObjects = [
  { foo: "dog", bar: { baz: "cat" } },
  { foo: "mouse", bar: { baz: "hamster" } }
];

const objectResults = objectSearch(
  "hamster",
  ["foo", "bar.baz"],
  myListOfObjects
); // [{foo: "mouse", bar: {baz: "hamster"}}]
```

---

```ts
type search = (query: string, list: [string]) => [string];
```

Just a standard search. Takes a string query and a list of strings and returns a list strings, filtered down to strings that are one mutation or less away from containing the query.

---

```ts
type vagueSearch = (query: string, list: [string]) => [string];
```

Just like the `search()` function but a bit looser on what is accepted

---

```ts
type objectSearch<T> = (query: string, keys: [string], list: [T]) => [T];
```

Searches the `list` of objects using the arrays of `keys`, matching the, with the `query`. You can supply a key like `"foo"` to look for the value of `list[0]?.foo`, or supply a path using dot syntax like `"foo.bar.baz"` to search `list[0]?.foo?.bar?.baz`.

---

```ts
type vagueObjectSearch<T> = (query: string, keys: [string], list: [T]) => [T];
```

Exactly the same as `objectSearch()` except looser on what is accepted

---

```ts
type searchWithGetters<T> = (
  query: string,
  getters: [(item: T) => string],
  list: [T]
) => [T];
```

Searches the `list` of objects using the arrays of `getters`, matching the, with the `query`. This is similar to the object search, but you can use your own function to get the values out of the item. This allows for custom data structures to be used in the list.

---

```ts
type searchWithGetters<T> = (
  query: string,
  getters: [(item: T) => string],
  list: [T]
) => [T];
```

Exactly the same as `searchWithGetters()` except looser on what is accepted

---

`searchPreservingOrder()`, `vagueSearchPreservingOrder()`, `objectSearchPreservingOrder()`, `vagueObjectSearchPreservingOrder()`, `searchWithGettersPreservingOrder()`, `searchWithGettersPreservingOrder()` are all the same as their base functions, but the list returned preserves the same order as the `list` argument that was passed in.
