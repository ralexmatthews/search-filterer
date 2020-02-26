const {
  search,
  searchPreservingOrder,
  vagueSearch,
  vagueSearchPreservingOrder,
  objectSearch,
  objectSearchPreservingOrder,
  vagueObjectSearch,
  vagueObjectSearchPreservingOrder,
  searchUsingGetters,
  searchUsingGettersPreservingOrder,
  vagueSearchUsingGetters,
  vagueSearchUsingGettersPreservingOrder
} = require("../dist");
const data = require("./__mocks__/data");

describe("search", () => {
  it("should provide the whole list if no query", () => {
    const results = search("", data.stringList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = search("rub", data.stringList);
    expect(results.indexOf("rub")).toBeLessThan(results.indexOf("tub"));
  });

  it("should filter some items if a query is provided", () => {
    const results = search("mom", data.stringList);
    expect(results.length).toBeLessThan(data.stringList.length);
  });

  it("should find exact matches", () => {
    const results = search("mom", data.stringList);
    expect(results.includes("mom") && results.includes("momentous")).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = search("tub", data.stringList);
    expect(results.includes("rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = search("mom", data.stringList);
    expect(results.includes("fax")).toBe(false);
  });

  it("should find strings with more than one word", () => {
    const results = search("mom", data.multiwordString);
    expect(
      results.includes("mom woebegone") && results.includes("momentous bathe")
    ).toBe(true);
  });

  it("should find strings with more than one word when out of order", () => {
    const results = search("mom", data.multiwordString);
    expect(
      results.includes("null mom") && results.includes("shiny momentous")
    ).toBe(true);
  });

  it("should find strings with more than one word and queries have more than one word", () => {
    const results = search("mom bathe", data.multiwordString);
    expect(results.includes("momentous bathe")).toBe(true);
  });

  it("should not find strings with more than one word and queries have repeated words", () => {
    const results = search("mom mom", data.multiwordString);
    expect(results.includes("mom woebegone")).toBe(false);
  });
});

describe("searchPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = searchPreservingOrder("", data.stringList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should not sort the results by relevance", () => {
    const results = searchPreservingOrder("rub", data.stringList);
    expect(results.indexOf("rub")).toBeGreaterThan(results.indexOf("tub"));
  });

  it("should filter some items if a query is provided", () => {
    const results = searchPreservingOrder("mom", data.stringList);
    expect(results.length).toBeLessThan(data.stringList.length);
  });

  it("should find exact matches", () => {
    const results = searchPreservingOrder("mom", data.stringList);
    expect(results.includes("mom") && results.includes("momentous")).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = searchPreservingOrder("tub", data.stringList);
    expect(results.includes("rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = searchPreservingOrder("mom", data.stringList);
    expect(results.includes("fax")).toBe(false);
  });

  it("should find strings with more than one word", () => {
    const results = searchPreservingOrder("mom", data.multiwordString);
    expect(
      results.includes("mom woebegone") && results.includes("momentous bathe")
    ).toBe(true);
  });

  it("should find strings with more than one word when out of order", () => {
    const results = searchPreservingOrder("mom", data.multiwordString);
    expect(
      results.includes("null mom") && results.includes("shiny momentous")
    ).toBe(true);
  });

  it("should find strings with more than one word and queries have more than one word", () => {
    const results = searchPreservingOrder("mom bathe", data.multiwordString);
    expect(results.includes("momentous bathe")).toBe(true);
  });

  it("should not find strings with more than one word and queries have repeated words", () => {
    const results = searchPreservingOrder("mom mom", data.multiwordString);
    expect(results.includes("mom woebegone")).toBe(false);
  });
});

describe("vagueSearch", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueSearch("", data.stringList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = vagueSearch("rub", data.stringList);
    expect(results.indexOf("rub")).toBeLessThan(results.indexOf("tub"));
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueSearch("mom", data.stringList);
    expect(results.length).toBeLessThan(data.stringList.length);
  });

  it("should find exact matches", () => {
    const results = vagueSearch("mom", data.stringList);
    expect(results.includes("mom") && results.includes("momentous")).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueSearch("tub", data.stringList);
    expect(results.includes("rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueSearch("tub", data.stringList);
    expect(results.includes("ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueSearch("mom", data.stringList);
    expect(results.includes("fax")).toBe(false);
  });

  it("should find strings with more than one word", () => {
    const results = vagueSearch("mom", data.multiwordString);
    expect(
      results.includes("mom woebegone") && results.includes("momentous bathe")
    ).toBe(true);
  });

  it("should find strings with more than one word when out of order", () => {
    const results = vagueSearch("mom", data.multiwordString);
    expect(
      results.includes("null mom") && results.includes("shiny momentous")
    ).toBe(true);
  });

  it("should find strings with more than one word and queries have more than one word", () => {
    const results = vagueSearch("mom bathe", data.multiwordString);
    expect(results.includes("momentous bathe")).toBe(true);
  });

  it("should not find strings with more than one word and queries have repeated words", () => {
    const results = vagueSearch("mom mom", data.multiwordString);
    expect(results.includes("mom woebegone")).toBe(false);
  });
});

describe("vagueSearchPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueSearchPreservingOrder("", data.stringList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should not sort the results by relevance", () => {
    const results = vagueSearchPreservingOrder("rub", data.stringList);
    expect(results.indexOf("rub")).toBeGreaterThan(results.indexOf("tub"));
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueSearchPreservingOrder("mom", data.stringList);
    expect(results.length).toBeLessThan(data.stringList.length);
  });

  it("should find exact matches", () => {
    const results = vagueSearchPreservingOrder("mom", data.stringList);
    expect(results.includes("mom") && results.includes("momentous")).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueSearchPreservingOrder("tub", data.stringList);
    expect(results.includes("rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueSearchPreservingOrder("tub", data.stringList);
    expect(results.includes("ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueSearchPreservingOrder("mom", data.stringList);
    expect(results.includes("fax")).toBe(false);
  });

  it("should find strings with more than one word", () => {
    const results = vagueSearchPreservingOrder("mom", data.multiwordString);
    expect(
      results.includes("mom woebegone") && results.includes("momentous bathe")
    ).toBe(true);
  });

  it("should find strings with more than one word when out of order", () => {
    const results = vagueSearchPreservingOrder("mom", data.multiwordString);
    expect(
      results.includes("null mom") && results.includes("shiny momentous")
    ).toBe(true);
  });

  it("should find strings with more than one word and queries have more than one word", () => {
    const results = vagueSearchPreservingOrder(
      "mom bathe",
      data.multiwordString
    );
    expect(results.includes("momentous bathe")).toBe(true);
  });

  it("should not find strings with more than one word and queries have repeated words", () => {
    const results = vagueSearchPreservingOrder("mom mom", data.multiwordString);
    expect(results.includes("mom woebegone")).toBe(false);
  });
});

describe("objectSearch", () => {
  it("should provide the whole list if no query", () => {
    const results = objectSearch("", ["foo.bar", "baz"], data.objectList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = objectSearch("rub", ["foo.bar", "baz"], data.objectList);
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeLessThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = objectSearch("mom", ["foo.bar", "baz"], data.objectList);
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = objectSearch("mom", ["foo.bar", "baz"], data.objectList);
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = objectSearch("tub", ["foo.bar", "baz"], data.objectList);
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = objectSearch("mom", ["foo.bar", "baz"], data.objectList);
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = objectSearch(
      "mom",
      ["foo.bar", "baz"],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("objectSearchPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = objectSearchPreservingOrder(
      "",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should not sort the results by relevance", () => {
    const results = objectSearchPreservingOrder(
      "rub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeGreaterThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = objectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = objectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = objectSearchPreservingOrder(
      "tub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = objectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = objectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("vagueObjectSearch", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueObjectSearch("", ["foo.bar", "baz"], data.objectList);
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = vagueObjectSearch(
      "rub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeLessThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueObjectSearch(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = vagueObjectSearch(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueObjectSearch(
      "tub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueObjectSearch(
      "tub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueObjectSearch(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = vagueObjectSearch(
      "mom",
      ["foo.bar", "baz"],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("vagueObjectSearchPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueObjectSearchPreservingOrder(
      "",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should not sort the results by relevance", () => {
    const results = vagueObjectSearchPreservingOrder(
      "rub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeGreaterThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueObjectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = vagueObjectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueObjectSearchPreservingOrder(
      "tub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueObjectSearchPreservingOrder(
      "tub",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueObjectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = vagueObjectSearchPreservingOrder(
      "mom",
      ["foo.bar", "baz"],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("searchUsingGetters", () => {
  it("should provide the whole list if no query", () => {
    const results = searchUsingGetters(
      "",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = searchUsingGetters(
      "rub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeLessThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = searchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = searchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = searchUsingGetters(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = searchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = searchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("searchUsingGettersPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = searchUsingGettersPreservingOrder(
      "",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = searchUsingGettersPreservingOrder(
      "rub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeGreaterThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = searchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = searchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = searchUsingGettersPreservingOrder(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = searchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = searchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("vagueSearchUsingGetters", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueSearchUsingGetters(
      "",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = vagueSearchUsingGetters(
      "rub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeLessThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueSearchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = vagueSearchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueSearchUsingGetters(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueSearchUsingGetters(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueSearchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = vagueSearchUsingGetters(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});

describe("vagueSearchUsingGettersPreservingOrder", () => {
  it("should provide the whole list if no query", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toEqual(data.stringList.length);
  });

  it("should sort the results by relevance", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "rub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.findIndex(item => item.foo.bar === "rub")).toBeGreaterThan(
      results.findIndex(item => item.foo.bar === "tub")
    );
  });

  it("should filter some items if a query is provided", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(results.length).toBeLessThan(data.objectList.length);
  });

  it("should find exact matches", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.foo.bar === "momentous")
    ).toBe(true);
  });

  it("should find matches with one typo", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "rub")).toBe(true);
  });

  it("should find matches with two typos", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "tub",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "ten")).toBe(true);
  });

  it("should not include non-matches", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.objectList
    );
    expect(!!results.find(item => item.foo.bar === "fax")).toBe(false);
  });

  it("should search across multiple keys", () => {
    const results = vagueSearchUsingGettersPreservingOrder(
      "mom",
      [item => item.foo.bar, item => item.baz],
      data.multiKeyObjectList
    );
    expect(
      !!results.find(item => item.foo.bar === "mom") &&
        !!results.find(item => item.baz === "mom")
    ).toBe(true);
  });
});
