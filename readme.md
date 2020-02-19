# Fuzzy Search

A fuzzy search library using a slightly tweaked Damerau–Levenshtein distance algorithm

## Exports

All functions listed here are curried and memoized. They will return a new list consisting of items in the `list` that passed the checks.

### `search()`

```ts
type search = (query: string, list: [string]) => [string];
```

Just a standard search. Takes a string query and a list of strings and returns a list strings, filtered down to strings that are one mutation or less away from containing the query.

### `vagueSearch()`

```ts
type vagueSearch = (query: string, list: [string]) => [string];
```

Just like the `search()` function but a bit looser on what is accepted

### `objectSearch()`

```ts
type objectSearch<T> = (query: string, keys: [string], list: [T]) => [T];
```

Searches the `list` of objects using the arrays of `keys`, matching the, with the `query`. You can supply a key like `"foo"` to look for the value of `list[0]?.foo`, or supply a path using dot syntax like `"foo.bar.baz"` to search `list[0]?.foo?.bar?.baz`.

### `vagueObjectSearch()`

```ts
type objectSearch<T> = (query: string, keys: [string], list: [T]) => [T];
```

Exactly the same as `objectSearch()` except looser on what is accepted

### `searchPreservingOrder()` | `vagueSearchPreservingOrder()` | `objectSearchPreservingOrder()` | `vagueObjectSearchPreservingOrder()`

These are all the same as their base functions, but the list returned preserves the same order as the `list` argument that was passed in.
