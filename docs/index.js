(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"ramda":91}],2:[function(require,module,exports){
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
} = require("../dist/index.js");

window.runSearch = () => {
  const query = getQuery();
  const optionsIndex = getOptionsIndex();
  const vagueness = getVagueness();
  const preserveOrder = getPreserveOrder();

  const list =
    optionsIndex === 0
      ? values.stringList
      : optionsIndex === 1
      ? values.multiwordString
      : optionsIndex === 2
      ? values.objectList
      : values.multiKeyObjectList;

  const t1 = performance.now();
  const results =
    optionsIndex === 0 || optionsIndex === 1
      ? vagueness === 0
        ? preserveOrder === 0
          ? search(query, list)
          : searchPreservingOrder(query, list)
        : preserveOrder === 0
        ? vagueSearch(query, list)
        : vagueSearchPreservingOrder(query, list)
      : optionsIndex === 2
      ? vagueness === 0
        ? preserveOrder === 0
          ? objectSearch(query, ["foo.bar"], list)
          : objectSearchPreservingOrder(query, ["foo.bar"], list)
        : preserveOrder === 0
        ? vagueObjectSearch(query, ["foo.bar"], list)
        : vagueObjectSearchPreservingOrder(query, ["foo.bar"], list)
      : optionsIndex === 3
      ? vagueness === 0
        ? preserveOrder === 0
          ? objectSearch(query, ["foo.bar", "baz"], list)
          : objectSearchPreservingOrder(query, ["foo.bar", "baz"], list)
        : preserveOrder === 0
        ? vagueObjectSearch(query, ["foo.bar", "baz"], list)
        : vagueObjectSearchPreservingOrder(query, ["foo.bar", "baz"], list)
      : vagueness === 0
      ? preserveOrder === 0
        ? searchUsingGetters(
            query,
            [item => item.foo.bar, item => item.baz],
            list
          )
        : searchUsingGettersPreservingOrder(
            query,
            [item => item.foo.bar, item => item.baz],
            list
          )
      : preserveOrder === 0
      ? vagueSearchUsingGetters(
          query,
          [item => item.foo.bar, item => item.baz],
          list
        )
      : vagueSearchUsingGettersPreservingOrder(
          query,
          [item => item.foo.bar, item => item.baz],
          list
        );
  const t2 = performance.now();

  setFunctionToUse(query, optionsIndex, vagueness, preserveOrder);
  setOptionsCount(list);
  setResultsCount(results);
  setOptionsList(list);
  setResultsList(results);
  setTimeToSearch(Math.round(t2 - t1));
};

const createDiv = (color, children) => {
  const div = document.createElement("div");
  div.setAttribute(
    "style",
    `color: ${color ||
      "rgb(200, 200, 204)"}; display: flex; flex-direction: row; white-space: pre;`
  );
  div.innerText = children;
  return div;
};

const setFunctionToUse = (query, optionsIndex, vagueness, preserveOrder) => {
  const functionToUse = document.getElementById("functionToUse");

  if (optionsIndex <= 1) {
    const functionName = createDiv(
      "rgb(250, 70, 70)",
      vagueness === 0 && preserveOrder === 0
        ? "search"
        : vagueness === 0 && preserveOrder === 1
        ? "searchPreservingOrder"
        : vagueness === 1 && preserveOrder === 0
        ? "vagueSearch"
        : "vagueSearchPreservingOrder"
    );
    const string = createDiv("rgb(100, 200, 50)", `"${query}"`);
    const list = createDiv("rgb(100, 100, 200)", "list");
    functionToUse.innerHTML = "";
    functionToUse.appendChild(functionName);
    functionToUse.appendChild(createDiv("", "("));
    functionToUse.appendChild(string);
    functionToUse.appendChild(createDiv("", ", "));
    functionToUse.appendChild(list);
    functionToUse.appendChild(createDiv("", ");"));
  } else if (optionsIndex === 2) {
    const functionName = createDiv(
      "rgb(250, 70, 70)",
      vagueness === 0 && preserveOrder === 0
        ? "objectSearch"
        : vagueness === 0 && preserveOrder === 1
        ? "objectSearchPreservingOrder"
        : vagueness === 1 && preserveOrder === 0
        ? "vagueObjectSearch"
        : "vagueObjectSearchPreservingOrder"
    );
    const string1 = createDiv("rgb(100, 200, 50)", `"${query}"`);
    const string2 = createDiv("rgb(100, 200, 50)", `"foo.bar"`);
    const list = createDiv("rgb(100, 100, 200)", "list");
    functionToUse.innerHTML = "";
    functionToUse.appendChild(functionName);
    functionToUse.appendChild(createDiv("", "("));
    functionToUse.appendChild(string1);
    functionToUse.appendChild(createDiv("", ", ["));
    functionToUse.appendChild(string2);
    functionToUse.appendChild(createDiv("", "], "));
    functionToUse.appendChild(list);
    functionToUse.appendChild(createDiv("", ");"));
  } else if (optionsIndex === 3) {
    const functionName = createDiv(
      "rgb(250, 70, 70)",
      vagueness === 0 && preserveOrder === 0
        ? "objectSearch"
        : vagueness === 0 && preserveOrder === 1
        ? "objectSearchPreservingOrder"
        : vagueness === 1 && preserveOrder === 0
        ? "vagueObjectSearch"
        : "vagueObjectSearchPreservingOrder"
    );
    const string1 = createDiv("rgb(100, 200, 50)", `"${query}"`);
    const string2 = createDiv("rgb(100, 200, 50)", `"foo.bar"`);
    const string3 = createDiv("rgb(100, 200, 50)", `"baz"`);
    const list = createDiv("rgb(100, 100, 200)", "list");
    functionToUse.innerHTML = "";
    functionToUse.appendChild(functionName);
    functionToUse.appendChild(createDiv("", "("));
    functionToUse.appendChild(string1);
    functionToUse.appendChild(createDiv("", ", ["));
    functionToUse.appendChild(string2);
    functionToUse.appendChild(createDiv("", ", "));
    functionToUse.appendChild(string3);
    functionToUse.appendChild(createDiv("", "], "));
    functionToUse.appendChild(list);
    functionToUse.appendChild(createDiv("", ");"));
  } else if (optionsIndex === 4) {
    const functionName = createDiv(
      "rgb(250, 70, 70)",
      vagueness === 0 && preserveOrder === 0
        ? "searchUsingGetters"
        : vagueness === 0 && preserveOrder === 1
        ? "searchUsingGettersPreservingOrder"
        : vagueness === 1 && preserveOrder === 0
        ? "vagueSearchUsingGetters"
        : "vagueSearchUsingGettersPreservingOrder"
    );
    const string1 = createDiv("rgb(100, 200, 50)", `"${query}"`);
    const arrow1 = createDiv("rgb(100, 100, 200)", " => ");
    const arrow2 = createDiv("rgb(100, 100, 200)", " => ");
    const list = createDiv("rgb(100, 100, 200)", "list");
    functionToUse.innerHTML = "";
    functionToUse.appendChild(functionName);
    functionToUse.appendChild(createDiv("", "("));
    functionToUse.appendChild(string1);
    functionToUse.appendChild(createDiv("", ", ["));
    functionToUse.appendChild(createDiv("", "item"));
    functionToUse.appendChild(arrow1);
    functionToUse.appendChild(createDiv("", "item.foo.bar, item"));
    functionToUse.appendChild(arrow2);
    functionToUse.appendChild(createDiv("", "item.baz"));
    functionToUse.appendChild(createDiv("", "], "));
    functionToUse.appendChild(list);
    functionToUse.appendChild(createDiv("", ");"));
  }
};
const setOptionsCount = list => {
  document.getElementById(
    "optionsCount"
  ).innerText = `options: (count: ${list.length})`;
};
const setResultsCount = list => {
  document.getElementById(
    "resultsCount"
  ).innerText = `results: (count: ${list.length})`;
};
const setOptionsList = list => {
  document.getElementById("optionsList").innerText = JSON.stringify(
    list,
    null,
    2
  );
};
const setResultsList = list => {
  document.getElementById("resultsList").innerText = JSON.stringify(
    list,
    null,
    2
  );
};
const setTimeToSearch = time => {
  document.getElementById(
    "timeToSearch"
  ).innerText = `Time to search: ${time}ms`;
};
const getQuery = () => document.getElementById("query").value;
const getOptionsIndex = () =>
  Array.prototype.slice
    .call(document.getElementsByClassName("optionsRadioButton"))
    .findIndex(element => element.checked);
const getVagueness = () =>
  Array.prototype.slice
    .call(document.getElementsByClassName("strictnessRadioButton"))
    .findIndex(element => element.checked);
const getPreserveOrder = () =>
  Array.prototype.slice
    .call(document.getElementsByClassName("orderRadioButton"))
    .findIndex(element => element.checked);

const values = {
  stringList: [
    "tub",
    "finger",
    "coal",
    "ancient",
    "confused",
    "strip",
    "irritating",
    "magic",
    "material",
    "board",
    "ruin",
    "laughable",
    "afterthought",
    "receipt",
    "consist",
    "art",
    "detailed",
    "ground",
    "car",
    "bustling",
    "battle",
    "didactic",
    "cherry",
    "ludicrous",
    "glossy",
    "complain",
    "interesting",
    "soda",
    "hurried",
    "jail",
    "bucket",
    "tangible",
    "early",
    "well-groomed",
    "crate",
    "geese",
    "prevent",
    "woebegone",
    "mom",
    "null",
    "screw",
    "real",
    "quixotic",
    "lethal",
    "grab",
    "rod",
    "merciful",
    "tiresome",
    "add",
    "combative",
    "enjoy",
    "teeny-tiny",
    "limping",
    "probable",
    "exist",
    "doubt",
    "dogs",
    "bath",
    "elbow",
    "earth",
    "marvelous",
    "confess",
    "destruction",
    "tire",
    "direction",
    "territory",
    "frequent",
    "capricious",
    "abundant",
    "snotty",
    "punch",
    "plants",
    "steel",
    "disarm",
    "filthy",
    "overwrought",
    "door",
    "morning",
    "amuse",
    "rude",
    "quickest",
    "rush",
    "oval",
    "agonizing",
    "efficacious",
    "expect",
    "savory",
    "cobweb",
    "prose",
    "shade",
    "giraffe",
    "tight",
    "snails",
    "dear",
    "stereotyped",
    "unruly",
    "damage",
    "chop",
    "raspy",
    "inexpensive",
    "ethereal",
    "slippery",
    "joyous",
    "test",
    "light",
    "condemned",
    "x-ray",
    "nose",
    "crooked",
    "beds",
    "cellar",
    "alcoholic",
    "obsolete",
    "spoil",
    "invent",
    "free",
    "unable",
    "jolly",
    "plot",
    "scream",
    "loud",
    "receptive",
    "clever",
    "belief",
    "abashed",
    "ocean",
    "hushed",
    "muscle",
    "zephyr",
    "regular",
    "plain",
    "glib",
    "hard",
    "gigantic",
    "marked",
    "rabid",
    "bewildered",
    "wilderness",
    "secretive",
    "fantastic",
    "secret",
    "malicious",
    "zonked",
    "kind",
    "dinner",
    "slow",
    "plastic",
    "hollow",
    "touch",
    "aspiring",
    "stitch",
    "plate",
    "divide",
    "deliver",
    "appear",
    "head",
    "maddening",
    "ring",
    "polish",
    "list",
    "offend",
    "rhetorical",
    "kick",
    "fearless",
    "bike",
    "hulking",
    "messy",
    "ladybug",
    "smooth",
    "earthy",
    "ask",
    "alike",
    "pathetic",
    "infamous",
    "poised",
    "celery",
    "whole",
    "makeshift",
    "sidewalk",
    "toothbrush",
    "crazy",
    "panicky",
    "clammy",
    "true",
    "look",
    "development",
    "wheel",
    "mammoth",
    "thin",
    "bait",
    "responsible",
    "reproduce",
    "reading",
    "orange",
    "soup",
    "skate",
    "wood",
    "wiry",
    "skillful",
    "tramp",
    "fertile",
    "breakable",
    "honorable",
    "kindhearted",
    "linen",
    "bridge",
    "price",
    "voracious",
    "annoying",
    "judicious",
    "rule",
    "wooden",
    "disagreeable",
    "abhorrent",
    "sweet",
    "robust",
    "onerous",
    "crowded",
    "concerned",
    "narrow",
    "sable",
    "descriptive",
    "romantic",
    "mushy",
    "unfasten",
    "pie",
    "coherent",
    "shaky",
    "advertisement",
    "roof",
    "changeable",
    "discreet",
    "prefer",
    "parcel",
    "hate",
    "compare",
    "type",
    "addition",
    "crawl",
    "button",
    "tremble",
    "yard",
    "home",
    "absorbed",
    "cat",
    "eatable",
    "tow",
    "gusty",
    "mature",
    "voyage",
    "sky",
    "mother",
    "crash",
    "remove",
    "conscious",
    "knock",
    "ritzy",
    "slimy",
    "note",
    "penitent",
    "anger",
    "uptight",
    "straw",
    "sophisticated",
    "heap",
    "burn",
    "hapless",
    "table",
    "impulse",
    "pickle",
    "overflow",
    "calm",
    "blade",
    "crime",
    "numberless",
    "stuff",
    "pail",
    "attempt",
    "stir",
    "hammer",
    "exuberant",
    "expensive",
    "unnatural",
    "simple",
    "sofa",
    "dapper",
    "camera",
    "squalid",
    "loutish",
    "dirt",
    "day",
    "massive",
    "fierce",
    "bomb",
    "muddled",
    "ignore",
    "fuel",
    "behave",
    "run",
    "faithful",
    "flower",
    "truthful",
    "encourage",
    "knotty",
    "wakeful",
    "adhesive",
    "lie",
    "relation",
    "tasty",
    "subdued",
    "love",
    "greedy",
    "worthless",
    "name",
    "frog",
    "magical",
    "careless",
    "ablaze",
    "assorted",
    "command",
    "entertain",
    "throne",
    "yawn",
    "scratch",
    "kitty",
    "chicken",
    "carpenter",
    "inquisitive",
    "sand",
    "screeching",
    "accept",
    "appliance",
    "aware",
    "train",
    "exultant",
    "greet",
    "play",
    "invite",
    "cherries",
    "fabulous",
    "boorish",
    "dog",
    "guitar",
    "base",
    "pat",
    "annoy",
    "warn",
    "basin",
    "purring",
    "abusive",
    "elderly",
    "bulb",
    "slave",
    "interrupt",
    "cheer",
    "noxious",
    "weight",
    "attach",
    "skip",
    "sneaky",
    "reply",
    "rescue",
    "death",
    "jar",
    "donkey",
    "soak",
    "tough",
    "license",
    "important",
    "team",
    "sassy",
    "protective",
    "cheap",
    "abounding",
    "flight",
    "hair",
    "colour",
    "absurd",
    "carry",
    "sort",
    "talented",
    "toes",
    "even",
    "crush",
    "peace",
    "grin",
    "road",
    "back",
    "correct",
    "introduce",
    "coat",
    "spray",
    "tan",
    "mice",
    "answer",
    "drink",
    "receive",
    "baby",
    "plough",
    "wipe",
    "whip",
    "invention",
    "rub",
    "fool",
    "shake",
    "large",
    "purple",
    "bottle",
    "pocket",
    "marble",
    "bells",
    "erratic",
    "second-hand",
    "regret",
    "temper",
    "stare",
    "count",
    "vacuous",
    "dreary",
    "juvenile",
    "profuse",
    "deafening",
    "mix",
    "wail",
    "wish",
    "hug",
    "delicious",
    "share",
    "squirrel",
    "caption",
    "salty",
    "station",
    "grey",
    "enchanting",
    "number",
    "mug",
    "lamp",
    "special",
    "wrist",
    "numerous",
    "wide",
    "scared",
    "farm",
    "instruct",
    "brown",
    "underwear",
    "dashing",
    "salt",
    "jealous",
    "gray",
    "uninterested",
    "aggressive",
    "feigned",
    "nebulous",
    "flawless",
    "afternoon",
    "scent",
    "group",
    "improve",
    "pump",
    "pushy",
    "little",
    "grouchy",
    "chunky",
    "protest",
    "cooperative",
    "cold",
    "enthusiastic",
    "guttural",
    "heal",
    "trace",
    "wink",
    "dangerous",
    "graceful",
    "new",
    "enormous",
    "powerful",
    "ambitious",
    "five",
    "wrap",
    "cry",
    "object",
    "stage",
    "minute",
    "disastrous",
    "loss",
    "birds",
    "describe",
    "lyrical",
    "rake",
    "broad",
    "stormy",
    "superficial",
    "evanescent",
    "craven",
    "overrated",
    "scale",
    "forgetful",
    "nine",
    "accurate",
    "healthy",
    "unused",
    "cruel",
    "bite",
    "determined",
    "guard",
    "sweltering",
    "aftermath",
    "flagrant",
    "zealous",
    "punishment",
    "full",
    "harbor",
    "story",
    "scarce",
    "health",
    "stomach",
    "curve",
    "waiting",
    "recognise",
    "snake",
    "ripe",
    "gamy",
    "complete",
    "wrestle",
    "angle",
    "birthday",
    "seat",
    "utter",
    "left",
    "double",
    "late",
    "route",
    "sponge",
    "bad",
    "pointless",
    "painful",
    "line",
    "support",
    "transport",
    "lace",
    "knowledge",
    "tin",
    "attend",
    "harass",
    "ten",
    "futuristic",
    "suggest",
    "tawdry",
    "misty",
    "chase",
    "psychotic",
    "clumsy",
    "guiltless",
    "straight",
    "safe",
    "sulky",
    "abrupt",
    "past",
    "grubby",
    "stocking",
    "wicked",
    "tasteless",
    "physical",
    "duck",
    "empty",
    "imperfect",
    "rinse",
    "quarter",
    "unit",
    "hour",
    "sprout",
    "baseball",
    "try",
    "jog",
    "dream",
    "wind",
    "same",
    "front",
    "fluttering",
    "secretary",
    "oven",
    "melted",
    "reaction",
    "uncle",
    "show",
    "canvas",
    "furtive",
    "error",
    "quince",
    "mate",
    "racial",
    "drown",
    "strong",
    "second",
    "lunch",
    "queue",
    "honey",
    "preserve",
    "strap",
    "barbarous",
    "ignorant",
    "squeamish",
    "vivacious",
    "cluttered",
    "listen",
    "cars",
    "sparkle",
    "brash",
    "satisfy",
    "ruddy",
    "mindless",
    "selfish",
    "concern",
    "bead",
    "room",
    "violent",
    "aback",
    "crabby",
    "star",
    "alluring",
    "feeble",
    "meddle",
    "itchy",
    "breath",
    "vessel",
    "egg",
    "electric",
    "trees",
    "grain",
    "steam",
    "cats",
    "permissible",
    "check",
    "astonishing",
    "organic",
    "direful",
    "soothe",
    "pot",
    "leather",
    "animal",
    "addicted",
    "carve",
    "payment",
    "gratis",
    "release",
    "quizzical",
    "north",
    "boot",
    "found",
    "yell",
    "encouraging",
    "workable",
    "grotesque",
    "ubiquitous",
    "puny",
    "passenger",
    "fasten",
    "irritate",
    "recess",
    "insect",
    "annoyed",
    "disgusting",
    "deceive",
    "continue",
    "wing",
    "striped",
    "statuesque",
    "permit",
    "debonair",
    "foot",
    "madly",
    "pale",
    "enter",
    "chickens",
    "memory",
    "cross",
    "horrible",
    "flavor",
    "groan",
    "amount",
    "extend",
    "side",
    "vulgar",
    "rotten",
    "scarf",
    "brass",
    "boring",
    "creator",
    "need",
    "difficult",
    "authority",
    "quarrelsome",
    "hurt",
    "quartz",
    "haircut",
    "elated",
    "babies",
    "slim",
    "juice",
    "subtract",
    "communicate",
    "hateful",
    "cautious",
    "vague",
    "texture",
    "question",
    "needle",
    "cast",
    "erect",
    "replace",
    "size",
    "bee",
    "kaput",
    "suit",
    "classy",
    "maid",
    "gaze",
    "hungry",
    "fail",
    "smiling",
    "angry",
    "spade",
    "berserk",
    "compete",
    "evasive",
    "toothpaste",
    "dry",
    "chalk",
    "ink",
    "vanish",
    "luxuriant",
    "fortunate",
    "allow",
    "yielding",
    "loose",
    "rhyme",
    "stupendous",
    "cap",
    "standing",
    "fragile",
    "drawer",
    "different",
    "frightened",
    "sack",
    "place",
    "grandmother",
    "functional",
    "insidious",
    "insurance",
    "afford",
    "swanky",
    "want",
    "grandfather",
    "bored",
    "unadvised",
    "flash",
    "like",
    "uncovered",
    "fade",
    "inject",
    "tie",
    "fire",
    "letter",
    "treat",
    "pet",
    "powder",
    "ill",
    "boil",
    "wax",
    "zesty",
    "rigid",
    "sock",
    "wanting",
    "tested",
    "partner",
    "possess",
    "cow",
    "unusual",
    "army",
    "parallel",
    "spill",
    "cloudy",
    "illegal",
    "laugh",
    "punish",
    "war",
    "level",
    "horses",
    "opposite",
    "mind",
    "humor",
    "seashore",
    "wire",
    "face",
    "superb",
    "spurious",
    "quill",
    "mint",
    "nippy",
    "staking",
    "known",
    "scatter",
    "office",
    "bathe",
    "momentous",
    "shiny",
    "boundless",
    "substance",
    "supreme",
    "gainful",
    "muddle",
    "versed",
    "warlike",
    "spring",
    "neighborly",
    "weather",
    "strengthen",
    "kettle",
    "pray",
    "burly",
    "pan",
    "snow",
    "raise",
    "dinosaurs",
    "club",
    "join",
    "incompetent",
    "waves",
    "range",
    "rightful",
    "bite-sized",
    "hop",
    "whisper",
    "bloody",
    "mitten",
    "theory",
    "motionless",
    "two",
    "panoramic",
    "spot",
    "black-and-white",
    "shivering",
    "nod",
    "blue",
    "labored",
    "macho",
    "market",
    "fish",
    "stamp",
    "hydrant",
    "brainy",
    "zoo",
    "mundane",
    "teeny",
    "amusement",
    "work",
    "milky",
    "limit",
    "heady",
    "shape",
    "vase",
    "youthful",
    "trouble",
    "search",
    "treatment",
    "aromatic",
    "phobic",
    "animated",
    "floor",
    "scrawny",
    "proud",
    "file",
    "round",
    "digestion",
    "blind",
    "visit",
    "languid",
    "parched",
    "zip",
    "tap",
    "trick",
    "embarrass",
    "mere",
    "confuse",
    "earn",
    "fallacious",
    "obscene",
    "reward",
    "mass",
    "precede",
    "glistening",
    "gate",
    "signal",
    "freezing",
    "domineering",
    "berry",
    "separate",
    "abandoned",
    "puzzled",
    "degree",
    "existence",
    "suck",
    "obey",
    "pear",
    "structure",
    "cent",
    "plucky",
    "huge",
    "bed",
    "robin",
    "vacation",
    "deserted",
    "summer",
    "desert",
    "jelly",
    "nerve",
    "river",
    "rambunctious",
    "fax",
    "eight",
    "humdrum",
    "crowd",
    "ultra",
    "first",
    "repeat",
    "smoke",
    "moor",
    "complex",
    "subsequent",
    "sigh",
    "cracker",
    "deserve",
    "exciting",
    "things",
    "heartbreaking",
    "pies",
    "cagey",
    "uppity",
    "grieving",
    "playground",
    "spell",
    "sad",
    "relax",
    "risk",
    "shame",
    "society",
    "afraid",
    "puzzling",
    "suspend",
    "close",
    "old-fashioned",
    "satisfying",
    "dolls",
    "lighten",
    "hallowed",
    "government",
    "amuck",
    "collect",
    "verdant",
    "appreciate",
    "relieved",
    "plant",
    "tart",
    "cannon",
    "general",
    "string",
    "third",
    "sordid",
    "educated",
    "wound",
    "volleyball",
    "guide",
    "refuse",
    "rough",
    "scarecrow",
    "fruit",
    "zinc",
    "knife",
    "dead",
    "profit",
    "damaged",
    "aboriginal",
    "ski",
    "flesh",
    "telling",
    "match",
    "dust",
    "steep",
    "joke",
    "memorise",
    "disgusted",
    "adaptable",
    "snore",
    "view",
    "modern",
    "pleasant",
    "pretty",
    "volcano",
    "arrogant"
  ],
  multiwordString: [
    "finger tub",
    "coal finger",
    "ancient coal",
    "confused ancient",
    "strip confused",
    "irritating strip",
    "magic irritating",
    "material magic",
    "board material",
    "ruin board",
    "laughable ruin",
    "afterthought laughable",
    "receipt afterthought",
    "consist receipt",
    "art consist",
    "detailed art",
    "ground detailed",
    "car ground",
    "bustling car",
    "battle bustling",
    "didactic battle",
    "cherry didactic",
    "ludicrous cherry",
    "glossy ludicrous",
    "complain glossy",
    "interesting complain",
    "soda interesting",
    "hurried soda",
    "jail hurried",
    "bucket jail",
    "tangible bucket",
    "early tangible",
    "well-groomed early",
    "crate wellgroomed",
    "geese crate",
    "prevent geese",
    "woebegone prevent",
    "mom woebegone",
    "null mom",
    "screw null",
    "real screw",
    "quixotic real",
    "lethal quixotic",
    "grab lethal",
    "rod grab",
    "merciful rod",
    "tiresome merciful",
    "add tiresome",
    "combative add",
    "enjoy combative",
    "teeny-tiny enjoy",
    "limping teenytiny",
    "probable limping",
    "exist probable",
    "doubt exist",
    "dogs doubt",
    "bath dogs",
    "elbow bath",
    "earth elbow",
    "marvelous earth",
    "confess marvelous",
    "destruction confess",
    "tire destruction",
    "direction tire",
    "territory direction",
    "frequent territory",
    "capricious frequent",
    "abundant capricious",
    "snotty abundant",
    "punch snotty",
    "plants punch",
    "steel plants",
    "disarm steel",
    "filthy disarm",
    "overwrought filthy",
    "door overwrought",
    "morning door",
    "amuse morning",
    "rude amuse",
    "quickest rude",
    "rush quickest",
    "oval rush",
    "agonizing oval",
    "efficacious agonizing",
    "expect efficacious",
    "savory expect",
    "cobweb savory",
    "prose cobweb",
    "shade prose",
    "giraffe shade",
    "tight giraffe",
    "snails tight",
    "dear snails",
    "stereotyped dear",
    "unruly stereotyped",
    "damage unruly",
    "chop damage",
    "raspy chop",
    "inexpensive raspy",
    "ethereal inexpensive",
    "slippery ethereal",
    "joyous slippery",
    "test joyous",
    "light test",
    "condemned light",
    "x-ray condemned",
    "nose xray",
    "crooked nose",
    "beds crooked",
    "cellar beds",
    "alcoholic cellar",
    "obsolete alcoholic",
    "spoil obsolete",
    "invent spoil",
    "free invent",
    "unable free",
    "jolly unable",
    "plot jolly",
    "scream plot",
    "loud scream",
    "receptive loud",
    "clever receptive",
    "belief clever",
    "abashed belief",
    "ocean abashed",
    "hushed ocean",
    "muscle hushed",
    "zephyr muscle",
    "regular zephyr",
    "plain regular",
    "glib plain",
    "hard glib",
    "gigantic hard",
    "marked gigantic",
    "rabid marked",
    "bewildered rabid",
    "wilderness bewildered",
    "secretive wilderness",
    "fantastic secretive",
    "secret fantastic",
    "malicious secret",
    "zonked malicious",
    "kind zonked",
    "dinner kind",
    "slow dinner",
    "plastic slow",
    "hollow plastic",
    "touch hollow",
    "aspiring touch",
    "stitch aspiring",
    "plate stitch",
    "divide plate",
    "deliver divide",
    "appear deliver",
    "head appear",
    "maddening head",
    "ring maddening",
    "polish ring",
    "list polish",
    "offend list",
    "rhetorical offend",
    "kick rhetorical",
    "fearless kick",
    "bike fearless",
    "hulking bike",
    "messy hulking",
    "ladybug messy",
    "smooth ladybug",
    "earthy smooth",
    "ask earthy",
    "alike ask",
    "pathetic alike",
    "infamous pathetic",
    "poised infamous",
    "celery poised",
    "whole celery",
    "makeshift whole",
    "sidewalk makeshift",
    "toothbrush sidewalk",
    "crazy toothbrush",
    "panicky crazy",
    "clammy panicky",
    "true clammy",
    "look true",
    "development look",
    "wheel development",
    "mammoth wheel",
    "thin mammoth",
    "bait thin",
    "responsible bait",
    "reproduce responsible",
    "reading reproduce",
    "orange reading",
    "soup orange",
    "skate soup",
    "wood skate",
    "wiry wood",
    "skillful wiry",
    "tramp skillful",
    "fertile tramp",
    "breakable fertile",
    "honorable breakable",
    "kindhearted honorable",
    "linen kindhearted",
    "bridge linen",
    "price bridge",
    "voracious price",
    "annoying voracious",
    "judicious annoying",
    "rule judicious",
    "wooden rule",
    "disagreeable wooden",
    "abhorrent disagreeable",
    "sweet abhorrent",
    "robust sweet",
    "onerous robust",
    "crowded onerous",
    "concerned crowded",
    "narrow concerned",
    "sable narrow",
    "descriptive sable",
    "romantic descriptive",
    "mushy romantic",
    "unfasten mushy",
    "pie unfasten",
    "coherent pie",
    "shaky coherent",
    "advertisement shaky",
    "roof advertisement",
    "changeable roof",
    "discreet changeable",
    "prefer discreet",
    "parcel prefer",
    "hate parcel",
    "compare hate",
    "type compare",
    "addition type",
    "crawl addition",
    "button crawl",
    "tremble button",
    "yard tremble",
    "home yard",
    "absorbed home",
    "cat absorbed",
    "eatable cat",
    "tow eatable",
    "gusty tow",
    "mature gusty",
    "voyage mature",
    "sky voyage",
    "mother sky",
    "crash mother",
    "remove crash",
    "conscious remove",
    "knock conscious",
    "ritzy knock",
    "slimy ritzy",
    "note slimy",
    "penitent note",
    "anger penitent",
    "uptight anger",
    "straw uptight",
    "sophisticated straw",
    "heap sophisticated",
    "burn heap",
    "hapless burn",
    "table hapless",
    "impulse table",
    "pickle impulse",
    "overflow pickle",
    "calm overflow",
    "blade calm",
    "crime blade",
    "numberless crime",
    "stuff numberless",
    "pail stuff",
    "attempt pail",
    "stir attempt",
    "hammer stir",
    "exuberant hammer",
    "expensive exuberant",
    "unnatural expensive",
    "simple unnatural",
    "sofa simple",
    "dapper sofa",
    "camera dapper",
    "squalid camera",
    "loutish squalid",
    "dirt loutish",
    "day dirt",
    "massive day",
    "fierce massive",
    "bomb fierce",
    "muddled bomb",
    "ignore muddled",
    "fuel ignore",
    "behave fuel",
    "run behave",
    "faithful run",
    "flower faithful",
    "truthful flower",
    "encourage truthful",
    "knotty encourage",
    "wakeful knotty",
    "adhesive wakeful",
    "lie adhesive",
    "relation lie",
    "tasty relation",
    "subdued tasty",
    "love subdued",
    "greedy love",
    "worthless greedy",
    "name worthless",
    "frog name",
    "magical frog",
    "careless magical",
    "ablaze careless",
    "assorted ablaze",
    "command assorted",
    "entertain command",
    "throne entertain",
    "yawn throne",
    "scratch yawn",
    "kitty scratch",
    "chicken kitty",
    "carpenter chicken",
    "inquisitive carpenter",
    "sand inquisitive",
    "screeching sand",
    "accept screeching",
    "appliance accept",
    "aware appliance",
    "train aware",
    "exultant train",
    "greet exultant",
    "play greet",
    "invite play",
    "cherries invite",
    "fabulous cherries",
    "boorish fabulous",
    "dog boorish",
    "guitar dog",
    "base guitar",
    "pat base",
    "annoy pat",
    "warn annoy",
    "basin warn",
    "purring basin",
    "abusive purring",
    "elderly abusive",
    "bulb elderly",
    "slave bulb",
    "interrupt slave",
    "cheer interrupt",
    "noxious cheer",
    "weight noxious",
    "attach weight",
    "skip attach",
    "sneaky skip",
    "reply sneaky",
    "rescue reply",
    "death rescue",
    "jar death",
    "donkey jar",
    "soak donkey",
    "tough soak",
    "license tough",
    "important license",
    "team important",
    "sassy team",
    "protective sassy",
    "cheap protective",
    "abounding cheap",
    "flight abounding",
    "hair flight",
    "colour hair",
    "absurd colour",
    "carry absurd",
    "sort carry",
    "talented sort",
    "toes talented",
    "even toes",
    "crush even",
    "peace crush",
    "grin peace",
    "road grin",
    "back road",
    "correct back",
    "introduce correct",
    "coat introduce",
    "spray coat",
    "tan spray",
    "mice tan",
    "answer mice",
    "drink answer",
    "receive drink",
    "baby receive",
    "plough baby",
    "wipe plough",
    "whip wipe",
    "invention whip",
    "rub invention",
    "fool rub",
    "shake fool",
    "large shake",
    "purple large",
    "bottle purple",
    "pocket bottle",
    "marble pocket",
    "bells marble",
    "erratic bells",
    "second-hand erratic",
    "regret secondhand",
    "temper regret",
    "stare temper",
    "count stare",
    "vacuous count",
    "dreary vacuous",
    "juvenile dreary",
    "profuse juvenile",
    "deafening profuse",
    "mix deafening",
    "wail mix",
    "wish wail",
    "hug wish",
    "delicious hug",
    "share delicious",
    "squirrel share",
    "caption squirrel",
    "salty caption",
    "station salty",
    "grey station",
    "enchanting grey",
    "number enchanting",
    "mug number",
    "lamp mug",
    "special lamp",
    "wrist special",
    "numerous wrist",
    "wide numerous",
    "scared wide",
    "farm scared",
    "instruct farm",
    "brown instruct",
    "underwear brown",
    "dashing underwear",
    "salt dashing",
    "jealous salt",
    "gray jealous",
    "uninterested gray",
    "aggressive uninterested",
    "feigned aggressive",
    "nebulous feigned",
    "flawless nebulous",
    "afternoon flawless",
    "scent afternoon",
    "group scent",
    "improve group",
    "pump improve",
    "pushy pump",
    "little pushy",
    "grouchy little",
    "chunky grouchy",
    "protest chunky",
    "cooperative protest",
    "cold cooperative",
    "enthusiastic cold",
    "guttural enthusiastic",
    "heal guttural",
    "trace heal",
    "wink trace",
    "dangerous wink",
    "graceful dangerous",
    "new graceful",
    "enormous new",
    "powerful enormous",
    "ambitious powerful",
    "five ambitious",
    "wrap five",
    "cry wrap",
    "object cry",
    "stage object",
    "minute stage",
    "disastrous minute",
    "loss disastrous",
    "birds loss",
    "describe birds",
    "lyrical describe",
    "rake lyrical",
    "broad rake",
    "stormy broad",
    "superficial stormy",
    "evanescent superficial",
    "craven evanescent",
    "overrated craven",
    "scale overrated",
    "forgetful scale",
    "nine forgetful",
    "accurate nine",
    "healthy accurate",
    "unused healthy",
    "cruel unused",
    "bite cruel",
    "determined bite",
    "guard determined",
    "sweltering guard",
    "aftermath sweltering",
    "flagrant aftermath",
    "zealous flagrant",
    "punishment zealous",
    "full punishment",
    "harbor full",
    "story harbor",
    "scarce story",
    "health scarce",
    "stomach health",
    "curve stomach",
    "waiting curve",
    "recognise waiting",
    "snake recognise",
    "ripe snake",
    "gamy ripe",
    "complete gamy",
    "wrestle complete",
    "angle wrestle",
    "birthday angle",
    "seat birthday",
    "utter seat",
    "left utter",
    "double left",
    "late double",
    "route late",
    "sponge route",
    "bad sponge",
    "pointless bad",
    "painful pointless",
    "line painful",
    "support line",
    "transport support",
    "lace transport",
    "knowledge lace",
    "tin knowledge",
    "attend tin",
    "harass attend",
    "ten harass",
    "futuristic ten",
    "suggest futuristic",
    "tawdry suggest",
    "misty tawdry",
    "chase misty",
    "psychotic chase",
    "clumsy psychotic",
    "guiltless clumsy",
    "straight guiltless",
    "safe straight",
    "sulky safe",
    "abrupt sulky",
    "past abrupt",
    "grubby past",
    "stocking grubby",
    "wicked stocking",
    "tasteless wicked",
    "physical tasteless",
    "duck physical",
    "empty duck",
    "imperfect empty",
    "rinse imperfect",
    "quarter rinse",
    "unit quarter",
    "hour unit",
    "sprout hour",
    "baseball sprout",
    "try baseball",
    "jog try",
    "dream jog",
    "wind dream",
    "same wind",
    "front same",
    "fluttering front",
    "secretary fluttering",
    "oven secretary",
    "melted oven",
    "reaction melted",
    "uncle reaction",
    "show uncle",
    "canvas show",
    "furtive canvas",
    "error furtive",
    "quince error",
    "mate quince",
    "racial mate",
    "drown racial",
    "strong drown",
    "second strong",
    "lunch second",
    "queue lunch",
    "honey queue",
    "preserve honey",
    "strap preserve",
    "barbarous strap",
    "ignorant barbarous",
    "squeamish ignorant",
    "vivacious squeamish",
    "cluttered vivacious",
    "listen cluttered",
    "cars listen",
    "sparkle cars",
    "brash sparkle",
    "satisfy brash",
    "ruddy satisfy",
    "mindless ruddy",
    "selfish mindless",
    "concern selfish",
    "bead concern",
    "room bead",
    "violent room",
    "aback violent",
    "crabby aback",
    "star crabby",
    "alluring star",
    "feeble alluring",
    "meddle feeble",
    "itchy meddle",
    "breath itchy",
    "vessel breath",
    "egg vessel",
    "electric egg",
    "trees electric",
    "grain trees",
    "steam grain",
    "cats steam",
    "permissible cats",
    "check permissible",
    "astonishing check",
    "organic astonishing",
    "direful organic",
    "soothe direful",
    "pot soothe",
    "leather pot",
    "animal leather",
    "addicted animal",
    "carve addicted",
    "payment carve",
    "gratis payment",
    "release gratis",
    "quizzical release",
    "north quizzical",
    "boot north",
    "found boot",
    "yell found",
    "encouraging yell",
    "workable encouraging",
    "grotesque workable",
    "ubiquitous grotesque",
    "puny ubiquitous",
    "passenger puny",
    "fasten passenger",
    "irritate fasten",
    "recess irritate",
    "insect recess",
    "annoyed insect",
    "disgusting annoyed",
    "deceive disgusting",
    "continue deceive",
    "wing continue",
    "striped wing",
    "statuesque striped",
    "permit statuesque",
    "debonair permit",
    "foot debonair",
    "madly foot",
    "pale madly",
    "enter pale",
    "chickens enter",
    "memory chickens",
    "cross memory",
    "horrible cross",
    "flavor horrible",
    "groan flavor",
    "amount groan",
    "extend amount",
    "side extend",
    "vulgar side",
    "rotten vulgar",
    "scarf rotten",
    "brass scarf",
    "boring brass",
    "creator boring",
    "need creator",
    "difficult need",
    "authority difficult",
    "quarrelsome authority",
    "hurt quarrelsome",
    "quartz hurt",
    "haircut quartz",
    "elated haircut",
    "babies elated",
    "slim babies",
    "juice slim",
    "subtract juice",
    "communicate subtract",
    "hateful communicate",
    "cautious hateful",
    "vague cautious",
    "texture vague",
    "question texture",
    "needle question",
    "cast needle",
    "erect cast",
    "replace erect",
    "size replace",
    "bee size",
    "kaput bee",
    "suit kaput",
    "classy suit",
    "maid classy",
    "gaze maid",
    "hungry gaze",
    "fail hungry",
    "smiling fail",
    "angry smiling",
    "spade angry",
    "berserk spade",
    "compete berserk",
    "evasive compete",
    "toothpaste evasive",
    "dry toothpaste",
    "chalk dry",
    "ink chalk",
    "vanish ink",
    "luxuriant vanish",
    "fortunate luxuriant",
    "allow fortunate",
    "yielding allow",
    "loose yielding",
    "rhyme loose",
    "stupendous rhyme",
    "cap stupendous",
    "standing cap",
    "fragile standing",
    "drawer fragile",
    "different drawer",
    "frightened different",
    "sack frightened",
    "place sack",
    "grandmother place",
    "functional grandmother",
    "insidious functional",
    "insurance insidious",
    "afford insurance",
    "swanky afford",
    "want swanky",
    "grandfather want",
    "bored grandfather",
    "unadvised bored",
    "flash unadvised",
    "like flash",
    "uncovered like",
    "fade uncovered",
    "inject fade",
    "tie inject",
    "fire tie",
    "letter fire",
    "treat letter",
    "pet treat",
    "powder pet",
    "ill powder",
    "boil ill",
    "wax boil",
    "zesty wax",
    "rigid zesty",
    "sock rigid",
    "wanting sock",
    "tested wanting",
    "partner tested",
    "possess partner",
    "cow possess",
    "unusual cow",
    "army unusual",
    "parallel army",
    "spill parallel",
    "cloudy spill",
    "illegal cloudy",
    "laugh illegal",
    "punish laugh",
    "war punish",
    "level war",
    "horses level",
    "opposite horses",
    "mind opposite",
    "humor mind",
    "seashore humor",
    "wire seashore",
    "face wire",
    "superb face",
    "spurious superb",
    "quill spurious",
    "mint quill",
    "nippy mint",
    "staking nippy",
    "known staking",
    "scatter known",
    "office scatter",
    "bathe office",
    "momentous bathe",
    "shiny momentous",
    "boundless shiny",
    "substance boundless",
    "supreme substance",
    "gainful supreme",
    "muddle gainful",
    "versed muddle",
    "warlike versed",
    "spring warlike",
    "neighborly spring",
    "weather neighborly",
    "strengthen weather",
    "kettle strengthen",
    "pray kettle",
    "burly pray",
    "pan burly",
    "snow pan",
    "raise snow",
    "dinosaurs raise",
    "club dinosaurs",
    "join club",
    "incompetent join",
    "waves incompetent",
    "range waves",
    "rightful range",
    "bite-sized rightful",
    "hop bitesized",
    "whisper hop",
    "bloody whisper",
    "mitten bloody",
    "theory mitten",
    "motionless theory",
    "two motionless",
    "panoramic two",
    "spot panoramic",
    "black-and-white spot",
    "shivering black-andwhite",
    "nod shivering",
    "blue nod",
    "labored blue",
    "macho labored",
    "market macho",
    "fish market",
    "stamp fish",
    "hydrant stamp",
    "brainy hydrant",
    "zoo brainy",
    "mundane zoo",
    "teeny mundane",
    "amusement teeny",
    "work amusement",
    "milky work",
    "limit milky",
    "heady limit",
    "shape heady",
    "vase shape",
    "youthful vase",
    "trouble youthful",
    "search trouble",
    "treatment search",
    "aromatic treatment",
    "phobic aromatic",
    "animated phobic",
    "floor animated",
    "scrawny floor",
    "proud scrawny",
    "file proud",
    "round file",
    "digestion round",
    "blind digestion",
    "visit blind",
    "languid visit",
    "parched languid",
    "zip parched",
    "tap zip",
    "trick tap",
    "embarrass trick",
    "mere embarrass",
    "confuse mere",
    "earn confuse",
    "fallacious earn",
    "obscene fallacious",
    "reward obscene",
    "mass reward",
    "precede mass",
    "glistening precede",
    "gate glistening",
    "signal gate",
    "freezing signal",
    "domineering freezing",
    "berry domineering",
    "separate berry",
    "abandoned separate",
    "puzzled abandoned",
    "degree puzzled",
    "existence degree",
    "suck existence",
    "obey suck",
    "pear obey",
    "structure pear",
    "cent structure",
    "plucky cent",
    "huge plucky",
    "bed huge",
    "robin bed",
    "vacation robin",
    "deserted vacation",
    "summer deserted",
    "desert summer",
    "jelly desert",
    "nerve jelly",
    "river nerve",
    "rambunctious river",
    "fax rambunctious",
    "eight fax",
    "humdrum eight",
    "crowd humdrum",
    "ultra crowd",
    "first ultra",
    "repeat first",
    "smoke repeat",
    "moor smoke",
    "complex moor",
    "subsequent complex",
    "sigh subsequent",
    "cracker sigh",
    "deserve cracker",
    "exciting deserve",
    "things exciting",
    "heartbreaking things",
    "pies heartbreaking",
    "cagey pies",
    "uppity cagey",
    "grieving uppity",
    "playground grieving",
    "spell playground",
    "sad spell",
    "relax sad",
    "risk relax",
    "shame risk",
    "society shame",
    "afraid society",
    "puzzling afraid",
    "suspend puzzling",
    "close suspend",
    "old-fashioned close",
    "satisfying oldfashioned",
    "dolls satisfying",
    "lighten dolls",
    "hallowed lighten",
    "government hallowed",
    "amuck government",
    "collect amuck",
    "verdant collect",
    "appreciate verdant",
    "relieved appreciate",
    "plant relieved",
    "tart plant",
    "cannon tart",
    "general cannon",
    "string general",
    "third string",
    "sordid third",
    "educated sordid",
    "wound educated",
    "volleyball wound",
    "guide volleyball",
    "refuse guide",
    "rough refuse",
    "scarecrow rough",
    "fruit scarecrow",
    "zinc fruit",
    "knife zinc",
    "dead knife",
    "profit dead",
    "damaged profit",
    "aboriginal damaged",
    "ski aboriginal",
    "flesh ski",
    "telling flesh",
    "match telling",
    "dust match",
    "steep dust",
    "joke steep",
    "memorise joke",
    "disgusted memorise",
    "adaptable disgusted",
    "snore adaptable",
    "view snore",
    "modern view",
    "pleasant modern",
    "pretty pleasant",
    "volcano pretty",
    "arrogant volcano"
  ],
  objectList: [
    { foo: { bar: "tub" } },
    { foo: { bar: "finger" } },
    { foo: { bar: "coal" } },
    { foo: { bar: "ancient" } },
    { foo: { bar: "confused" } },
    { foo: { bar: "strip" } },
    { foo: { bar: "irritating" } },
    { foo: { bar: "magic" } },
    { foo: { bar: "material" } },
    { foo: { bar: "board" } },
    { foo: { bar: "ruin" } },
    { foo: { bar: "laughable" } },
    { foo: { bar: "afterthought" } },
    { foo: { bar: "receipt" } },
    { foo: { bar: "consist" } },
    { foo: { bar: "art" } },
    { foo: { bar: "detailed" } },
    { foo: { bar: "ground" } },
    { foo: { bar: "car" } },
    { foo: { bar: "bustling" } },
    { foo: { bar: "battle" } },
    { foo: { bar: "didactic" } },
    { foo: { bar: "cherry" } },
    { foo: { bar: "ludicrous" } },
    { foo: { bar: "glossy" } },
    { foo: { bar: "complain" } },
    { foo: { bar: "interesting" } },
    { foo: { bar: "soda" } },
    { foo: { bar: "hurried" } },
    { foo: { bar: "jail" } },
    { foo: { bar: "bucket" } },
    { foo: { bar: "tangible" } },
    { foo: { bar: "early" } },
    { foo: { bar: "well-groomed" } },
    { foo: { bar: "crate" } },
    { foo: { bar: "geese" } },
    { foo: { bar: "prevent" } },
    { foo: { bar: "woebegone" } },
    { foo: { bar: "mom" } },
    { foo: { bar: "null" } },
    { foo: { bar: "screw" } },
    { foo: { bar: "real" } },
    { foo: { bar: "quixotic" } },
    { foo: { bar: "lethal" } },
    { foo: { bar: "grab" } },
    { foo: { bar: "rod" } },
    { foo: { bar: "merciful" } },
    { foo: { bar: "tiresome" } },
    { foo: { bar: "add" } },
    { foo: { bar: "combative" } },
    { foo: { bar: "enjoy" } },
    { foo: { bar: "teeny-tiny" } },
    { foo: { bar: "limping" } },
    { foo: { bar: "probable" } },
    { foo: { bar: "exist" } },
    { foo: { bar: "doubt" } },
    { foo: { bar: "dogs" } },
    { foo: { bar: "bath" } },
    { foo: { bar: "elbow" } },
    { foo: { bar: "earth" } },
    { foo: { bar: "marvelous" } },
    { foo: { bar: "confess" } },
    { foo: { bar: "destruction" } },
    { foo: { bar: "tire" } },
    { foo: { bar: "direction" } },
    { foo: { bar: "territory" } },
    { foo: { bar: "frequent" } },
    { foo: { bar: "capricious" } },
    { foo: { bar: "abundant" } },
    { foo: { bar: "snotty" } },
    { foo: { bar: "punch" } },
    { foo: { bar: "plants" } },
    { foo: { bar: "steel" } },
    { foo: { bar: "disarm" } },
    { foo: { bar: "filthy" } },
    { foo: { bar: "overwrought" } },
    { foo: { bar: "door" } },
    { foo: { bar: "morning" } },
    { foo: { bar: "amuse" } },
    { foo: { bar: "rude" } },
    { foo: { bar: "quickest" } },
    { foo: { bar: "rush" } },
    { foo: { bar: "oval" } },
    { foo: { bar: "agonizing" } },
    { foo: { bar: "efficacious" } },
    { foo: { bar: "expect" } },
    { foo: { bar: "savory" } },
    { foo: { bar: "cobweb" } },
    { foo: { bar: "prose" } },
    { foo: { bar: "shade" } },
    { foo: { bar: "giraffe" } },
    { foo: { bar: "tight" } },
    { foo: { bar: "snails" } },
    { foo: { bar: "dear" } },
    { foo: { bar: "stereotyped" } },
    { foo: { bar: "unruly" } },
    { foo: { bar: "damage" } },
    { foo: { bar: "chop" } },
    { foo: { bar: "raspy" } },
    { foo: { bar: "inexpensive" } },
    { foo: { bar: "ethereal" } },
    { foo: { bar: "slippery" } },
    { foo: { bar: "joyous" } },
    { foo: { bar: "test" } },
    { foo: { bar: "light" } },
    { foo: { bar: "condemned" } },
    { foo: { bar: "x-ray" } },
    { foo: { bar: "nose" } },
    { foo: { bar: "crooked" } },
    { foo: { bar: "beds" } },
    { foo: { bar: "cellar" } },
    { foo: { bar: "alcoholic" } },
    { foo: { bar: "obsolete" } },
    { foo: { bar: "spoil" } },
    { foo: { bar: "invent" } },
    { foo: { bar: "free" } },
    { foo: { bar: "unable" } },
    { foo: { bar: "jolly" } },
    { foo: { bar: "plot" } },
    { foo: { bar: "scream" } },
    { foo: { bar: "loud" } },
    { foo: { bar: "receptive" } },
    { foo: { bar: "clever" } },
    { foo: { bar: "belief" } },
    { foo: { bar: "abashed" } },
    { foo: { bar: "ocean" } },
    { foo: { bar: "hushed" } },
    { foo: { bar: "muscle" } },
    { foo: { bar: "zephyr" } },
    { foo: { bar: "regular" } },
    { foo: { bar: "plain" } },
    { foo: { bar: "glib" } },
    { foo: { bar: "hard" } },
    { foo: { bar: "gigantic" } },
    { foo: { bar: "marked" } },
    { foo: { bar: "rabid" } },
    { foo: { bar: "bewildered" } },
    { foo: { bar: "wilderness" } },
    { foo: { bar: "secretive" } },
    { foo: { bar: "fantastic" } },
    { foo: { bar: "secret" } },
    { foo: { bar: "malicious" } },
    { foo: { bar: "zonked" } },
    { foo: { bar: "kind" } },
    { foo: { bar: "dinner" } },
    { foo: { bar: "slow" } },
    { foo: { bar: "plastic" } },
    { foo: { bar: "hollow" } },
    { foo: { bar: "touch" } },
    { foo: { bar: "aspiring" } },
    { foo: { bar: "stitch" } },
    { foo: { bar: "plate" } },
    { foo: { bar: "divide" } },
    { foo: { bar: "deliver" } },
    { foo: { bar: "appear" } },
    { foo: { bar: "head" } },
    { foo: { bar: "maddening" } },
    { foo: { bar: "ring" } },
    { foo: { bar: "polish" } },
    { foo: { bar: "list" } },
    { foo: { bar: "offend" } },
    { foo: { bar: "rhetorical" } },
    { foo: { bar: "kick" } },
    { foo: { bar: "fearless" } },
    { foo: { bar: "bike" } },
    { foo: { bar: "hulking" } },
    { foo: { bar: "messy" } },
    { foo: { bar: "ladybug" } },
    { foo: { bar: "smooth" } },
    { foo: { bar: "earthy" } },
    { foo: { bar: "ask" } },
    { foo: { bar: "alike" } },
    { foo: { bar: "pathetic" } },
    { foo: { bar: "infamous" } },
    { foo: { bar: "poised" } },
    { foo: { bar: "celery" } },
    { foo: { bar: "whole" } },
    { foo: { bar: "makeshift" } },
    { foo: { bar: "sidewalk" } },
    { foo: { bar: "toothbrush" } },
    { foo: { bar: "crazy" } },
    { foo: { bar: "panicky" } },
    { foo: { bar: "clammy" } },
    { foo: { bar: "true" } },
    { foo: { bar: "look" } },
    { foo: { bar: "development" } },
    { foo: { bar: "wheel" } },
    { foo: { bar: "mammoth" } },
    { foo: { bar: "thin" } },
    { foo: { bar: "bait" } },
    { foo: { bar: "responsible" } },
    { foo: { bar: "reproduce" } },
    { foo: { bar: "reading" } },
    { foo: { bar: "orange" } },
    { foo: { bar: "soup" } },
    { foo: { bar: "skate" } },
    { foo: { bar: "wood" } },
    { foo: { bar: "wiry" } },
    { foo: { bar: "skillful" } },
    { foo: { bar: "tramp" } },
    { foo: { bar: "fertile" } },
    { foo: { bar: "breakable" } },
    { foo: { bar: "honorable" } },
    { foo: { bar: "kindhearted" } },
    { foo: { bar: "linen" } },
    { foo: { bar: "bridge" } },
    { foo: { bar: "price" } },
    { foo: { bar: "voracious" } },
    { foo: { bar: "annoying" } },
    { foo: { bar: "judicious" } },
    { foo: { bar: "rule" } },
    { foo: { bar: "wooden" } },
    { foo: { bar: "disagreeable" } },
    { foo: { bar: "abhorrent" } },
    { foo: { bar: "sweet" } },
    { foo: { bar: "robust" } },
    { foo: { bar: "onerous" } },
    { foo: { bar: "crowded" } },
    { foo: { bar: "concerned" } },
    { foo: { bar: "narrow" } },
    { foo: { bar: "sable" } },
    { foo: { bar: "descriptive" } },
    { foo: { bar: "romantic" } },
    { foo: { bar: "mushy" } },
    { foo: { bar: "unfasten" } },
    { foo: { bar: "pie" } },
    { foo: { bar: "coherent" } },
    { foo: { bar: "shaky" } },
    { foo: { bar: "advertisement" } },
    { foo: { bar: "roof" } },
    { foo: { bar: "changeable" } },
    { foo: { bar: "discreet" } },
    { foo: { bar: "prefer" } },
    { foo: { bar: "parcel" } },
    { foo: { bar: "hate" } },
    { foo: { bar: "compare" } },
    { foo: { bar: "type" } },
    { foo: { bar: "addition" } },
    { foo: { bar: "crawl" } },
    { foo: { bar: "button" } },
    { foo: { bar: "tremble" } },
    { foo: { bar: "yard" } },
    { foo: { bar: "home" } },
    { foo: { bar: "absorbed" } },
    { foo: { bar: "cat" } },
    { foo: { bar: "eatable" } },
    { foo: { bar: "tow" } },
    { foo: { bar: "gusty" } },
    { foo: { bar: "mature" } },
    { foo: { bar: "voyage" } },
    { foo: { bar: "sky" } },
    { foo: { bar: "mother" } },
    { foo: { bar: "crash" } },
    { foo: { bar: "remove" } },
    { foo: { bar: "conscious" } },
    { foo: { bar: "knock" } },
    { foo: { bar: "ritzy" } },
    { foo: { bar: "slimy" } },
    { foo: { bar: "note" } },
    { foo: { bar: "penitent" } },
    { foo: { bar: "anger" } },
    { foo: { bar: "uptight" } },
    { foo: { bar: "straw" } },
    { foo: { bar: "sophisticated" } },
    { foo: { bar: "heap" } },
    { foo: { bar: "burn" } },
    { foo: { bar: "hapless" } },
    { foo: { bar: "table" } },
    { foo: { bar: "impulse" } },
    { foo: { bar: "pickle" } },
    { foo: { bar: "overflow" } },
    { foo: { bar: "calm" } },
    { foo: { bar: "blade" } },
    { foo: { bar: "crime" } },
    { foo: { bar: "numberless" } },
    { foo: { bar: "stuff" } },
    { foo: { bar: "pail" } },
    { foo: { bar: "attempt" } },
    { foo: { bar: "stir" } },
    { foo: { bar: "hammer" } },
    { foo: { bar: "exuberant" } },
    { foo: { bar: "expensive" } },
    { foo: { bar: "unnatural" } },
    { foo: { bar: "simple" } },
    { foo: { bar: "sofa" } },
    { foo: { bar: "dapper" } },
    { foo: { bar: "camera" } },
    { foo: { bar: "squalid" } },
    { foo: { bar: "loutish" } },
    { foo: { bar: "dirt" } },
    { foo: { bar: "day" } },
    { foo: { bar: "massive" } },
    { foo: { bar: "fierce" } },
    { foo: { bar: "bomb" } },
    { foo: { bar: "muddled" } },
    { foo: { bar: "ignore" } },
    { foo: { bar: "fuel" } },
    { foo: { bar: "behave" } },
    { foo: { bar: "run" } },
    { foo: { bar: "faithful" } },
    { foo: { bar: "flower" } },
    { foo: { bar: "truthful" } },
    { foo: { bar: "encourage" } },
    { foo: { bar: "knotty" } },
    { foo: { bar: "wakeful" } },
    { foo: { bar: "adhesive" } },
    { foo: { bar: "lie" } },
    { foo: { bar: "relation" } },
    { foo: { bar: "tasty" } },
    { foo: { bar: "subdued" } },
    { foo: { bar: "love" } },
    { foo: { bar: "greedy" } },
    { foo: { bar: "worthless" } },
    { foo: { bar: "name" } },
    { foo: { bar: "frog" } },
    { foo: { bar: "magical" } },
    { foo: { bar: "careless" } },
    { foo: { bar: "ablaze" } },
    { foo: { bar: "assorted" } },
    { foo: { bar: "command" } },
    { foo: { bar: "entertain" } },
    { foo: { bar: "throne" } },
    { foo: { bar: "yawn" } },
    { foo: { bar: "scratch" } },
    { foo: { bar: "kitty" } },
    { foo: { bar: "chicken" } },
    { foo: { bar: "carpenter" } },
    { foo: { bar: "inquisitive" } },
    { foo: { bar: "sand" } },
    { foo: { bar: "screeching" } },
    { foo: { bar: "accept" } },
    { foo: { bar: "appliance" } },
    { foo: { bar: "aware" } },
    { foo: { bar: "train" } },
    { foo: { bar: "exultant" } },
    { foo: { bar: "greet" } },
    { foo: { bar: "play" } },
    { foo: { bar: "invite" } },
    { foo: { bar: "cherries" } },
    { foo: { bar: "fabulous" } },
    { foo: { bar: "boorish" } },
    { foo: { bar: "dog" } },
    { foo: { bar: "guitar" } },
    { foo: { bar: "base" } },
    { foo: { bar: "pat" } },
    { foo: { bar: "annoy" } },
    { foo: { bar: "warn" } },
    { foo: { bar: "basin" } },
    { foo: { bar: "purring" } },
    { foo: { bar: "abusive" } },
    { foo: { bar: "elderly" } },
    { foo: { bar: "bulb" } },
    { foo: { bar: "slave" } },
    { foo: { bar: "interrupt" } },
    { foo: { bar: "cheer" } },
    { foo: { bar: "noxious" } },
    { foo: { bar: "weight" } },
    { foo: { bar: "attach" } },
    { foo: { bar: "skip" } },
    { foo: { bar: "sneaky" } },
    { foo: { bar: "reply" } },
    { foo: { bar: "rescue" } },
    { foo: { bar: "death" } },
    { foo: { bar: "jar" } },
    { foo: { bar: "donkey" } },
    { foo: { bar: "soak" } },
    { foo: { bar: "tough" } },
    { foo: { bar: "license" } },
    { foo: { bar: "important" } },
    { foo: { bar: "team" } },
    { foo: { bar: "sassy" } },
    { foo: { bar: "protective" } },
    { foo: { bar: "cheap" } },
    { foo: { bar: "abounding" } },
    { foo: { bar: "flight" } },
    { foo: { bar: "hair" } },
    { foo: { bar: "colour" } },
    { foo: { bar: "absurd" } },
    { foo: { bar: "carry" } },
    { foo: { bar: "sort" } },
    { foo: { bar: "talented" } },
    { foo: { bar: "toes" } },
    { foo: { bar: "even" } },
    { foo: { bar: "crush" } },
    { foo: { bar: "peace" } },
    { foo: { bar: "grin" } },
    { foo: { bar: "road" } },
    { foo: { bar: "back" } },
    { foo: { bar: "correct" } },
    { foo: { bar: "introduce" } },
    { foo: { bar: "coat" } },
    { foo: { bar: "spray" } },
    { foo: { bar: "tan" } },
    { foo: { bar: "mice" } },
    { foo: { bar: "answer" } },
    { foo: { bar: "drink" } },
    { foo: { bar: "receive" } },
    { foo: { bar: "baby" } },
    { foo: { bar: "plough" } },
    { foo: { bar: "wipe" } },
    { foo: { bar: "whip" } },
    { foo: { bar: "invention" } },
    { foo: { bar: "rub" } },
    { foo: { bar: "fool" } },
    { foo: { bar: "shake" } },
    { foo: { bar: "large" } },
    { foo: { bar: "purple" } },
    { foo: { bar: "bottle" } },
    { foo: { bar: "pocket" } },
    { foo: { bar: "marble" } },
    { foo: { bar: "bells" } },
    { foo: { bar: "erratic" } },
    { foo: { bar: "second-hand" } },
    { foo: { bar: "regret" } },
    { foo: { bar: "temper" } },
    { foo: { bar: "stare" } },
    { foo: { bar: "count" } },
    { foo: { bar: "vacuous" } },
    { foo: { bar: "dreary" } },
    { foo: { bar: "juvenile" } },
    { foo: { bar: "profuse" } },
    { foo: { bar: "deafening" } },
    { foo: { bar: "mix" } },
    { foo: { bar: "wail" } },
    { foo: { bar: "wish" } },
    { foo: { bar: "hug" } },
    { foo: { bar: "delicious" } },
    { foo: { bar: "share" } },
    { foo: { bar: "squirrel" } },
    { foo: { bar: "caption" } },
    { foo: { bar: "salty" } },
    { foo: { bar: "station" } },
    { foo: { bar: "grey" } },
    { foo: { bar: "enchanting" } },
    { foo: { bar: "number" } },
    { foo: { bar: "mug" } },
    { foo: { bar: "lamp" } },
    { foo: { bar: "special" } },
    { foo: { bar: "wrist" } },
    { foo: { bar: "numerous" } },
    { foo: { bar: "wide" } },
    { foo: { bar: "scared" } },
    { foo: { bar: "farm" } },
    { foo: { bar: "instruct" } },
    { foo: { bar: "brown" } },
    { foo: { bar: "underwear" } },
    { foo: { bar: "dashing" } },
    { foo: { bar: "salt" } },
    { foo: { bar: "jealous" } },
    { foo: { bar: "gray" } },
    { foo: { bar: "uninterested" } },
    { foo: { bar: "aggressive" } },
    { foo: { bar: "feigned" } },
    { foo: { bar: "nebulous" } },
    { foo: { bar: "flawless" } },
    { foo: { bar: "afternoon" } },
    { foo: { bar: "scent" } },
    { foo: { bar: "group" } },
    { foo: { bar: "improve" } },
    { foo: { bar: "pump" } },
    { foo: { bar: "pushy" } },
    { foo: { bar: "little" } },
    { foo: { bar: "grouchy" } },
    { foo: { bar: "chunky" } },
    { foo: { bar: "protest" } },
    { foo: { bar: "cooperative" } },
    { foo: { bar: "cold" } },
    { foo: { bar: "enthusiastic" } },
    { foo: { bar: "guttural" } },
    { foo: { bar: "heal" } },
    { foo: { bar: "trace" } },
    { foo: { bar: "wink" } },
    { foo: { bar: "dangerous" } },
    { foo: { bar: "graceful" } },
    { foo: { bar: "new" } },
    { foo: { bar: "enormous" } },
    { foo: { bar: "powerful" } },
    { foo: { bar: "ambitious" } },
    { foo: { bar: "five" } },
    { foo: { bar: "wrap" } },
    { foo: { bar: "cry" } },
    { foo: { bar: "object" } },
    { foo: { bar: "stage" } },
    { foo: { bar: "minute" } },
    { foo: { bar: "disastrous" } },
    { foo: { bar: "loss" } },
    { foo: { bar: "birds" } },
    { foo: { bar: "describe" } },
    { foo: { bar: "lyrical" } },
    { foo: { bar: "rake" } },
    { foo: { bar: "broad" } },
    { foo: { bar: "stormy" } },
    { foo: { bar: "superficial" } },
    { foo: { bar: "evanescent" } },
    { foo: { bar: "craven" } },
    { foo: { bar: "overrated" } },
    { foo: { bar: "scale" } },
    { foo: { bar: "forgetful" } },
    { foo: { bar: "nine" } },
    { foo: { bar: "accurate" } },
    { foo: { bar: "healthy" } },
    { foo: { bar: "unused" } },
    { foo: { bar: "cruel" } },
    { foo: { bar: "bite" } },
    { foo: { bar: "determined" } },
    { foo: { bar: "guard" } },
    { foo: { bar: "sweltering" } },
    { foo: { bar: "aftermath" } },
    { foo: { bar: "flagrant" } },
    { foo: { bar: "zealous" } },
    { foo: { bar: "punishment" } },
    { foo: { bar: "full" } },
    { foo: { bar: "harbor" } },
    { foo: { bar: "story" } },
    { foo: { bar: "scarce" } },
    { foo: { bar: "health" } },
    { foo: { bar: "stomach" } },
    { foo: { bar: "curve" } },
    { foo: { bar: "waiting" } },
    { foo: { bar: "recognise" } },
    { foo: { bar: "snake" } },
    { foo: { bar: "ripe" } },
    { foo: { bar: "gamy" } },
    { foo: { bar: "complete" } },
    { foo: { bar: "wrestle" } },
    { foo: { bar: "angle" } },
    { foo: { bar: "birthday" } },
    { foo: { bar: "seat" } },
    { foo: { bar: "utter" } },
    { foo: { bar: "left" } },
    { foo: { bar: "double" } },
    { foo: { bar: "late" } },
    { foo: { bar: "route" } },
    { foo: { bar: "sponge" } },
    { foo: { bar: "bad" } },
    { foo: { bar: "pointless" } },
    { foo: { bar: "painful" } },
    { foo: { bar: "line" } },
    { foo: { bar: "support" } },
    { foo: { bar: "transport" } },
    { foo: { bar: "lace" } },
    { foo: { bar: "knowledge" } },
    { foo: { bar: "tin" } },
    { foo: { bar: "attend" } },
    { foo: { bar: "harass" } },
    { foo: { bar: "ten" } },
    { foo: { bar: "futuristic" } },
    { foo: { bar: "suggest" } },
    { foo: { bar: "tawdry" } },
    { foo: { bar: "misty" } },
    { foo: { bar: "chase" } },
    { foo: { bar: "psychotic" } },
    { foo: { bar: "clumsy" } },
    { foo: { bar: "guiltless" } },
    { foo: { bar: "straight" } },
    { foo: { bar: "safe" } },
    { foo: { bar: "sulky" } },
    { foo: { bar: "abrupt" } },
    { foo: { bar: "past" } },
    { foo: { bar: "grubby" } },
    { foo: { bar: "stocking" } },
    { foo: { bar: "wicked" } },
    { foo: { bar: "tasteless" } },
    { foo: { bar: "physical" } },
    { foo: { bar: "duck" } },
    { foo: { bar: "empty" } },
    { foo: { bar: "imperfect" } },
    { foo: { bar: "rinse" } },
    { foo: { bar: "quarter" } },
    { foo: { bar: "unit" } },
    { foo: { bar: "hour" } },
    { foo: { bar: "sprout" } },
    { foo: { bar: "baseball" } },
    { foo: { bar: "try" } },
    { foo: { bar: "jog" } },
    { foo: { bar: "dream" } },
    { foo: { bar: "wind" } },
    { foo: { bar: "same" } },
    { foo: { bar: "front" } },
    { foo: { bar: "fluttering" } },
    { foo: { bar: "secretary" } },
    { foo: { bar: "oven" } },
    { foo: { bar: "melted" } },
    { foo: { bar: "reaction" } },
    { foo: { bar: "uncle" } },
    { foo: { bar: "show" } },
    { foo: { bar: "canvas" } },
    { foo: { bar: "furtive" } },
    { foo: { bar: "error" } },
    { foo: { bar: "quince" } },
    { foo: { bar: "mate" } },
    { foo: { bar: "racial" } },
    { foo: { bar: "drown" } },
    { foo: { bar: "strong" } },
    { foo: { bar: "second" } },
    { foo: { bar: "lunch" } },
    { foo: { bar: "queue" } },
    { foo: { bar: "honey" } },
    { foo: { bar: "preserve" } },
    { foo: { bar: "strap" } },
    { foo: { bar: "barbarous" } },
    { foo: { bar: "ignorant" } },
    { foo: { bar: "squeamish" } },
    { foo: { bar: "vivacious" } },
    { foo: { bar: "cluttered" } },
    { foo: { bar: "listen" } },
    { foo: { bar: "cars" } },
    { foo: { bar: "sparkle" } },
    { foo: { bar: "brash" } },
    { foo: { bar: "satisfy" } },
    { foo: { bar: "ruddy" } },
    { foo: { bar: "mindless" } },
    { foo: { bar: "selfish" } },
    { foo: { bar: "concern" } },
    { foo: { bar: "bead" } },
    { foo: { bar: "room" } },
    { foo: { bar: "violent" } },
    { foo: { bar: "aback" } },
    { foo: { bar: "crabby" } },
    { foo: { bar: "star" } },
    { foo: { bar: "alluring" } },
    { foo: { bar: "feeble" } },
    { foo: { bar: "meddle" } },
    { foo: { bar: "itchy" } },
    { foo: { bar: "breath" } },
    { foo: { bar: "vessel" } },
    { foo: { bar: "egg" } },
    { foo: { bar: "electric" } },
    { foo: { bar: "trees" } },
    { foo: { bar: "grain" } },
    { foo: { bar: "steam" } },
    { foo: { bar: "cats" } },
    { foo: { bar: "permissible" } },
    { foo: { bar: "check" } },
    { foo: { bar: "astonishing" } },
    { foo: { bar: "organic" } },
    { foo: { bar: "direful" } },
    { foo: { bar: "soothe" } },
    { foo: { bar: "pot" } },
    { foo: { bar: "leather" } },
    { foo: { bar: "animal" } },
    { foo: { bar: "addicted" } },
    { foo: { bar: "carve" } },
    { foo: { bar: "payment" } },
    { foo: { bar: "gratis" } },
    { foo: { bar: "release" } },
    { foo: { bar: "quizzical" } },
    { foo: { bar: "north" } },
    { foo: { bar: "boot" } },
    { foo: { bar: "found" } },
    { foo: { bar: "yell" } },
    { foo: { bar: "encouraging" } },
    { foo: { bar: "workable" } },
    { foo: { bar: "grotesque" } },
    { foo: { bar: "ubiquitous" } },
    { foo: { bar: "puny" } },
    { foo: { bar: "passenger" } },
    { foo: { bar: "fasten" } },
    { foo: { bar: "irritate" } },
    { foo: { bar: "recess" } },
    { foo: { bar: "insect" } },
    { foo: { bar: "annoyed" } },
    { foo: { bar: "disgusting" } },
    { foo: { bar: "deceive" } },
    { foo: { bar: "continue" } },
    { foo: { bar: "wing" } },
    { foo: { bar: "striped" } },
    { foo: { bar: "statuesque" } },
    { foo: { bar: "permit" } },
    { foo: { bar: "debonair" } },
    { foo: { bar: "foot" } },
    { foo: { bar: "madly" } },
    { foo: { bar: "pale" } },
    { foo: { bar: "enter" } },
    { foo: { bar: "chickens" } },
    { foo: { bar: "memory" } },
    { foo: { bar: "cross" } },
    { foo: { bar: "horrible" } },
    { foo: { bar: "flavor" } },
    { foo: { bar: "groan" } },
    { foo: { bar: "amount" } },
    { foo: { bar: "extend" } },
    { foo: { bar: "side" } },
    { foo: { bar: "vulgar" } },
    { foo: { bar: "rotten" } },
    { foo: { bar: "scarf" } },
    { foo: { bar: "brass" } },
    { foo: { bar: "boring" } },
    { foo: { bar: "creator" } },
    { foo: { bar: "need" } },
    { foo: { bar: "difficult" } },
    { foo: { bar: "authority" } },
    { foo: { bar: "quarrelsome" } },
    { foo: { bar: "hurt" } },
    { foo: { bar: "quartz" } },
    { foo: { bar: "haircut" } },
    { foo: { bar: "elated" } },
    { foo: { bar: "babies" } },
    { foo: { bar: "slim" } },
    { foo: { bar: "juice" } },
    { foo: { bar: "subtract" } },
    { foo: { bar: "communicate" } },
    { foo: { bar: "hateful" } },
    { foo: { bar: "cautious" } },
    { foo: { bar: "vague" } },
    { foo: { bar: "texture" } },
    { foo: { bar: "question" } },
    { foo: { bar: "needle" } },
    { foo: { bar: "cast" } },
    { foo: { bar: "erect" } },
    { foo: { bar: "replace" } },
    { foo: { bar: "size" } },
    { foo: { bar: "bee" } },
    { foo: { bar: "kaput" } },
    { foo: { bar: "suit" } },
    { foo: { bar: "classy" } },
    { foo: { bar: "maid" } },
    { foo: { bar: "gaze" } },
    { foo: { bar: "hungry" } },
    { foo: { bar: "fail" } },
    { foo: { bar: "smiling" } },
    { foo: { bar: "angry" } },
    { foo: { bar: "spade" } },
    { foo: { bar: "berserk" } },
    { foo: { bar: "compete" } },
    { foo: { bar: "evasive" } },
    { foo: { bar: "toothpaste" } },
    { foo: { bar: "dry" } },
    { foo: { bar: "chalk" } },
    { foo: { bar: "ink" } },
    { foo: { bar: "vanish" } },
    { foo: { bar: "luxuriant" } },
    { foo: { bar: "fortunate" } },
    { foo: { bar: "allow" } },
    { foo: { bar: "yielding" } },
    { foo: { bar: "loose" } },
    { foo: { bar: "rhyme" } },
    { foo: { bar: "stupendous" } },
    { foo: { bar: "cap" } },
    { foo: { bar: "standing" } },
    { foo: { bar: "fragile" } },
    { foo: { bar: "drawer" } },
    { foo: { bar: "different" } },
    { foo: { bar: "frightened" } },
    { foo: { bar: "sack" } },
    { foo: { bar: "place" } },
    { foo: { bar: "grandmother" } },
    { foo: { bar: "functional" } },
    { foo: { bar: "insidious" } },
    { foo: { bar: "insurance" } },
    { foo: { bar: "afford" } },
    { foo: { bar: "swanky" } },
    { foo: { bar: "want" } },
    { foo: { bar: "grandfather" } },
    { foo: { bar: "bored" } },
    { foo: { bar: "unadvised" } },
    { foo: { bar: "flash" } },
    { foo: { bar: "like" } },
    { foo: { bar: "uncovered" } },
    { foo: { bar: "fade" } },
    { foo: { bar: "inject" } },
    { foo: { bar: "tie" } },
    { foo: { bar: "fire" } },
    { foo: { bar: "letter" } },
    { foo: { bar: "treat" } },
    { foo: { bar: "pet" } },
    { foo: { bar: "powder" } },
    { foo: { bar: "ill" } },
    { foo: { bar: "boil" } },
    { foo: { bar: "wax" } },
    { foo: { bar: "zesty" } },
    { foo: { bar: "rigid" } },
    { foo: { bar: "sock" } },
    { foo: { bar: "wanting" } },
    { foo: { bar: "tested" } },
    { foo: { bar: "partner" } },
    { foo: { bar: "possess" } },
    { foo: { bar: "cow" } },
    { foo: { bar: "unusual" } },
    { foo: { bar: "army" } },
    { foo: { bar: "parallel" } },
    { foo: { bar: "spill" } },
    { foo: { bar: "cloudy" } },
    { foo: { bar: "illegal" } },
    { foo: { bar: "laugh" } },
    { foo: { bar: "punish" } },
    { foo: { bar: "war" } },
    { foo: { bar: "level" } },
    { foo: { bar: "horses" } },
    { foo: { bar: "opposite" } },
    { foo: { bar: "mind" } },
    { foo: { bar: "humor" } },
    { foo: { bar: "seashore" } },
    { foo: { bar: "wire" } },
    { foo: { bar: "face" } },
    { foo: { bar: "superb" } },
    { foo: { bar: "spurious" } },
    { foo: { bar: "quill" } },
    { foo: { bar: "mint" } },
    { foo: { bar: "nippy" } },
    { foo: { bar: "staking" } },
    { foo: { bar: "known" } },
    { foo: { bar: "scatter" } },
    { foo: { bar: "office" } },
    { foo: { bar: "bathe" } },
    { foo: { bar: "momentous" } },
    { foo: { bar: "shiny" } },
    { foo: { bar: "boundless" } },
    { foo: { bar: "substance" } },
    { foo: { bar: "supreme" } },
    { foo: { bar: "gainful" } },
    { foo: { bar: "muddle" } },
    { foo: { bar: "versed" } },
    { foo: { bar: "warlike" } },
    { foo: { bar: "spring" } },
    { foo: { bar: "neighborly" } },
    { foo: { bar: "weather" } },
    { foo: { bar: "strengthen" } },
    { foo: { bar: "kettle" } },
    { foo: { bar: "pray" } },
    { foo: { bar: "burly" } },
    { foo: { bar: "pan" } },
    { foo: { bar: "snow" } },
    { foo: { bar: "raise" } },
    { foo: { bar: "dinosaurs" } },
    { foo: { bar: "club" } },
    { foo: { bar: "join" } },
    { foo: { bar: "incompetent" } },
    { foo: { bar: "waves" } },
    { foo: { bar: "range" } },
    { foo: { bar: "rightful" } },
    { foo: { bar: "bite-sized" } },
    { foo: { bar: "hop" } },
    { foo: { bar: "whisper" } },
    { foo: { bar: "bloody" } },
    { foo: { bar: "mitten" } },
    { foo: { bar: "theory" } },
    { foo: { bar: "motionless" } },
    { foo: { bar: "two" } },
    { foo: { bar: "panoramic" } },
    { foo: { bar: "spot" } },
    { foo: { bar: "black-and-white" } },
    { foo: { bar: "shivering" } },
    { foo: { bar: "nod" } },
    { foo: { bar: "blue" } },
    { foo: { bar: "labored" } },
    { foo: { bar: "macho" } },
    { foo: { bar: "market" } },
    { foo: { bar: "fish" } },
    { foo: { bar: "stamp" } },
    { foo: { bar: "hydrant" } },
    { foo: { bar: "brainy" } },
    { foo: { bar: "zoo" } },
    { foo: { bar: "mundane" } },
    { foo: { bar: "teeny" } },
    { foo: { bar: "amusement" } },
    { foo: { bar: "work" } },
    { foo: { bar: "milky" } },
    { foo: { bar: "limit" } },
    { foo: { bar: "heady" } },
    { foo: { bar: "shape" } },
    { foo: { bar: "vase" } },
    { foo: { bar: "youthful" } },
    { foo: { bar: "trouble" } },
    { foo: { bar: "search" } },
    { foo: { bar: "treatment" } },
    { foo: { bar: "aromatic" } },
    { foo: { bar: "phobic" } },
    { foo: { bar: "animated" } },
    { foo: { bar: "floor" } },
    { foo: { bar: "scrawny" } },
    { foo: { bar: "proud" } },
    { foo: { bar: "file" } },
    { foo: { bar: "round" } },
    { foo: { bar: "digestion" } },
    { foo: { bar: "blind" } },
    { foo: { bar: "visit" } },
    { foo: { bar: "languid" } },
    { foo: { bar: "parched" } },
    { foo: { bar: "zip" } },
    { foo: { bar: "tap" } },
    { foo: { bar: "trick" } },
    { foo: { bar: "embarrass" } },
    { foo: { bar: "mere" } },
    { foo: { bar: "confuse" } },
    { foo: { bar: "earn" } },
    { foo: { bar: "fallacious" } },
    { foo: { bar: "obscene" } },
    { foo: { bar: "reward" } },
    { foo: { bar: "mass" } },
    { foo: { bar: "precede" } },
    { foo: { bar: "glistening" } },
    { foo: { bar: "gate" } },
    { foo: { bar: "signal" } },
    { foo: { bar: "freezing" } },
    { foo: { bar: "domineering" } },
    { foo: { bar: "berry" } },
    { foo: { bar: "separate" } },
    { foo: { bar: "abandoned" } },
    { foo: { bar: "puzzled" } },
    { foo: { bar: "degree" } },
    { foo: { bar: "existence" } },
    { foo: { bar: "suck" } },
    { foo: { bar: "obey" } },
    { foo: { bar: "pear" } },
    { foo: { bar: "structure" } },
    { foo: { bar: "cent" } },
    { foo: { bar: "plucky" } },
    { foo: { bar: "huge" } },
    { foo: { bar: "bed" } },
    { foo: { bar: "robin" } },
    { foo: { bar: "vacation" } },
    { foo: { bar: "deserted" } },
    { foo: { bar: "summer" } },
    { foo: { bar: "desert" } },
    { foo: { bar: "jelly" } },
    { foo: { bar: "nerve" } },
    { foo: { bar: "river" } },
    { foo: { bar: "rambunctious" } },
    { foo: { bar: "fax" } },
    { foo: { bar: "eight" } },
    { foo: { bar: "humdrum" } },
    { foo: { bar: "crowd" } },
    { foo: { bar: "ultra" } },
    { foo: { bar: "first" } },
    { foo: { bar: "repeat" } },
    { foo: { bar: "smoke" } },
    { foo: { bar: "moor" } },
    { foo: { bar: "complex" } },
    { foo: { bar: "subsequent" } },
    { foo: { bar: "sigh" } },
    { foo: { bar: "cracker" } },
    { foo: { bar: "deserve" } },
    { foo: { bar: "exciting" } },
    { foo: { bar: "things" } },
    { foo: { bar: "heartbreaking" } },
    { foo: { bar: "pies" } },
    { foo: { bar: "cagey" } },
    { foo: { bar: "uppity" } },
    { foo: { bar: "grieving" } },
    { foo: { bar: "playground" } },
    { foo: { bar: "spell" } },
    { foo: { bar: "sad" } },
    { foo: { bar: "relax" } },
    { foo: { bar: "risk" } },
    { foo: { bar: "shame" } },
    { foo: { bar: "society" } },
    { foo: { bar: "afraid" } },
    { foo: { bar: "puzzling" } },
    { foo: { bar: "suspend" } },
    { foo: { bar: "close" } },
    { foo: { bar: "old-fashioned" } },
    { foo: { bar: "satisfying" } },
    { foo: { bar: "dolls" } },
    { foo: { bar: "lighten" } },
    { foo: { bar: "hallowed" } },
    { foo: { bar: "government" } },
    { foo: { bar: "amuck" } },
    { foo: { bar: "collect" } },
    { foo: { bar: "verdant" } },
    { foo: { bar: "appreciate" } },
    { foo: { bar: "relieved" } },
    { foo: { bar: "plant" } },
    { foo: { bar: "tart" } },
    { foo: { bar: "cannon" } },
    { foo: { bar: "general" } },
    { foo: { bar: "string" } },
    { foo: { bar: "third" } },
    { foo: { bar: "sordid" } },
    { foo: { bar: "educated" } },
    { foo: { bar: "wound" } },
    { foo: { bar: "volleyball" } },
    { foo: { bar: "guide" } },
    { foo: { bar: "refuse" } },
    { foo: { bar: "rough" } },
    { foo: { bar: "scarecrow" } },
    { foo: { bar: "fruit" } },
    { foo: { bar: "zinc" } },
    { foo: { bar: "knife" } },
    { foo: { bar: "dead" } },
    { foo: { bar: "profit" } },
    { foo: { bar: "damaged" } },
    { foo: { bar: "aboriginal" } },
    { foo: { bar: "ski" } },
    { foo: { bar: "flesh" } },
    { foo: { bar: "telling" } },
    { foo: { bar: "match" } },
    { foo: { bar: "dust" } },
    { foo: { bar: "steep" } },
    { foo: { bar: "joke" } },
    { foo: { bar: "memorise" } },
    { foo: { bar: "disgusted" } },
    { foo: { bar: "adaptable" } },
    { foo: { bar: "snore" } },
    { foo: { bar: "view" } },
    { foo: { bar: "modern" } },
    { foo: { bar: "pleasant" } },
    { foo: { bar: "pretty" } },
    { foo: { bar: "volcano" } },
    { foo: { bar: "arrogant" } }
  ],
  multiKeyObjectList: [
    { baz: "arrogant", foo: { bar: "tub" } },
    { baz: "tub", foo: { bar: "finger" } },
    { baz: "finger", foo: { bar: "coal" } },
    { baz: "coal", foo: { bar: "ancient" } },
    { baz: "ancient", foo: { bar: "confused" } },
    { baz: "confused", foo: { bar: "strip" } },
    { baz: "strip", foo: { bar: "irritating" } },
    { baz: "irritating", foo: { bar: "magic" } },
    { baz: "magic", foo: { bar: "material" } },
    { baz: "material", foo: { bar: "board" } },
    { baz: "board", foo: { bar: "ruin" } },
    { baz: "ruin", foo: { bar: "laughable" } },
    { baz: "laughable", foo: { bar: "afterthought" } },
    { baz: "afterthought", foo: { bar: "receipt" } },
    { baz: "receipt", foo: { bar: "consist" } },
    { baz: "consist", foo: { bar: "art" } },
    { baz: "art", foo: { bar: "detailed" } },
    { baz: "detailed", foo: { bar: "ground" } },
    { baz: "ground", foo: { bar: "car" } },
    { baz: "car", foo: { bar: "bustling" } },
    { baz: "bustling", foo: { bar: "battle" } },
    { baz: "battle", foo: { bar: "didactic" } },
    { baz: "didactic", foo: { bar: "cherry" } },
    { baz: "cherry", foo: { bar: "ludicrous" } },
    { baz: "ludicrous", foo: { bar: "glossy" } },
    { baz: "glossy", foo: { bar: "complain" } },
    { baz: "complain", foo: { bar: "interesting" } },
    { baz: "interesting", foo: { bar: "soda" } },
    { baz: "soda", foo: { bar: "hurried" } },
    { baz: "hurried", foo: { bar: "jail" } },
    { baz: "jail", foo: { bar: "bucket" } },
    { baz: "bucket", foo: { bar: "tangible" } },
    { baz: "tangible", foo: { bar: "early" } },
    { baz: "early", foo: { bar: "well-groomed" } },
    { baz: "groomed", foo: { bar: "crate" } },
    { baz: "crate", foo: { bar: "geese" } },
    { baz: "geese", foo: { bar: "prevent" } },
    { baz: "prevent", foo: { bar: "woebegone" } },
    { baz: "woebegone", foo: { bar: "mom" } },
    { baz: "mom", foo: { bar: "null" } },
    { baz: "null", foo: { bar: "screw" } },
    { baz: "screw", foo: { bar: "real" } },
    { baz: "real", foo: { bar: "quixotic" } },
    { baz: "quixotic", foo: { bar: "lethal" } },
    { baz: "lethal", foo: { bar: "grab" } },
    { baz: "grab", foo: { bar: "rod" } },
    { baz: "rod", foo: { bar: "merciful" } },
    { baz: "merciful", foo: { bar: "tiresome" } },
    { baz: "tiresome", foo: { bar: "add" } },
    { baz: "add", foo: { bar: "combative" } },
    { baz: "combative", foo: { bar: "enjoy" } },
    { baz: "enjoy", foo: { bar: "teeny-tiny" } },
    { baz: "tiny", foo: { bar: "limping" } },
    { baz: "limping", foo: { bar: "probable" } },
    { baz: "probable", foo: { bar: "exist" } },
    { baz: "exist", foo: { bar: "doubt" } },
    { baz: "doubt", foo: { bar: "dogs" } },
    { baz: "dogs", foo: { bar: "bath" } },
    { baz: "bath", foo: { bar: "elbow" } },
    { baz: "elbow", foo: { bar: "earth" } },
    { baz: "earth", foo: { bar: "marvelous" } },
    { baz: "marvelous", foo: { bar: "confess" } },
    { baz: "confess", foo: { bar: "destruction" } },
    { baz: "destruction", foo: { bar: "tire" } },
    { baz: "tire", foo: { bar: "direction" } },
    { baz: "direction", foo: { bar: "territory" } },
    { baz: "territory", foo: { bar: "frequent" } },
    { baz: "frequent", foo: { bar: "capricious" } },
    { baz: "capricious", foo: { bar: "abundant" } },
    { baz: "abundant", foo: { bar: "snotty" } },
    { baz: "snotty", foo: { bar: "punch" } },
    { baz: "punch", foo: { bar: "plants" } },
    { baz: "plants", foo: { bar: "steel" } },
    { baz: "steel", foo: { bar: "disarm" } },
    { baz: "disarm", foo: { bar: "filthy" } },
    { baz: "filthy", foo: { bar: "overwrought" } },
    { baz: "overwrought", foo: { bar: "door" } },
    { baz: "door", foo: { bar: "morning" } },
    { baz: "morning", foo: { bar: "amuse" } },
    { baz: "amuse", foo: { bar: "rude" } },
    { baz: "rude", foo: { bar: "quickest" } },
    { baz: "quickest", foo: { bar: "rush" } },
    { baz: "rush", foo: { bar: "oval" } },
    { baz: "oval", foo: { bar: "agonizing" } },
    { baz: "agonizing", foo: { bar: "efficacious" } },
    { baz: "efficacious", foo: { bar: "expect" } },
    { baz: "expect", foo: { bar: "savory" } },
    { baz: "savory", foo: { bar: "cobweb" } },
    { baz: "cobweb", foo: { bar: "prose" } },
    { baz: "prose", foo: { bar: "shade" } },
    { baz: "shade", foo: { bar: "giraffe" } },
    { baz: "giraffe", foo: { bar: "tight" } },
    { baz: "tight", foo: { bar: "snails" } },
    { baz: "snails", foo: { bar: "dear" } },
    { baz: "dear", foo: { bar: "stereotyped" } },
    { baz: "stereotyped", foo: { bar: "unruly" } },
    { baz: "unruly", foo: { bar: "damage" } },
    { baz: "damage", foo: { bar: "chop" } },
    { baz: "chop", foo: { bar: "raspy" } },
    { baz: "raspy", foo: { bar: "inexpensive" } },
    { baz: "inexpensive", foo: { bar: "ethereal" } },
    { baz: "ethereal", foo: { bar: "slippery" } },
    { baz: "slippery", foo: { bar: "joyous" } },
    { baz: "joyous", foo: { bar: "test" } },
    { baz: "test", foo: { bar: "light" } },
    { baz: "light", foo: { bar: "condemned" } },
    { baz: "condemned", foo: { bar: "x-ray" } },
    { baz: "ray", foo: { bar: "nose" } },
    { baz: "nose", foo: { bar: "crooked" } },
    { baz: "crooked", foo: { bar: "beds" } },
    { baz: "beds", foo: { bar: "cellar" } },
    { baz: "cellar", foo: { bar: "alcoholic" } },
    { baz: "alcoholic", foo: { bar: "obsolete" } },
    { baz: "obsolete", foo: { bar: "spoil" } },
    { baz: "spoil", foo: { bar: "invent" } },
    { baz: "invent", foo: { bar: "free" } },
    { baz: "free", foo: { bar: "unable" } },
    { baz: "unable", foo: { bar: "jolly" } },
    { baz: "jolly", foo: { bar: "plot" } },
    { baz: "plot", foo: { bar: "scream" } },
    { baz: "scream", foo: { bar: "loud" } },
    { baz: "loud", foo: { bar: "receptive" } },
    { baz: "receptive", foo: { bar: "clever" } },
    { baz: "clever", foo: { bar: "belief" } },
    { baz: "belief", foo: { bar: "abashed" } },
    { baz: "abashed", foo: { bar: "ocean" } },
    { baz: "ocean", foo: { bar: "hushed" } },
    { baz: "hushed", foo: { bar: "muscle" } },
    { baz: "muscle", foo: { bar: "zephyr" } },
    { baz: "zephyr", foo: { bar: "regular" } },
    { baz: "regular", foo: { bar: "plain" } },
    { baz: "plain", foo: { bar: "glib" } },
    { baz: "glib", foo: { bar: "hard" } },
    { baz: "hard", foo: { bar: "gigantic" } },
    { baz: "gigantic", foo: { bar: "marked" } },
    { baz: "marked", foo: { bar: "rabid" } },
    { baz: "rabid", foo: { bar: "bewildered" } },
    { baz: "bewildered", foo: { bar: "wilderness" } },
    { baz: "wilderness", foo: { bar: "secretive" } },
    { baz: "secretive", foo: { bar: "fantastic" } },
    { baz: "fantastic", foo: { bar: "secret" } },
    { baz: "secret", foo: { bar: "malicious" } },
    { baz: "malicious", foo: { bar: "zonked" } },
    { baz: "zonked", foo: { bar: "kind" } },
    { baz: "kind", foo: { bar: "dinner" } },
    { baz: "dinner", foo: { bar: "slow" } },
    { baz: "slow", foo: { bar: "plastic" } },
    { baz: "plastic", foo: { bar: "hollow" } },
    { baz: "hollow", foo: { bar: "touch" } },
    { baz: "touch", foo: { bar: "aspiring" } },
    { baz: "aspiring", foo: { bar: "stitch" } },
    { baz: "stitch", foo: { bar: "plate" } },
    { baz: "plate", foo: { bar: "divide" } },
    { baz: "divide", foo: { bar: "deliver" } },
    { baz: "deliver", foo: { bar: "appear" } },
    { baz: "appear", foo: { bar: "head" } },
    { baz: "head", foo: { bar: "maddening" } },
    { baz: "maddening", foo: { bar: "ring" } },
    { baz: "ring", foo: { bar: "polish" } },
    { baz: "polish", foo: { bar: "list" } },
    { baz: "list", foo: { bar: "offend" } },
    { baz: "offend", foo: { bar: "rhetorical" } },
    { baz: "rhetorical", foo: { bar: "kick" } },
    { baz: "kick", foo: { bar: "fearless" } },
    { baz: "fearless", foo: { bar: "bike" } },
    { baz: "bike", foo: { bar: "hulking" } },
    { baz: "hulking", foo: { bar: "messy" } },
    { baz: "messy", foo: { bar: "ladybug" } },
    { baz: "ladybug", foo: { bar: "smooth" } },
    { baz: "smooth", foo: { bar: "earthy" } },
    { baz: "earthy", foo: { bar: "ask" } },
    { baz: "ask", foo: { bar: "alike" } },
    { baz: "alike", foo: { bar: "pathetic" } },
    { baz: "pathetic", foo: { bar: "infamous" } },
    { baz: "infamous", foo: { bar: "poised" } },
    { baz: "poised", foo: { bar: "celery" } },
    { baz: "celery", foo: { bar: "whole" } },
    { baz: "whole", foo: { bar: "makeshift" } },
    { baz: "makeshift", foo: { bar: "sidewalk" } },
    { baz: "sidewalk", foo: { bar: "toothbrush" } },
    { baz: "toothbrush", foo: { bar: "crazy" } },
    { baz: "crazy", foo: { bar: "panicky" } },
    { baz: "panicky", foo: { bar: "clammy" } },
    { baz: "clammy", foo: { bar: "true" } },
    { baz: "true", foo: { bar: "look" } },
    { baz: "look", foo: { bar: "development" } },
    { baz: "development", foo: { bar: "wheel" } },
    { baz: "wheel", foo: { bar: "mammoth" } },
    { baz: "mammoth", foo: { bar: "thin" } },
    { baz: "thin", foo: { bar: "bait" } },
    { baz: "bait", foo: { bar: "responsible" } },
    { baz: "responsible", foo: { bar: "reproduce" } },
    { baz: "reproduce", foo: { bar: "reading" } },
    { baz: "reading", foo: { bar: "orange" } },
    { baz: "orange", foo: { bar: "soup" } },
    { baz: "soup", foo: { bar: "skate" } },
    { baz: "skate", foo: { bar: "wood" } },
    { baz: "wood", foo: { bar: "wiry" } },
    { baz: "wiry", foo: { bar: "skillful" } },
    { baz: "skillful", foo: { bar: "tramp" } },
    { baz: "tramp", foo: { bar: "fertile" } },
    { baz: "fertile", foo: { bar: "breakable" } },
    { baz: "breakable", foo: { bar: "honorable" } },
    { baz: "honorable", foo: { bar: "kindhearted" } },
    { baz: "kindhearted", foo: { bar: "linen" } },
    { baz: "linen", foo: { bar: "bridge" } },
    { baz: "bridge", foo: { bar: "price" } },
    { baz: "price", foo: { bar: "voracious" } },
    { baz: "voracious", foo: { bar: "annoying" } },
    { baz: "annoying", foo: { bar: "judicious" } },
    { baz: "judicious", foo: { bar: "rule" } },
    { baz: "rule", foo: { bar: "wooden" } },
    { baz: "wooden", foo: { bar: "disagreeable" } },
    { baz: "disagreeable", foo: { bar: "abhorrent" } },
    { baz: "abhorrent", foo: { bar: "sweet" } },
    { baz: "sweet", foo: { bar: "robust" } },
    { baz: "robust", foo: { bar: "onerous" } },
    { baz: "onerous", foo: { bar: "crowded" } },
    { baz: "crowded", foo: { bar: "concerned" } },
    { baz: "concerned", foo: { bar: "narrow" } },
    { baz: "narrow", foo: { bar: "sable" } },
    { baz: "sable", foo: { bar: "descriptive" } },
    { baz: "descriptive", foo: { bar: "romantic" } },
    { baz: "romantic", foo: { bar: "mushy" } },
    { baz: "mushy", foo: { bar: "unfasten" } },
    { baz: "unfasten", foo: { bar: "pie" } },
    { baz: "pie", foo: { bar: "coherent" } },
    { baz: "coherent", foo: { bar: "shaky" } },
    { baz: "shaky", foo: { bar: "advertisement" } },
    { baz: "advertisement", foo: { bar: "roof" } },
    { baz: "roof", foo: { bar: "changeable" } },
    { baz: "changeable", foo: { bar: "discreet" } },
    { baz: "discreet", foo: { bar: "prefer" } },
    { baz: "prefer", foo: { bar: "parcel" } },
    { baz: "parcel", foo: { bar: "hate" } },
    { baz: "hate", foo: { bar: "compare" } },
    { baz: "compare", foo: { bar: "type" } },
    { baz: "type", foo: { bar: "addition" } },
    { baz: "addition", foo: { bar: "crawl" } },
    { baz: "crawl", foo: { bar: "button" } },
    { baz: "button", foo: { bar: "tremble" } },
    { baz: "tremble", foo: { bar: "yard" } },
    { baz: "yard", foo: { bar: "home" } },
    { baz: "home", foo: { bar: "absorbed" } },
    { baz: "absorbed", foo: { bar: "cat" } },
    { baz: "cat", foo: { bar: "eatable" } },
    { baz: "eatable", foo: { bar: "tow" } },
    { baz: "tow", foo: { bar: "gusty" } },
    { baz: "gusty", foo: { bar: "mature" } },
    { baz: "mature", foo: { bar: "voyage" } },
    { baz: "voyage", foo: { bar: "sky" } },
    { baz: "sky", foo: { bar: "mother" } },
    { baz: "mother", foo: { bar: "crash" } },
    { baz: "crash", foo: { bar: "remove" } },
    { baz: "remove", foo: { bar: "conscious" } },
    { baz: "conscious", foo: { bar: "knock" } },
    { baz: "knock", foo: { bar: "ritzy" } },
    { baz: "ritzy", foo: { bar: "slimy" } },
    { baz: "slimy", foo: { bar: "note" } },
    { baz: "note", foo: { bar: "penitent" } },
    { baz: "penitent", foo: { bar: "anger" } },
    { baz: "anger", foo: { bar: "uptight" } },
    { baz: "uptight", foo: { bar: "straw" } },
    { baz: "straw", foo: { bar: "sophisticated" } },
    { baz: "sophisticated", foo: { bar: "heap" } },
    { baz: "heap", foo: { bar: "burn" } },
    { baz: "burn", foo: { bar: "hapless" } },
    { baz: "hapless", foo: { bar: "table" } },
    { baz: "table", foo: { bar: "impulse" } },
    { baz: "impulse", foo: { bar: "pickle" } },
    { baz: "pickle", foo: { bar: "overflow" } },
    { baz: "overflow", foo: { bar: "calm" } },
    { baz: "calm", foo: { bar: "blade" } },
    { baz: "blade", foo: { bar: "crime" } },
    { baz: "crime", foo: { bar: "numberless" } },
    { baz: "numberless", foo: { bar: "stuff" } },
    { baz: "stuff", foo: { bar: "pail" } },
    { baz: "pail", foo: { bar: "attempt" } },
    { baz: "attempt", foo: { bar: "stir" } },
    { baz: "stir", foo: { bar: "hammer" } },
    { baz: "hammer", foo: { bar: "exuberant" } },
    { baz: "exuberant", foo: { bar: "expensive" } },
    { baz: "expensive", foo: { bar: "unnatural" } },
    { baz: "unnatural", foo: { bar: "simple" } },
    { baz: "simple", foo: { bar: "sofa" } },
    { baz: "sofa", foo: { bar: "dapper" } },
    { baz: "dapper", foo: { bar: "camera" } },
    { baz: "camera", foo: { bar: "squalid" } },
    { baz: "squalid", foo: { bar: "loutish" } },
    { baz: "loutish", foo: { bar: "dirt" } },
    { baz: "dirt", foo: { bar: "day" } },
    { baz: "day", foo: { bar: "massive" } },
    { baz: "massive", foo: { bar: "fierce" } },
    { baz: "fierce", foo: { bar: "bomb" } },
    { baz: "bomb", foo: { bar: "muddled" } },
    { baz: "muddled", foo: { bar: "ignore" } },
    { baz: "ignore", foo: { bar: "fuel" } },
    { baz: "fuel", foo: { bar: "behave" } },
    { baz: "behave", foo: { bar: "run" } },
    { baz: "run", foo: { bar: "faithful" } },
    { baz: "faithful", foo: { bar: "flower" } },
    { baz: "flower", foo: { bar: "truthful" } },
    { baz: "truthful", foo: { bar: "encourage" } },
    { baz: "encourage", foo: { bar: "knotty" } },
    { baz: "knotty", foo: { bar: "wakeful" } },
    { baz: "wakeful", foo: { bar: "adhesive" } },
    { baz: "adhesive", foo: { bar: "lie" } },
    { baz: "lie", foo: { bar: "relation" } },
    { baz: "relation", foo: { bar: "tasty" } },
    { baz: "tasty", foo: { bar: "subdued" } },
    { baz: "subdued", foo: { bar: "love" } },
    { baz: "love", foo: { bar: "greedy" } },
    { baz: "greedy", foo: { bar: "worthless" } },
    { baz: "worthless", foo: { bar: "name" } },
    { baz: "name", foo: { bar: "frog" } },
    { baz: "frog", foo: { bar: "magical" } },
    { baz: "magical", foo: { bar: "careless" } },
    { baz: "careless", foo: { bar: "ablaze" } },
    { baz: "ablaze", foo: { bar: "assorted" } },
    { baz: "assorted", foo: { bar: "command" } },
    { baz: "command", foo: { bar: "entertain" } },
    { baz: "entertain", foo: { bar: "throne" } },
    { baz: "throne", foo: { bar: "yawn" } },
    { baz: "yawn", foo: { bar: "scratch" } },
    { baz: "scratch", foo: { bar: "kitty" } },
    { baz: "kitty", foo: { bar: "chicken" } },
    { baz: "chicken", foo: { bar: "carpenter" } },
    { baz: "carpenter", foo: { bar: "inquisitive" } },
    { baz: "inquisitive", foo: { bar: "sand" } },
    { baz: "sand", foo: { bar: "screeching" } },
    { baz: "screeching", foo: { bar: "accept" } },
    { baz: "accept", foo: { bar: "appliance" } },
    { baz: "appliance", foo: { bar: "aware" } },
    { baz: "aware", foo: { bar: "train" } },
    { baz: "train", foo: { bar: "exultant" } },
    { baz: "exultant", foo: { bar: "greet" } },
    { baz: "greet", foo: { bar: "play" } },
    { baz: "play", foo: { bar: "invite" } },
    { baz: "invite", foo: { bar: "cherries" } },
    { baz: "cherries", foo: { bar: "fabulous" } },
    { baz: "fabulous", foo: { bar: "boorish" } },
    { baz: "boorish", foo: { bar: "dog" } },
    { baz: "dog", foo: { bar: "guitar" } },
    { baz: "guitar", foo: { bar: "base" } },
    { baz: "base", foo: { bar: "pat" } },
    { baz: "pat", foo: { bar: "annoy" } },
    { baz: "annoy", foo: { bar: "warn" } },
    { baz: "warn", foo: { bar: "basin" } },
    { baz: "basin", foo: { bar: "purring" } },
    { baz: "purring", foo: { bar: "abusive" } },
    { baz: "abusive", foo: { bar: "elderly" } },
    { baz: "elderly", foo: { bar: "bulb" } },
    { baz: "bulb", foo: { bar: "slave" } },
    { baz: "slave", foo: { bar: "interrupt" } },
    { baz: "interrupt", foo: { bar: "cheer" } },
    { baz: "cheer", foo: { bar: "noxious" } },
    { baz: "noxious", foo: { bar: "weight" } },
    { baz: "weight", foo: { bar: "attach" } },
    { baz: "attach", foo: { bar: "skip" } },
    { baz: "skip", foo: { bar: "sneaky" } },
    { baz: "sneaky", foo: { bar: "reply" } },
    { baz: "reply", foo: { bar: "rescue" } },
    { baz: "rescue", foo: { bar: "death" } },
    { baz: "death", foo: { bar: "jar" } },
    { baz: "jar", foo: { bar: "donkey" } },
    { baz: "donkey", foo: { bar: "soak" } },
    { baz: "soak", foo: { bar: "tough" } },
    { baz: "tough", foo: { bar: "license" } },
    { baz: "license", foo: { bar: "important" } },
    { baz: "important", foo: { bar: "team" } },
    { baz: "team", foo: { bar: "sassy" } },
    { baz: "sassy", foo: { bar: "protective" } },
    { baz: "protective", foo: { bar: "cheap" } },
    { baz: "cheap", foo: { bar: "abounding" } },
    { baz: "abounding", foo: { bar: "flight" } },
    { baz: "flight", foo: { bar: "hair" } },
    { baz: "hair", foo: { bar: "colour" } },
    { baz: "colour", foo: { bar: "absurd" } },
    { baz: "absurd", foo: { bar: "carry" } },
    { baz: "carry", foo: { bar: "sort" } },
    { baz: "sort", foo: { bar: "talented" } },
    { baz: "talented", foo: { bar: "toes" } },
    { baz: "toes", foo: { bar: "even" } },
    { baz: "even", foo: { bar: "crush" } },
    { baz: "crush", foo: { bar: "peace" } },
    { baz: "peace", foo: { bar: "grin" } },
    { baz: "grin", foo: { bar: "road" } },
    { baz: "road", foo: { bar: "back" } },
    { baz: "back", foo: { bar: "correct" } },
    { baz: "correct", foo: { bar: "introduce" } },
    { baz: "introduce", foo: { bar: "coat" } },
    { baz: "coat", foo: { bar: "spray" } },
    { baz: "spray", foo: { bar: "tan" } },
    { baz: "tan", foo: { bar: "mice" } },
    { baz: "mice", foo: { bar: "answer" } },
    { baz: "answer", foo: { bar: "drink" } },
    { baz: "drink", foo: { bar: "receive" } },
    { baz: "receive", foo: { bar: "baby" } },
    { baz: "baby", foo: { bar: "plough" } },
    { baz: "plough", foo: { bar: "wipe" } },
    { baz: "wipe", foo: { bar: "whip" } },
    { baz: "whip", foo: { bar: "invention" } },
    { baz: "invention", foo: { bar: "rub" } },
    { baz: "rub", foo: { bar: "fool" } },
    { baz: "fool", foo: { bar: "shake" } },
    { baz: "shake", foo: { bar: "large" } },
    { baz: "large", foo: { bar: "purple" } },
    { baz: "purple", foo: { bar: "bottle" } },
    { baz: "bottle", foo: { bar: "pocket" } },
    { baz: "pocket", foo: { bar: "marble" } },
    { baz: "marble", foo: { bar: "bells" } },
    { baz: "bells", foo: { bar: "erratic" } },
    { baz: "erratic", foo: { bar: "second-hand" } },
    { baz: "hand", foo: { bar: "regret" } },
    { baz: "regret", foo: { bar: "temper" } },
    { baz: "temper", foo: { bar: "stare" } },
    { baz: "stare", foo: { bar: "count" } },
    { baz: "count", foo: { bar: "vacuous" } },
    { baz: "vacuous", foo: { bar: "dreary" } },
    { baz: "dreary", foo: { bar: "juvenile" } },
    { baz: "juvenile", foo: { bar: "profuse" } },
    { baz: "profuse", foo: { bar: "deafening" } },
    { baz: "deafening", foo: { bar: "mix" } },
    { baz: "mix", foo: { bar: "wail" } },
    { baz: "wail", foo: { bar: "wish" } },
    { baz: "wish", foo: { bar: "hug" } },
    { baz: "hug", foo: { bar: "delicious" } },
    { baz: "delicious", foo: { bar: "share" } },
    { baz: "share", foo: { bar: "squirrel" } },
    { baz: "squirrel", foo: { bar: "caption" } },
    { baz: "caption", foo: { bar: "salty" } },
    { baz: "salty", foo: { bar: "station" } },
    { baz: "station", foo: { bar: "grey" } },
    { baz: "grey", foo: { bar: "enchanting" } },
    { baz: "enchanting", foo: { bar: "number" } },
    { baz: "number", foo: { bar: "mug" } },
    { baz: "mug", foo: { bar: "lamp" } },
    { baz: "lamp", foo: { bar: "special" } },
    { baz: "special", foo: { bar: "wrist" } },
    { baz: "wrist", foo: { bar: "numerous" } },
    { baz: "numerous", foo: { bar: "wide" } },
    { baz: "wide", foo: { bar: "scared" } },
    { baz: "scared", foo: { bar: "farm" } },
    { baz: "farm", foo: { bar: "instruct" } },
    { baz: "instruct", foo: { bar: "brown" } },
    { baz: "brown", foo: { bar: "underwear" } },
    { baz: "underwear", foo: { bar: "dashing" } },
    { baz: "dashing", foo: { bar: "salt" } },
    { baz: "salt", foo: { bar: "jealous" } },
    { baz: "jealous", foo: { bar: "gray" } },
    { baz: "gray", foo: { bar: "uninterested" } },
    { baz: "uninterested", foo: { bar: "aggressive" } },
    { baz: "aggressive", foo: { bar: "feigned" } },
    { baz: "feigned", foo: { bar: "nebulous" } },
    { baz: "nebulous", foo: { bar: "flawless" } },
    { baz: "flawless", foo: { bar: "afternoon" } },
    { baz: "afternoon", foo: { bar: "scent" } },
    { baz: "scent", foo: { bar: "group" } },
    { baz: "group", foo: { bar: "improve" } },
    { baz: "improve", foo: { bar: "pump" } },
    { baz: "pump", foo: { bar: "pushy" } },
    { baz: "pushy", foo: { bar: "little" } },
    { baz: "little", foo: { bar: "grouchy" } },
    { baz: "grouchy", foo: { bar: "chunky" } },
    { baz: "chunky", foo: { bar: "protest" } },
    { baz: "protest", foo: { bar: "cooperative" } },
    { baz: "cooperative", foo: { bar: "cold" } },
    { baz: "cold", foo: { bar: "enthusiastic" } },
    { baz: "enthusiastic", foo: { bar: "guttural" } },
    { baz: "guttural", foo: { bar: "heal" } },
    { baz: "heal", foo: { bar: "trace" } },
    { baz: "trace", foo: { bar: "wink" } },
    { baz: "wink", foo: { bar: "dangerous" } },
    { baz: "dangerous", foo: { bar: "graceful" } },
    { baz: "graceful", foo: { bar: "new" } },
    { baz: "new", foo: { bar: "enormous" } },
    { baz: "enormous", foo: { bar: "powerful" } },
    { baz: "powerful", foo: { bar: "ambitious" } },
    { baz: "ambitious", foo: { bar: "five" } },
    { baz: "five", foo: { bar: "wrap" } },
    { baz: "wrap", foo: { bar: "cry" } },
    { baz: "cry", foo: { bar: "object" } },
    { baz: "object", foo: { bar: "stage" } },
    { baz: "stage", foo: { bar: "minute" } },
    { baz: "minute", foo: { bar: "disastrous" } },
    { baz: "disastrous", foo: { bar: "loss" } },
    { baz: "loss", foo: { bar: "birds" } },
    { baz: "birds", foo: { bar: "describe" } },
    { baz: "describe", foo: { bar: "lyrical" } },
    { baz: "lyrical", foo: { bar: "rake" } },
    { baz: "rake", foo: { bar: "broad" } },
    { baz: "broad", foo: { bar: "stormy" } },
    { baz: "stormy", foo: { bar: "superficial" } },
    { baz: "superficial", foo: { bar: "evanescent" } },
    { baz: "evanescent", foo: { bar: "craven" } },
    { baz: "craven", foo: { bar: "overrated" } },
    { baz: "overrated", foo: { bar: "scale" } },
    { baz: "scale", foo: { bar: "forgetful" } },
    { baz: "forgetful", foo: { bar: "nine" } },
    { baz: "nine", foo: { bar: "accurate" } },
    { baz: "accurate", foo: { bar: "healthy" } },
    { baz: "healthy", foo: { bar: "unused" } },
    { baz: "unused", foo: { bar: "cruel" } },
    { baz: "cruel", foo: { bar: "bite" } },
    { baz: "bite", foo: { bar: "determined" } },
    { baz: "determined", foo: { bar: "guard" } },
    { baz: "guard", foo: { bar: "sweltering" } },
    { baz: "sweltering", foo: { bar: "aftermath" } },
    { baz: "aftermath", foo: { bar: "flagrant" } },
    { baz: "flagrant", foo: { bar: "zealous" } },
    { baz: "zealous", foo: { bar: "punishment" } },
    { baz: "punishment", foo: { bar: "full" } },
    { baz: "full", foo: { bar: "harbor" } },
    { baz: "harbor", foo: { bar: "story" } },
    { baz: "story", foo: { bar: "scarce" } },
    { baz: "scarce", foo: { bar: "health" } },
    { baz: "health", foo: { bar: "stomach" } },
    { baz: "stomach", foo: { bar: "curve" } },
    { baz: "curve", foo: { bar: "waiting" } },
    { baz: "waiting", foo: { bar: "recognise" } },
    { baz: "recognise", foo: { bar: "snake" } },
    { baz: "snake", foo: { bar: "ripe" } },
    { baz: "ripe", foo: { bar: "gamy" } },
    { baz: "gamy", foo: { bar: "complete" } },
    { baz: "complete", foo: { bar: "wrestle" } },
    { baz: "wrestle", foo: { bar: "angle" } },
    { baz: "angle", foo: { bar: "birthday" } },
    { baz: "birthday", foo: { bar: "seat" } },
    { baz: "seat", foo: { bar: "utter" } },
    { baz: "utter", foo: { bar: "left" } },
    { baz: "left", foo: { bar: "double" } },
    { baz: "double", foo: { bar: "late" } },
    { baz: "late", foo: { bar: "route" } },
    { baz: "route", foo: { bar: "sponge" } },
    { baz: "sponge", foo: { bar: "bad" } },
    { baz: "bad", foo: { bar: "pointless" } },
    { baz: "pointless", foo: { bar: "painful" } },
    { baz: "painful", foo: { bar: "line" } },
    { baz: "line", foo: { bar: "support" } },
    { baz: "support", foo: { bar: "transport" } },
    { baz: "transport", foo: { bar: "lace" } },
    { baz: "lace", foo: { bar: "knowledge" } },
    { baz: "knowledge", foo: { bar: "tin" } },
    { baz: "tin", foo: { bar: "attend" } },
    { baz: "attend", foo: { bar: "harass" } },
    { baz: "harass", foo: { bar: "ten" } },
    { baz: "ten", foo: { bar: "futuristic" } },
    { baz: "futuristic", foo: { bar: "suggest" } },
    { baz: "suggest", foo: { bar: "tawdry" } },
    { baz: "tawdry", foo: { bar: "misty" } },
    { baz: "misty", foo: { bar: "chase" } },
    { baz: "chase", foo: { bar: "psychotic" } },
    { baz: "psychotic", foo: { bar: "clumsy" } },
    { baz: "clumsy", foo: { bar: "guiltless" } },
    { baz: "guiltless", foo: { bar: "straight" } },
    { baz: "straight", foo: { bar: "safe" } },
    { baz: "safe", foo: { bar: "sulky" } },
    { baz: "sulky", foo: { bar: "abrupt" } },
    { baz: "abrupt", foo: { bar: "past" } },
    { baz: "past", foo: { bar: "grubby" } },
    { baz: "grubby", foo: { bar: "stocking" } },
    { baz: "stocking", foo: { bar: "wicked" } },
    { baz: "wicked", foo: { bar: "tasteless" } },
    { baz: "tasteless", foo: { bar: "physical" } },
    { baz: "physical", foo: { bar: "duck" } },
    { baz: "duck", foo: { bar: "empty" } },
    { baz: "empty", foo: { bar: "imperfect" } },
    { baz: "imperfect", foo: { bar: "rinse" } },
    { baz: "rinse", foo: { bar: "quarter" } },
    { baz: "quarter", foo: { bar: "unit" } },
    { baz: "unit", foo: { bar: "hour" } },
    { baz: "hour", foo: { bar: "sprout" } },
    { baz: "sprout", foo: { bar: "baseball" } },
    { baz: "baseball", foo: { bar: "try" } },
    { baz: "try", foo: { bar: "jog" } },
    { baz: "jog", foo: { bar: "dream" } },
    { baz: "dream", foo: { bar: "wind" } },
    { baz: "wind", foo: { bar: "same" } },
    { baz: "same", foo: { bar: "front" } },
    { baz: "front", foo: { bar: "fluttering" } },
    { baz: "fluttering", foo: { bar: "secretary" } },
    { baz: "secretary", foo: { bar: "oven" } },
    { baz: "oven", foo: { bar: "melted" } },
    { baz: "melted", foo: { bar: "reaction" } },
    { baz: "reaction", foo: { bar: "uncle" } },
    { baz: "uncle", foo: { bar: "show" } },
    { baz: "show", foo: { bar: "canvas" } },
    { baz: "canvas", foo: { bar: "furtive" } },
    { baz: "furtive", foo: { bar: "error" } },
    { baz: "error", foo: { bar: "quince" } },
    { baz: "quince", foo: { bar: "mate" } },
    { baz: "mate", foo: { bar: "racial" } },
    { baz: "racial", foo: { bar: "drown" } },
    { baz: "drown", foo: { bar: "strong" } },
    { baz: "strong", foo: { bar: "second" } },
    { baz: "second", foo: { bar: "lunch" } },
    { baz: "lunch", foo: { bar: "queue" } },
    { baz: "queue", foo: { bar: "honey" } },
    { baz: "honey", foo: { bar: "preserve" } },
    { baz: "preserve", foo: { bar: "strap" } },
    { baz: "strap", foo: { bar: "barbarous" } },
    { baz: "barbarous", foo: { bar: "ignorant" } },
    { baz: "ignorant", foo: { bar: "squeamish" } },
    { baz: "squeamish", foo: { bar: "vivacious" } },
    { baz: "vivacious", foo: { bar: "cluttered" } },
    { baz: "cluttered", foo: { bar: "listen" } },
    { baz: "listen", foo: { bar: "cars" } },
    { baz: "cars", foo: { bar: "sparkle" } },
    { baz: "sparkle", foo: { bar: "brash" } },
    { baz: "brash", foo: { bar: "satisfy" } },
    { baz: "satisfy", foo: { bar: "ruddy" } },
    { baz: "ruddy", foo: { bar: "mindless" } },
    { baz: "mindless", foo: { bar: "selfish" } },
    { baz: "selfish", foo: { bar: "concern" } },
    { baz: "concern", foo: { bar: "bead" } },
    { baz: "bead", foo: { bar: "room" } },
    { baz: "room", foo: { bar: "violent" } },
    { baz: "violent", foo: { bar: "aback" } },
    { baz: "aback", foo: { bar: "crabby" } },
    { baz: "crabby", foo: { bar: "star" } },
    { baz: "star", foo: { bar: "alluring" } },
    { baz: "alluring", foo: { bar: "feeble" } },
    { baz: "feeble", foo: { bar: "meddle" } },
    { baz: "meddle", foo: { bar: "itchy" } },
    { baz: "itchy", foo: { bar: "breath" } },
    { baz: "breath", foo: { bar: "vessel" } },
    { baz: "vessel", foo: { bar: "egg" } },
    { baz: "egg", foo: { bar: "electric" } },
    { baz: "electric", foo: { bar: "trees" } },
    { baz: "trees", foo: { bar: "grain" } },
    { baz: "grain", foo: { bar: "steam" } },
    { baz: "steam", foo: { bar: "cats" } },
    { baz: "cats", foo: { bar: "permissible" } },
    { baz: "permissible", foo: { bar: "check" } },
    { baz: "check", foo: { bar: "astonishing" } },
    { baz: "astonishing", foo: { bar: "organic" } },
    { baz: "organic", foo: { bar: "direful" } },
    { baz: "direful", foo: { bar: "soothe" } },
    { baz: "soothe", foo: { bar: "pot" } },
    { baz: "pot", foo: { bar: "leather" } },
    { baz: "leather", foo: { bar: "animal" } },
    { baz: "animal", foo: { bar: "addicted" } },
    { baz: "addicted", foo: { bar: "carve" } },
    { baz: "carve", foo: { bar: "payment" } },
    { baz: "payment", foo: { bar: "gratis" } },
    { baz: "gratis", foo: { bar: "release" } },
    { baz: "release", foo: { bar: "quizzical" } },
    { baz: "quizzical", foo: { bar: "north" } },
    { baz: "north", foo: { bar: "boot" } },
    { baz: "boot", foo: { bar: "found" } },
    { baz: "found", foo: { bar: "yell" } },
    { baz: "yell", foo: { bar: "encouraging" } },
    { baz: "encouraging", foo: { bar: "workable" } },
    { baz: "workable", foo: { bar: "grotesque" } },
    { baz: "grotesque", foo: { bar: "ubiquitous" } },
    { baz: "ubiquitous", foo: { bar: "puny" } },
    { baz: "puny", foo: { bar: "passenger" } },
    { baz: "passenger", foo: { bar: "fasten" } },
    { baz: "fasten", foo: { bar: "irritate" } },
    { baz: "irritate", foo: { bar: "recess" } },
    { baz: "recess", foo: { bar: "insect" } },
    { baz: "insect", foo: { bar: "annoyed" } },
    { baz: "annoyed", foo: { bar: "disgusting" } },
    { baz: "disgusting", foo: { bar: "deceive" } },
    { baz: "deceive", foo: { bar: "continue" } },
    { baz: "continue", foo: { bar: "wing" } },
    { baz: "wing", foo: { bar: "striped" } },
    { baz: "striped", foo: { bar: "statuesque" } },
    { baz: "statuesque", foo: { bar: "permit" } },
    { baz: "permit", foo: { bar: "debonair" } },
    { baz: "debonair", foo: { bar: "foot" } },
    { baz: "foot", foo: { bar: "madly" } },
    { baz: "madly", foo: { bar: "pale" } },
    { baz: "pale", foo: { bar: "enter" } },
    { baz: "enter", foo: { bar: "chickens" } },
    { baz: "chickens", foo: { bar: "memory" } },
    { baz: "memory", foo: { bar: "cross" } },
    { baz: "cross", foo: { bar: "horrible" } },
    { baz: "horrible", foo: { bar: "flavor" } },
    { baz: "flavor", foo: { bar: "groan" } },
    { baz: "groan", foo: { bar: "amount" } },
    { baz: "amount", foo: { bar: "extend" } },
    { baz: "extend", foo: { bar: "side" } },
    { baz: "side", foo: { bar: "vulgar" } },
    { baz: "vulgar", foo: { bar: "rotten" } },
    { baz: "rotten", foo: { bar: "scarf" } },
    { baz: "scarf", foo: { bar: "brass" } },
    { baz: "brass", foo: { bar: "boring" } },
    { baz: "boring", foo: { bar: "creator" } },
    { baz: "creator", foo: { bar: "need" } },
    { baz: "need", foo: { bar: "difficult" } },
    { baz: "difficult", foo: { bar: "authority" } },
    { baz: "authority", foo: { bar: "quarrelsome" } },
    { baz: "quarrelsome", foo: { bar: "hurt" } },
    { baz: "hurt", foo: { bar: "quartz" } },
    { baz: "quartz", foo: { bar: "haircut" } },
    { baz: "haircut", foo: { bar: "elated" } },
    { baz: "elated", foo: { bar: "babies" } },
    { baz: "babies", foo: { bar: "slim" } },
    { baz: "slim", foo: { bar: "juice" } },
    { baz: "juice", foo: { bar: "subtract" } },
    { baz: "subtract", foo: { bar: "communicate" } },
    { baz: "communicate", foo: { bar: "hateful" } },
    { baz: "hateful", foo: { bar: "cautious" } },
    { baz: "cautious", foo: { bar: "vague" } },
    { baz: "vague", foo: { bar: "texture" } },
    { baz: "texture", foo: { bar: "question" } },
    { baz: "question", foo: { bar: "needle" } },
    { baz: "needle", foo: { bar: "cast" } },
    { baz: "cast", foo: { bar: "erect" } },
    { baz: "erect", foo: { bar: "replace" } },
    { baz: "replace", foo: { bar: "size" } },
    { baz: "size", foo: { bar: "bee" } },
    { baz: "bee", foo: { bar: "kaput" } },
    { baz: "kaput", foo: { bar: "suit" } },
    { baz: "suit", foo: { bar: "classy" } },
    { baz: "classy", foo: { bar: "maid" } },
    { baz: "maid", foo: { bar: "gaze" } },
    { baz: "gaze", foo: { bar: "hungry" } },
    { baz: "hungry", foo: { bar: "fail" } },
    { baz: "fail", foo: { bar: "smiling" } },
    { baz: "smiling", foo: { bar: "angry" } },
    { baz: "angry", foo: { bar: "spade" } },
    { baz: "spade", foo: { bar: "berserk" } },
    { baz: "berserk", foo: { bar: "compete" } },
    { baz: "compete", foo: { bar: "evasive" } },
    { baz: "evasive", foo: { bar: "toothpaste" } },
    { baz: "toothpaste", foo: { bar: "dry" } },
    { baz: "dry", foo: { bar: "chalk" } },
    { baz: "chalk", foo: { bar: "ink" } },
    { baz: "ink", foo: { bar: "vanish" } },
    { baz: "vanish", foo: { bar: "luxuriant" } },
    { baz: "luxuriant", foo: { bar: "fortunate" } },
    { baz: "fortunate", foo: { bar: "allow" } },
    { baz: "allow", foo: { bar: "yielding" } },
    { baz: "yielding", foo: { bar: "loose" } },
    { baz: "loose", foo: { bar: "rhyme" } },
    { baz: "rhyme", foo: { bar: "stupendous" } },
    { baz: "stupendous", foo: { bar: "cap" } },
    { baz: "cap", foo: { bar: "standing" } },
    { baz: "standing", foo: { bar: "fragile" } },
    { baz: "fragile", foo: { bar: "drawer" } },
    { baz: "drawer", foo: { bar: "different" } },
    { baz: "different", foo: { bar: "frightened" } },
    { baz: "frightened", foo: { bar: "sack" } },
    { baz: "sack", foo: { bar: "place" } },
    { baz: "place", foo: { bar: "grandmother" } },
    { baz: "grandmother", foo: { bar: "functional" } },
    { baz: "functional", foo: { bar: "insidious" } },
    { baz: "insidious", foo: { bar: "insurance" } },
    { baz: "insurance", foo: { bar: "afford" } },
    { baz: "afford", foo: { bar: "swanky" } },
    { baz: "swanky", foo: { bar: "want" } },
    { baz: "want", foo: { bar: "grandfather" } },
    { baz: "grandfather", foo: { bar: "bored" } },
    { baz: "bored", foo: { bar: "unadvised" } },
    { baz: "unadvised", foo: { bar: "flash" } },
    { baz: "flash", foo: { bar: "like" } },
    { baz: "like", foo: { bar: "uncovered" } },
    { baz: "uncovered", foo: { bar: "fade" } },
    { baz: "fade", foo: { bar: "inject" } },
    { baz: "inject", foo: { bar: "tie" } },
    { baz: "tie", foo: { bar: "fire" } },
    { baz: "fire", foo: { bar: "letter" } },
    { baz: "letter", foo: { bar: "treat" } },
    { baz: "treat", foo: { bar: "pet" } },
    { baz: "pet", foo: { bar: "powder" } },
    { baz: "powder", foo: { bar: "ill" } },
    { baz: "ill", foo: { bar: "boil" } },
    { baz: "boil", foo: { bar: "wax" } },
    { baz: "wax", foo: { bar: "zesty" } },
    { baz: "zesty", foo: { bar: "rigid" } },
    { baz: "rigid", foo: { bar: "sock" } },
    { baz: "sock", foo: { bar: "wanting" } },
    { baz: "wanting", foo: { bar: "tested" } },
    { baz: "tested", foo: { bar: "partner" } },
    { baz: "partner", foo: { bar: "possess" } },
    { baz: "possess", foo: { bar: "cow" } },
    { baz: "cow", foo: { bar: "unusual" } },
    { baz: "unusual", foo: { bar: "army" } },
    { baz: "army", foo: { bar: "parallel" } },
    { baz: "parallel", foo: { bar: "spill" } },
    { baz: "spill", foo: { bar: "cloudy" } },
    { baz: "cloudy", foo: { bar: "illegal" } },
    { baz: "illegal", foo: { bar: "laugh" } },
    { baz: "laugh", foo: { bar: "punish" } },
    { baz: "punish", foo: { bar: "war" } },
    { baz: "war", foo: { bar: "level" } },
    { baz: "level", foo: { bar: "horses" } },
    { baz: "horses", foo: { bar: "opposite" } },
    { baz: "opposite", foo: { bar: "mind" } },
    { baz: "mind", foo: { bar: "humor" } },
    { baz: "humor", foo: { bar: "seashore" } },
    { baz: "seashore", foo: { bar: "wire" } },
    { baz: "wire", foo: { bar: "face" } },
    { baz: "face", foo: { bar: "superb" } },
    { baz: "superb", foo: { bar: "spurious" } },
    { baz: "spurious", foo: { bar: "quill" } },
    { baz: "quill", foo: { bar: "mint" } },
    { baz: "mint", foo: { bar: "nippy" } },
    { baz: "nippy", foo: { bar: "staking" } },
    { baz: "staking", foo: { bar: "known" } },
    { baz: "known", foo: { bar: "scatter" } },
    { baz: "scatter", foo: { bar: "office" } },
    { baz: "office", foo: { bar: "bathe" } },
    { baz: "bathe", foo: { bar: "momentous" } },
    { baz: "momentous", foo: { bar: "shiny" } },
    { baz: "shiny", foo: { bar: "boundless" } },
    { baz: "boundless", foo: { bar: "substance" } },
    { baz: "substance", foo: { bar: "supreme" } },
    { baz: "supreme", foo: { bar: "gainful" } },
    { baz: "gainful", foo: { bar: "muddle" } },
    { baz: "muddle", foo: { bar: "versed" } },
    { baz: "versed", foo: { bar: "warlike" } },
    { baz: "warlike", foo: { bar: "spring" } },
    { baz: "spring", foo: { bar: "neighborly" } },
    { baz: "neighborly", foo: { bar: "weather" } },
    { baz: "weather", foo: { bar: "strengthen" } },
    { baz: "strengthen", foo: { bar: "kettle" } },
    { baz: "kettle", foo: { bar: "pray" } },
    { baz: "pray", foo: { bar: "burly" } },
    { baz: "burly", foo: { bar: "pan" } },
    { baz: "pan", foo: { bar: "snow" } },
    { baz: "snow", foo: { bar: "raise" } },
    { baz: "raise", foo: { bar: "dinosaurs" } },
    { baz: "dinosaurs", foo: { bar: "club" } },
    { baz: "club", foo: { bar: "join" } },
    { baz: "join", foo: { bar: "incompetent" } },
    { baz: "incompetent", foo: { bar: "waves" } },
    { baz: "waves", foo: { bar: "range" } },
    { baz: "range", foo: { bar: "rightful" } },
    { baz: "rightful", foo: { bar: "bite-sized" } },
    { baz: "sized", foo: { bar: "hop" } },
    { baz: "hop", foo: { bar: "whisper" } },
    { baz: "whisper", foo: { bar: "bloody" } },
    { baz: "bloody", foo: { bar: "mitten" } },
    { baz: "mitten", foo: { bar: "theory" } },
    { baz: "theory", foo: { bar: "motionless" } },
    { baz: "motionless", foo: { bar: "two" } },
    { baz: "two", foo: { bar: "panoramic" } },
    { baz: "panoramic", foo: { bar: "spot" } },
    { baz: "spot", foo: { bar: "black-and-white" } },
    { baz: "white", foo: { bar: "shivering" } },
    { baz: "shivering", foo: { bar: "nod" } },
    { baz: "nod", foo: { bar: "blue" } },
    { baz: "blue", foo: { bar: "labored" } },
    { baz: "labored", foo: { bar: "macho" } },
    { baz: "macho", foo: { bar: "market" } },
    { baz: "market", foo: { bar: "fish" } },
    { baz: "fish", foo: { bar: "stamp" } },
    { baz: "stamp", foo: { bar: "hydrant" } },
    { baz: "hydrant", foo: { bar: "brainy" } },
    { baz: "brainy", foo: { bar: "zoo" } },
    { baz: "zoo", foo: { bar: "mundane" } },
    { baz: "mundane", foo: { bar: "teeny" } },
    { baz: "teeny", foo: { bar: "amusement" } },
    { baz: "amusement", foo: { bar: "work" } },
    { baz: "work", foo: { bar: "milky" } },
    { baz: "milky", foo: { bar: "limit" } },
    { baz: "limit", foo: { bar: "heady" } },
    { baz: "heady", foo: { bar: "shape" } },
    { baz: "shape", foo: { bar: "vase" } },
    { baz: "vase", foo: { bar: "youthful" } },
    { baz: "youthful", foo: { bar: "trouble" } },
    { baz: "trouble", foo: { bar: "search" } },
    { baz: "search", foo: { bar: "treatment" } },
    { baz: "treatment", foo: { bar: "aromatic" } },
    { baz: "aromatic", foo: { bar: "phobic" } },
    { baz: "phobic", foo: { bar: "animated" } },
    { baz: "animated", foo: { bar: "floor" } },
    { baz: "floor", foo: { bar: "scrawny" } },
    { baz: "scrawny", foo: { bar: "proud" } },
    { baz: "proud", foo: { bar: "file" } },
    { baz: "file", foo: { bar: "round" } },
    { baz: "round", foo: { bar: "digestion" } },
    { baz: "digestion", foo: { bar: "blind" } },
    { baz: "blind", foo: { bar: "visit" } },
    { baz: "visit", foo: { bar: "languid" } },
    { baz: "languid", foo: { bar: "parched" } },
    { baz: "parched", foo: { bar: "zip" } },
    { baz: "zip", foo: { bar: "tap" } },
    { baz: "tap", foo: { bar: "trick" } },
    { baz: "trick", foo: { bar: "embarrass" } },
    { baz: "embarrass", foo: { bar: "mere" } },
    { baz: "mere", foo: { bar: "confuse" } },
    { baz: "confuse", foo: { bar: "earn" } },
    { baz: "earn", foo: { bar: "fallacious" } },
    { baz: "fallacious", foo: { bar: "obscene" } },
    { baz: "obscene", foo: { bar: "reward" } },
    { baz: "reward", foo: { bar: "mass" } },
    { baz: "mass", foo: { bar: "precede" } },
    { baz: "precede", foo: { bar: "glistening" } },
    { baz: "glistening", foo: { bar: "gate" } },
    { baz: "gate", foo: { bar: "signal" } },
    { baz: "signal", foo: { bar: "freezing" } },
    { baz: "freezing", foo: { bar: "domineering" } },
    { baz: "domineering", foo: { bar: "berry" } },
    { baz: "berry", foo: { bar: "separate" } },
    { baz: "separate", foo: { bar: "abandoned" } },
    { baz: "abandoned", foo: { bar: "puzzled" } },
    { baz: "puzzled", foo: { bar: "degree" } },
    { baz: "degree", foo: { bar: "existence" } },
    { baz: "existence", foo: { bar: "suck" } },
    { baz: "suck", foo: { bar: "obey" } },
    { baz: "obey", foo: { bar: "pear" } },
    { baz: "pear", foo: { bar: "structure" } },
    { baz: "structure", foo: { bar: "cent" } },
    { baz: "cent", foo: { bar: "plucky" } },
    { baz: "plucky", foo: { bar: "huge" } },
    { baz: "huge", foo: { bar: "bed" } },
    { baz: "bed", foo: { bar: "robin" } },
    { baz: "robin", foo: { bar: "vacation" } },
    { baz: "vacation", foo: { bar: "deserted" } },
    { baz: "deserted", foo: { bar: "summer" } },
    { baz: "summer", foo: { bar: "desert" } },
    { baz: "desert", foo: { bar: "jelly" } },
    { baz: "jelly", foo: { bar: "nerve" } },
    { baz: "nerve", foo: { bar: "river" } },
    { baz: "river", foo: { bar: "rambunctious" } },
    { baz: "rambunctious", foo: { bar: "fax" } },
    { baz: "fax", foo: { bar: "eight" } },
    { baz: "eight", foo: { bar: "humdrum" } },
    { baz: "humdrum", foo: { bar: "crowd" } },
    { baz: "crowd", foo: { bar: "ultra" } },
    { baz: "ultra", foo: { bar: "first" } },
    { baz: "first", foo: { bar: "repeat" } },
    { baz: "repeat", foo: { bar: "smoke" } },
    { baz: "smoke", foo: { bar: "moor" } },
    { baz: "moor", foo: { bar: "complex" } },
    { baz: "complex", foo: { bar: "subsequent" } },
    { baz: "subsequent", foo: { bar: "sigh" } },
    { baz: "sigh", foo: { bar: "cracker" } },
    { baz: "cracker", foo: { bar: "deserve" } },
    { baz: "deserve", foo: { bar: "exciting" } },
    { baz: "exciting", foo: { bar: "things" } },
    { baz: "things", foo: { bar: "heartbreaking" } },
    { baz: "heartbreaking", foo: { bar: "pies" } },
    { baz: "pies", foo: { bar: "cagey" } },
    { baz: "cagey", foo: { bar: "uppity" } },
    { baz: "uppity", foo: { bar: "grieving" } },
    { baz: "grieving", foo: { bar: "playground" } },
    { baz: "playground", foo: { bar: "spell" } },
    { baz: "spell", foo: { bar: "sad" } },
    { baz: "sad", foo: { bar: "relax" } },
    { baz: "relax", foo: { bar: "risk" } },
    { baz: "risk", foo: { bar: "shame" } },
    { baz: "shame", foo: { bar: "society" } },
    { baz: "society", foo: { bar: "afraid" } },
    { baz: "afraid", foo: { bar: "puzzling" } },
    { baz: "puzzling", foo: { bar: "suspend" } },
    { baz: "suspend", foo: { bar: "close" } },
    { baz: "close", foo: { bar: "old-fashioned" } },
    { baz: "fashioned", foo: { bar: "satisfying" } },
    { baz: "satisfying", foo: { bar: "dolls" } },
    { baz: "dolls", foo: { bar: "lighten" } },
    { baz: "lighten", foo: { bar: "hallowed" } },
    { baz: "hallowed", foo: { bar: "government" } },
    { baz: "government", foo: { bar: "amuck" } },
    { baz: "amuck", foo: { bar: "collect" } },
    { baz: "collect", foo: { bar: "verdant" } },
    { baz: "verdant", foo: { bar: "appreciate" } },
    { baz: "appreciate", foo: { bar: "relieved" } },
    { baz: "relieved", foo: { bar: "plant" } },
    { baz: "plant", foo: { bar: "tart" } },
    { baz: "tart", foo: { bar: "cannon" } },
    { baz: "cannon", foo: { bar: "general" } },
    { baz: "general", foo: { bar: "string" } },
    { baz: "string", foo: { bar: "third" } },
    { baz: "third", foo: { bar: "sordid" } },
    { baz: "sordid", foo: { bar: "educated" } },
    { baz: "educated", foo: { bar: "wound" } },
    { baz: "wound", foo: { bar: "volleyball" } },
    { baz: "volleyball", foo: { bar: "guide" } },
    { baz: "guide", foo: { bar: "refuse" } },
    { baz: "refuse", foo: { bar: "rough" } },
    { baz: "rough", foo: { bar: "scarecrow" } },
    { baz: "scarecrow", foo: { bar: "fruit" } },
    { baz: "fruit", foo: { bar: "zinc" } },
    { baz: "zinc", foo: { bar: "knife" } },
    { baz: "knife", foo: { bar: "dead" } },
    { baz: "dead", foo: { bar: "profit" } },
    { baz: "profit", foo: { bar: "damaged" } },
    { baz: "damaged", foo: { bar: "aboriginal" } },
    { baz: "aboriginal", foo: { bar: "ski" } },
    { baz: "ski", foo: { bar: "flesh" } },
    { baz: "flesh", foo: { bar: "telling" } },
    { baz: "telling", foo: { bar: "match" } },
    { baz: "match", foo: { bar: "dust" } },
    { baz: "dust", foo: { bar: "steep" } },
    { baz: "steep", foo: { bar: "joke" } },
    { baz: "joke", foo: { bar: "memorise" } },
    { baz: "memorise", foo: { bar: "disgusted" } },
    { baz: "disgusted", foo: { bar: "adaptable" } },
    { baz: "adaptable", foo: { bar: "snore" } },
    { baz: "snore", foo: { bar: "view" } },
    { baz: "view", foo: { bar: "modern" } },
    { baz: "modern", foo: { bar: "pleasant" } },
    { baz: "pleasant", foo: { bar: "pretty" } },
    { baz: "pretty", foo: { bar: "volcano" } },
    { baz: "volcano", foo: { bar: "arrogant" } }
  ]
};

},{"../dist/index.js":1}],3:[function(require,module,exports){
/**
 * A function that always returns `false`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.T
 * @example
 *
 *      R.F(); //=> false
 */
var F = function () {
  return false;
};

module.exports = F;
},{}],4:[function(require,module,exports){
/**
 * A function that always returns `true`. Any passed in parameters are ignored.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig * -> Boolean
 * @param {*}
 * @return {Boolean}
 * @see R.F
 * @example
 *
 *      R.T(); //=> true
 */
var T = function () {
  return true;
};

module.exports = T;
},{}],5:[function(require,module,exports){
/**
 * A special placeholder value used to specify "gaps" within curried functions,
 * allowing partial application of any combination of arguments, regardless of
 * their positions.
 *
 * If `g` is a curried ternary function and `_` is `R.__`, the following are
 * equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2, _)(1, 3)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @name __
 * @constant
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @example
 *
 *      const greet = R.replace('{name}', R.__, 'Hello, {name}!');
 *      greet('Alice'); //=> 'Hello, Alice!'
 */
module.exports = {
  '@@functional/placeholder': true
};
},{}],6:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Adds two values.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @see R.subtract
 * @example
 *
 *      R.add(2, 3);       //=>  5
 *      R.add(7)(10);      //=> 17
 */


var add =
/*#__PURE__*/
_curry2(function add(a, b) {
  return Number(a) + Number(b);
});

module.exports = add;
},{"./internal/_curry2":110}],7:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Creates a new list iteration function from an existing one by adding two new
 * parameters to its callback function: the current index, and the entire list.
 *
 * This would turn, for instance, [`R.map`](#map) function into one that
 * more closely resembles `Array.prototype.map`. Note that this will only work
 * for functions in which the iteration callback function is the first
 * parameter, and where the list is the last parameter. (This latter might be
 * unimportant if the list parameter is not used.)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Function
 * @category List
 * @sig ((a ... -> b) ... -> [a] -> *) -> ((a ..., Int, [a] -> b) ... -> [a] -> *)
 * @param {Function} fn A list iteration function that does not pass index or list to its callback
 * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
 * @example
 *
 *      const mapIndexed = R.addIndex(R.map);
 *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
 *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
 */


var addIndex =
/*#__PURE__*/
_curry1(function addIndex(fn) {
  return curryN(fn.length, function () {
    var idx = 0;
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var args = Array.prototype.slice.call(arguments, 0);

    args[0] = function () {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx += 1;
      return result;
    };

    return fn.apply(this, args);
  });
});

module.exports = addIndex;
},{"./curryN":46,"./internal/_concat":107,"./internal/_curry1":109}],8:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Applies a function to the value at the given index of an array, returning a
 * new copy of the array with the element at the given index replaced with the
 * result of the function application.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> (a -> a) -> [a] -> [a]
 * @param {Number} idx The index.
 * @param {Function} fn The function to apply.
 * @param {Array|Arguments} list An array-like object whose value
 *        at the supplied index will be replaced.
 * @return {Array} A copy of the supplied array-like object with
 *         the element at index `idx` replaced with the value
 *         returned by applying `fn` to the existing element.
 * @see R.update
 * @example
 *
 *      R.adjust(1, R.toUpper, ['a', 'b', 'c', 'd']);      //=> ['a', 'B', 'c', 'd']
 *      R.adjust(-1, R.toUpper, ['a', 'b', 'c', 'd']);     //=> ['a', 'b', 'c', 'D']
 * @symb R.adjust(-1, f, [a, b]) = [a, f(b)]
 * @symb R.adjust(0, f, [a, b]) = [f(a), b]
 */


var adjust =
/*#__PURE__*/
_curry3(function adjust(idx, fn, list) {
  if (idx >= list.length || idx < -list.length) {
    return list;
  }

  var start = idx < 0 ? list.length : 0;

  var _idx = start + idx;

  var _list = _concat(list);

  _list[_idx] = fn(list[_idx]);
  return _list;
});

module.exports = adjust;
},{"./internal/_concat":107,"./internal/_curry3":111}],9:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xall =
/*#__PURE__*/
require("./internal/_xall");
/**
 * Returns `true` if all elements of the list match the predicate, `false` if
 * there are any that don't.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
 *         otherwise.
 * @see R.any, R.none, R.transduce
 * @example
 *
 *      const equals3 = R.equals(3);
 *      R.all(equals3)([3, 3, 3, 3]); //=> true
 *      R.all(equals3)([3, 3, 1, 3]); //=> false
 */


var all =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['all'], _xall, function all(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (!fn(list[idx])) {
      return false;
    }

    idx += 1;
  }

  return true;
}));

module.exports = all;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xall":150}],10:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");

var max =
/*#__PURE__*/
require("./max");

var pluck =
/*#__PURE__*/
require("./pluck");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if every one of the provided predicates is satisfied
 * by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.anyPass
 * @example
 *
 *      const isQueen = R.propEq('rank', 'Q');
 *      const isSpade = R.propEq('suit', '♠︎');
 *      const isQueenOfSpades = R.allPass([isQueen, isSpade]);
 *
 *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
 *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
 */


var allPass =
/*#__PURE__*/
_curry1(function allPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (!preds[idx].apply(this, arguments)) {
        return false;
      }

      idx += 1;
    }

    return true;
  });
});

module.exports = allPass;
},{"./curryN":46,"./internal/_curry1":109,"./max":201,"./pluck":251,"./reduce":262}],11:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Returns a function that always returns the given value. Note that for
 * non-primitives the value returned is a reference to the original value.
 *
 * This function is known as `const`, `constant`, or `K` (for K combinator) in
 * other languages and libraries.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> (* -> a)
 * @param {*} val The value to wrap in a function
 * @return {Function} A Function :: * -> val.
 * @example
 *
 *      const t = R.always('Tee');
 *      t(); //=> 'Tee'
 */


var always =
/*#__PURE__*/
_curry1(function always(val) {
  return function () {
    return val;
  };
});

module.exports = always;
},{"./internal/_curry1":109}],12:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if both arguments are `true`; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any} the first argument if it is falsy, otherwise the second argument.
 * @see R.both, R.xor
 * @example
 *
 *      R.and(true, true); //=> true
 *      R.and(true, false); //=> false
 *      R.and(false, true); //=> false
 *      R.and(false, false); //=> false
 */


var and =
/*#__PURE__*/
_curry2(function and(a, b) {
  return a && b;
});

module.exports = and;
},{"./internal/_curry2":110}],13:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _assertPromise =
/*#__PURE__*/
require("./internal/_assertPromise");
/**
 * Returns the result of applying the onSuccess function to the value inside
 * a successfully resolved promise. This is useful for working with promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.27.0
 * @category Function
 * @sig (a -> b) -> (Promise e a) -> (Promise e b)
 * @sig (a -> (Promise e b)) -> (Promise e a) -> (Promise e b)
 * @param {Function} onSuccess The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(onSuccess)`
 * @see R.otherwise
 * @example
 *
 *      var makeQuery = (email) => ({ query: { email }});
 *
 *      //getMemberName :: String -> Promise ({firstName, lastName})
 *      var getMemberName = R.pipe(
 *        makeQuery,
 *        fetchMember,
 *        R.andThen(R.pick(['firstName', 'lastName']))
 *      );
 */


var andThen =
/*#__PURE__*/
_curry2(function andThen(f, p) {
  _assertPromise('andThen', p);

  return p.then(f);
});

module.exports = andThen;
},{"./internal/_assertPromise":102,"./internal/_curry2":110}],14:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xany =
/*#__PURE__*/
require("./internal/_xany");
/**
 * Returns `true` if at least one of the elements of the list match the predicate,
 * `false` otherwise.
 *
 * Dispatches to the `any` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
 *         otherwise.
 * @see R.all, R.none, R.transduce
 * @example
 *
 *      const lessThan0 = R.flip(R.lt)(0);
 *      const lessThan2 = R.flip(R.lt)(2);
 *      R.any(lessThan0)([1, 2]); //=> false
 *      R.any(lessThan2)([1, 2]); //=> true
 */


var any =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['any'], _xany, function any(fn, list) {
  var idx = 0;

  while (idx < list.length) {
    if (fn(list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}));

module.exports = any;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xany":151}],15:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");

var max =
/*#__PURE__*/
require("./max");

var pluck =
/*#__PURE__*/
require("./pluck");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Takes a list of predicates and returns a predicate that returns true for a
 * given list of arguments if at least one of the provided predicates is
 * satisfied by those arguments.
 *
 * The function returned is a curried function whose arity matches that of the
 * highest-arity predicate.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Logic
 * @sig [(*... -> Boolean)] -> (*... -> Boolean)
 * @param {Array} predicates An array of predicates to check
 * @return {Function} The combined predicate
 * @see R.allPass
 * @example
 *
 *      const isClub = R.propEq('suit', '♣');
 *      const isSpade = R.propEq('suit', '♠');
 *      const isBlackCard = R.anyPass([isClub, isSpade]);
 *
 *      isBlackCard({rank: '10', suit: '♣'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♠'}); //=> true
 *      isBlackCard({rank: 'Q', suit: '♦'}); //=> false
 */


var anyPass =
/*#__PURE__*/
_curry1(function anyPass(preds) {
  return curryN(reduce(max, 0, pluck('length', preds)), function () {
    var idx = 0;
    var len = preds.length;

    while (idx < len) {
      if (preds[idx].apply(this, arguments)) {
        return true;
      }

      idx += 1;
    }

    return false;
  });
});

module.exports = anyPass;
},{"./curryN":46,"./internal/_curry1":109,"./max":201,"./pluck":251,"./reduce":262}],16:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var map =
/*#__PURE__*/
require("./map");
/**
 * ap applies a list of functions to a list of values.
 *
 * Dispatches to the `ap` method of the second argument, if present. Also
 * treats curried functions as applicatives.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig [a -> b] -> [a] -> [b]
 * @sig Apply f => f (a -> b) -> f a -> f b
 * @sig (r -> a -> b) -> (r -> a) -> (r -> b)
 * @param {*} applyF
 * @param {*} applyX
 * @return {*}
 * @example
 *
 *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
 *      R.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> ["tasty pizza", "tasty salad", "PIZZA", "SALAD"]
 *
 *      // R.ap can also be used as S combinator
 *      // when only two functions are passed
 *      R.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'
 * @symb R.ap([f, g], [a, b]) = [f(a), f(b), g(a), g(b)]
 */


var ap =
/*#__PURE__*/
_curry2(function ap(applyF, applyX) {
  return typeof applyX['fantasy-land/ap'] === 'function' ? applyX['fantasy-land/ap'](applyF) : typeof applyF.ap === 'function' ? applyF.ap(applyX) : typeof applyF === 'function' ? function (x) {
    return applyF(x)(applyX(x));
  } : _reduce(function (acc, f) {
    return _concat(acc, map(f, applyX));
  }, [], applyF);
});

module.exports = ap;
},{"./internal/_concat":107,"./internal/_curry2":110,"./internal/_reduce":145,"./map":195}],17:[function(require,module,exports){
var _aperture =
/*#__PURE__*/
require("./internal/_aperture");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xaperture =
/*#__PURE__*/
require("./internal/_xaperture");
/**
 * Returns a new list, composed of n-tuples of consecutive elements. If `n` is
 * greater than the length of the list, an empty list is returned.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @param {Number} n The size of the tuples to create
 * @param {Array} list The list to split into `n`-length tuples
 * @return {Array} The resulting list of `n`-length tuples
 * @see R.transduce
 * @example
 *
 *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
 *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
 */


var aperture =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xaperture, _aperture));

module.exports = aperture;
},{"./internal/_aperture":99,"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xaperture":152}],18:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a new list containing the contents of the given list, followed by
 * the given element.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The element to add to the end of the new list.
 * @param {Array} list The list of elements to add a new item to.
 *        list.
 * @return {Array} A new list containing the elements of the old list followed by `el`.
 * @see R.prepend
 * @example
 *
 *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
 *      R.append('tests', []); //=> ['tests']
 *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
 */


var append =
/*#__PURE__*/
_curry2(function append(el, list) {
  return _concat(list, [el]);
});

module.exports = append;
},{"./internal/_concat":107,"./internal/_curry2":110}],19:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Applies function `fn` to the argument list `args`. This is useful for
 * creating a fixed-arity function from a variadic function. `fn` should be a
 * bound function if context is significant.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> a) -> [*] -> a
 * @param {Function} fn The function which will be called with `args`
 * @param {Array} args The arguments to call `fn` with
 * @return {*} result The result, equivalent to `fn(...args)`
 * @see R.call, R.unapply
 * @example
 *
 *      const nums = [1, 2, 3, -99, 42, 6, 7];
 *      R.apply(Math.max, nums); //=> 42
 * @symb R.apply(f, [a, b, c]) = f(a, b, c)
 */


var apply =
/*#__PURE__*/
_curry2(function apply(fn, args) {
  return fn.apply(this, args);
});

module.exports = apply;
},{"./internal/_curry2":110}],20:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var apply =
/*#__PURE__*/
require("./apply");

var curryN =
/*#__PURE__*/
require("./curryN");

var max =
/*#__PURE__*/
require("./max");

var pluck =
/*#__PURE__*/
require("./pluck");

var reduce =
/*#__PURE__*/
require("./reduce");

var keys =
/*#__PURE__*/
require("./keys");

var values =
/*#__PURE__*/
require("./values"); // Use custom mapValues function to avoid issues with specs that include a "map" key and R.map
// delegating calls to .map


function mapValues(fn, obj) {
  return keys(obj).reduce(function (acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
}
/**
 * Given a spec object recursively mapping properties to functions, creates a
 * function producing an object of the same structure, by mapping each property
 * to the result of calling its associated function with the supplied arguments.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
 * @param {Object} spec an object recursively mapping properties to functions for
 *        producing the values for these properties.
 * @return {Function} A function that returns an object of the same structure
 * as `spec', with each property set to the value returned by calling its
 * associated function with the supplied arguments.
 * @see R.converge, R.juxt
 * @example
 *
 *      const getMetrics = R.applySpec({
 *        sum: R.add,
 *        nested: { mul: R.multiply }
 *      });
 *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
 * @symb R.applySpec({ x: f, y: { z: g } })(a, b) = { x: f(a, b), y: { z: g(a, b) } }
 */


var applySpec =
/*#__PURE__*/
_curry1(function applySpec(spec) {
  spec = mapValues(function (v) {
    return typeof v == 'function' ? v : applySpec(v);
  }, spec);
  return curryN(reduce(max, 0, pluck('length', values(spec))), function () {
    var args = arguments;
    return mapValues(function (f) {
      return apply(f, args);
    }, spec);
  });
});

module.exports = applySpec;
},{"./apply":19,"./curryN":46,"./internal/_curry1":109,"./keys":182,"./max":201,"./pluck":251,"./reduce":262,"./values":322}],21:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Takes a value and applies a function to it.
 *
 * This function is also known as the `thrush` combinator.
 *
 * @func
 * @memberOf R
 * @since v0.25.0
 * @category Function
 * @sig a -> (a -> b) -> b
 * @param {*} x The value
 * @param {Function} f The function to apply
 * @return {*} The result of applying `f` to `x`
 * @example
 *
 *      const t42 = R.applyTo(42);
 *      t42(R.identity); //=> 42
 *      t42(R.add(1)); //=> 43
 */


var applyTo =
/*#__PURE__*/
_curry2(function applyTo(x, f) {
  return f(x);
});

module.exports = applyTo;
},{"./internal/_curry2":110}],22:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Makes an ascending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) < fn(b), `1` if fn(b) < fn(a), otherwise `0`
 * @see R.descend
 * @example
 *
 *      const byAge = R.ascend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByYoungestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */


var ascend =
/*#__PURE__*/
_curry3(function ascend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa < bb ? -1 : aa > bb ? 1 : 0;
});

module.exports = ascend;
},{"./internal/_curry3":111}],23:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Makes a shallow clone of an object, setting or overriding the specified
 * property with the given value. Note that this copies and flattens prototype
 * properties onto the new object as well. All non-primitive properties are
 * copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @sig String -> a -> {k: v} -> {k: v}
 * @param {String} prop The property name to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except for the changed property.
 * @see R.dissoc, R.pick
 * @example
 *
 *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
 */


var assoc =
/*#__PURE__*/
_curry3(function assoc(prop, val, obj) {
  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  result[prop] = val;
  return result;
});

module.exports = assoc;
},{"./internal/_curry3":111}],24:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _has =
/*#__PURE__*/
require("./internal/_has");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");

var _isInteger =
/*#__PURE__*/
require("./internal/_isInteger");

var assoc =
/*#__PURE__*/
require("./assoc");

var isNil =
/*#__PURE__*/
require("./isNil");
/**
 * Makes a shallow clone of an object, setting or overriding the nodes required
 * to create the given path, and placing the specific value at the tail end of
 * that path. Note that this copies and flattens prototype properties onto the
 * new object as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> a -> {a} -> {a}
 * @param {Array} path the path to set
 * @param {*} val The new value
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original except along the specified path.
 * @see R.dissocPath
 * @example
 *
 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *
 *      // Any missing or non-object keys in path will be overridden
 *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
 */


var assocPath =
/*#__PURE__*/
_curry3(function assocPath(path, val, obj) {
  if (path.length === 0) {
    return val;
  }

  var idx = path[0];

  if (path.length > 1) {
    var nextObj = !isNil(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path[1]) ? [] : {};
    val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
  }

  if (_isInteger(idx) && _isArray(obj)) {
    var arr = [].concat(obj);
    arr[idx] = val;
    return arr;
  } else {
    return assoc(idx, val, obj);
  }
});

module.exports = assocPath;
},{"./assoc":23,"./internal/_curry3":111,"./internal/_has":121,"./internal/_isArray":127,"./internal/_isInteger":130,"./isNil":179}],25:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var nAry =
/*#__PURE__*/
require("./nAry");
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 2 parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (* -> c) -> (a, b -> c)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 2.
 * @see R.nAry, R.unary
 * @example
 *
 *      const takesThreeArgs = function(a, b, c) {
 *        return [a, b, c];
 *      };
 *      takesThreeArgs.length; //=> 3
 *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
 *
 *      const takesTwoArgs = R.binary(takesThreeArgs);
 *      takesTwoArgs.length; //=> 2
 *      // Only 2 arguments are passed to the wrapped function
 *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
 * @symb R.binary(f)(a, b, c) = f(a, b)
 */


var binary =
/*#__PURE__*/
_curry1(function binary(fn) {
  return nAry(2, fn);
});

module.exports = binary;
},{"./internal/_curry1":109,"./nAry":221}],26:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a function that is bound to a context.
 * Note: `R.bind` does not provide the additional argument-binding capabilities of
 * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Function
 * @category Object
 * @sig (* -> *) -> {*} -> (* -> *)
 * @param {Function} fn The function to bind to context
 * @param {Object} thisObj The context to bind `fn` to
 * @return {Function} A function that will execute in the context of `thisObj`.
 * @see R.partial
 * @example
 *
 *      const log = R.bind(console.log, console);
 *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
 *      // logs {a: 2}
 * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
 */


var bind =
/*#__PURE__*/
_curry2(function bind(fn, thisObj) {
  return _arity(fn.length, function () {
    return fn.apply(thisObj, arguments);
  });
});

module.exports = bind;
},{"./internal/_arity":100,"./internal/_curry2":110}],27:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isFunction =
/*#__PURE__*/
require("./internal/_isFunction");

var and =
/*#__PURE__*/
require("./and");

var lift =
/*#__PURE__*/
require("./lift");
/**
 * A function which calls the two provided functions and returns the `&&`
 * of the results.
 * It returns the result of the first function if it is false-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * false-y value.
 *
 * In addition to functions, `R.both` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f A predicate
 * @param {Function} g Another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
 * @see R.and
 * @example
 *
 *      const gt10 = R.gt(R.__, 10)
 *      const lt20 = R.lt(R.__, 20)
 *      const f = R.both(gt10, lt20);
 *      f(15); //=> true
 *      f(30); //=> false
 *
 *      R.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)
 *      R.both([false, false, 'a'], [11]); //=> [false, false, 11]
 */


var both =
/*#__PURE__*/
_curry2(function both(f, g) {
  return _isFunction(f) ? function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  } : lift(and)(f, g);
});

module.exports = both;
},{"./and":12,"./internal/_curry2":110,"./internal/_isFunction":129,"./lift":191}],28:[function(require,module,exports){
var curry =
/*#__PURE__*/
require("./curry");
/**
 * Returns the result of calling its first argument with the remaining
 * arguments. This is occasionally useful as a converging function for
 * [`R.converge`](#converge): the first branch can produce a function while the
 * remaining branches produce values to be passed to that function as its
 * arguments.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig (*... -> a),*... -> a
 * @param {Function} fn The function to apply to the remaining arguments.
 * @param {...*} args Any number of positional arguments.
 * @return {*}
 * @see R.apply
 * @example
 *
 *      R.call(R.add, 1, 2); //=> 3
 *
 *      const indentN = R.pipe(R.repeat(' '),
 *                           R.join(''),
 *                           R.replace(/^(?!$)/gm));
 *
 *      const format = R.converge(R.call, [
 *                                  R.pipe(R.prop('indent'), indentN),
 *                                  R.prop('value')
 *                              ]);
 *
 *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
 * @symb R.call(f, a, b) = f(a, b)
 */


var call =
/*#__PURE__*/
curry(function call(fn) {
  return fn.apply(this, Array.prototype.slice.call(arguments, 1));
});
module.exports = call;
},{"./curry":45}],29:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _makeFlat =
/*#__PURE__*/
require("./internal/_makeFlat");

var _xchain =
/*#__PURE__*/
require("./internal/_xchain");

var map =
/*#__PURE__*/
require("./map");
/**
 * `chain` maps a function over a list and concatenates the results. `chain`
 * is also known as `flatMap` in some libraries.
 *
 * Dispatches to the `chain` method of the second argument, if present,
 * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
 *
 * If second argument is a function, `chain(f, g)(x)` is equivalent to `f(g(x), x)`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain m => (a -> m b) -> m a -> m b
 * @param {Function} fn The function to map with
 * @param {Array} list The list to map over
 * @return {Array} The result of flat-mapping `list` with `fn`
 * @example
 *
 *      const duplicate = n => [n, n];
 *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
 *
 *      R.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]
 */


var chain =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/chain', 'chain'], _xchain, function chain(fn, monad) {
  if (typeof monad === 'function') {
    return function (x) {
      return fn(monad(x))(x);
    };
  }

  return _makeFlat(false)(map(fn, monad));
}));

module.exports = chain;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_makeFlat":137,"./internal/_xchain":153,"./map":195}],30:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Restricts a number to be within a range.
 *
 * Also works for other ordered types such as Strings and Dates.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Relation
 * @sig Ord a => a -> a -> a -> a
 * @param {Number} minimum The lower limit of the clamp (inclusive)
 * @param {Number} maximum The upper limit of the clamp (inclusive)
 * @param {Number} value Value to be clamped
 * @return {Number} Returns `minimum` when `val < minimum`, `maximum` when `val > maximum`, returns `val` otherwise
 * @example
 *
 *      R.clamp(1, 10, -5) // => 1
 *      R.clamp(1, 10, 15) // => 10
 *      R.clamp(1, 10, 4)  // => 4
 */


var clamp =
/*#__PURE__*/
_curry3(function clamp(min, max, value) {
  if (min > max) {
    throw new Error('min must not be greater than max in clamp(min, max, value)');
  }

  return value < min ? min : value > max ? max : value;
});

module.exports = clamp;
},{"./internal/_curry3":111}],31:[function(require,module,exports){
var _clone =
/*#__PURE__*/
require("./internal/_clone");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Creates a deep copy of the value which may contain (nested) `Array`s and
 * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
 * assigned by reference rather than copied
 *
 * Dispatches to a `clone` method if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {*} -> {*}
 * @param {*} value The object or array to clone
 * @return {*} A deeply cloned copy of `val`
 * @example
 *
 *      const objects = [{}, {}, {}];
 *      const objectsClone = R.clone(objects);
 *      objects === objectsClone; //=> false
 *      objects[0] === objectsClone[0]; //=> false
 */


var clone =
/*#__PURE__*/
_curry1(function clone(value) {
  return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
});

module.exports = clone;
},{"./internal/_clone":104,"./internal/_curry1":109}],32:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Makes a comparator function out of a function that reports whether the first
 * element is less than the second.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b) -> Boolean) -> ((a, b) -> Number)
 * @param {Function} pred A predicate function of arity two which will return `true` if the first argument
 * is less than the second, `false` otherwise
 * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`
 * @example
 *
 *      const byAge = R.comparator((a, b) => a.age < b.age);
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByIncreasingAge = R.sort(byAge, people);
 *        //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]
 */


var comparator =
/*#__PURE__*/
_curry1(function comparator(pred) {
  return function (a, b) {
    return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
  };
});

module.exports = comparator;
},{"./internal/_curry1":109}],33:[function(require,module,exports){
var lift =
/*#__PURE__*/
require("./lift");

var not =
/*#__PURE__*/
require("./not");
/**
 * Takes a function `f` and returns a function `g` such that if called with the same arguments
 * when `f` returns a "truthy" value, `g` returns `false` and when `f` returns a "falsy" value `g` returns `true`.
 *
 * `R.complement` may be applied to any functor
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> *) -> (*... -> Boolean)
 * @param {Function} f
 * @return {Function}
 * @see R.not
 * @example
 *
 *      const isNotNil = R.complement(R.isNil);
 *      isNil(null); //=> true
 *      isNotNil(null); //=> false
 *      isNil(7); //=> false
 *      isNotNil(7); //=> true
 */


var complement =
/*#__PURE__*/
lift(not);
module.exports = complement;
},{"./lift":191,"./not":224}],34:[function(require,module,exports){
var pipe =
/*#__PURE__*/
require("./pipe");

var reverse =
/*#__PURE__*/
require("./reverse");
/**
 * Performs right-to-left function composition. The last argument may have
 * any arity; the remaining arguments must be unary.
 *
 * **Note:** The result of compose is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.pipe
 * @example
 *
 *      const classyGreeting = (firstName, lastName) => "The name's " + lastName + ", " + firstName + " " + lastName
 *      const yellGreeting = R.compose(R.toUpper, classyGreeting);
 *      yellGreeting('James', 'Bond'); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7
 *
 * @symb R.compose(f, g, h)(a, b) = f(g(h(a, b)))
 */


function compose() {
  if (arguments.length === 0) {
    throw new Error('compose requires at least one argument');
  }

  return pipe.apply(this, reverse(arguments));
}

module.exports = compose;
},{"./pipe":247,"./reverse":271}],35:[function(require,module,exports){
var chain =
/*#__PURE__*/
require("./chain");

var compose =
/*#__PURE__*/
require("./compose");

var map =
/*#__PURE__*/
require("./map");
/**
 * Returns the right-to-left Kleisli composition of the provided functions,
 * each of which must return a value of a type supported by [`chain`](#chain).
 *
 * `R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), f)`.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Function
 * @sig Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> (a -> m z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.pipeK
 * @deprecated since v0.26.0
 * @example
 *
 *       //  get :: String -> Object -> Maybe *
 *       const get = R.curry((propName, obj) => Maybe(obj[propName]))
 *
 *       //  getStateCode :: Maybe String -> Maybe String
 *       const getStateCode = R.composeK(
 *         R.compose(Maybe.of, R.toUpper),
 *         get('state'),
 *         get('address'),
 *         get('user'),
 *       );
 *       getStateCode({"user":{"address":{"state":"ny"}}}); //=> Maybe.Just("NY")
 *       getStateCode({}); //=> Maybe.Nothing()
 * @symb R.composeK(f, g, h)(a) = R.chain(f, R.chain(g, h(a)))
 */


function composeK() {
  if (arguments.length === 0) {
    throw new Error('composeK requires at least one argument');
  }

  var init = Array.prototype.slice.call(arguments);
  var last = init.pop();
  return compose(compose.apply(this, map(chain, init)), last);
}

module.exports = composeK;
},{"./chain":29,"./compose":34,"./map":195}],36:[function(require,module,exports){
var pipeP =
/*#__PURE__*/
require("./pipeP");

var reverse =
/*#__PURE__*/
require("./reverse");
/**
 * Performs right-to-left composition of one or more Promise-returning
 * functions. The last arguments may have any arity; the remaining
 * arguments must be unary.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((y -> Promise z), (x -> Promise y), ..., (a -> Promise b)) -> (a -> Promise z)
 * @param {...Function} functions The functions to compose
 * @return {Function}
 * @see R.pipeP
 * @deprecated since v0.26.0
 * @example
 *
 *      const db = {
 *        users: {
 *          JOE: {
 *            name: 'Joe',
 *            followers: ['STEVE', 'SUZY']
 *          }
 *        }
 *      }
 *
 *      // We'll pretend to do a db lookup which returns a promise
 *      const lookupUser = (userId) => Promise.resolve(db.users[userId])
 *      const lookupFollowers = (user) => Promise.resolve(user.followers)
 *      lookupUser('JOE').then(lookupFollowers)
 *
 *      //  followersForUser :: String -> Promise [UserId]
 *      const followersForUser = R.composeP(lookupFollowers, lookupUser);
 *      followersForUser('JOE').then(followers => console.log('Followers:', followers))
 *      // Followers: ["STEVE","SUZY"]
 */


function composeP() {
  if (arguments.length === 0) {
    throw new Error('composeP requires at least one argument');
  }

  return pipeP.apply(this, reverse(arguments));
}

module.exports = composeP;
},{"./pipeP":249,"./reverse":271}],37:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var pipeWith =
/*#__PURE__*/
require("./pipeWith");

var reverse =
/*#__PURE__*/
require("./reverse");
/**
 * Performs right-to-left function composition using transforming function. The last argument may have
 * any arity; the remaining arguments must be unary.
 *
 * **Note:** The result of compose is not automatically curried. Transforming function is not used on the
 * last argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [(y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)]) -> ((a, b, ..., n) -> z)
 * @param {...Function} ...functions The functions to compose
 * @return {Function}
 * @see R.compose, R.pipeWith
 * @example
 *
 *      const composeWhileNotNil = R.composeWith((f, res) => R.isNil(res) ? res : f(res));
 *
 *      composeWhileNotNil([R.inc, R.prop('age')])({age: 1}) //=> 2
 *      composeWhileNotNil([R.inc, R.prop('age')])({}) //=> undefined
 *
 * @symb R.composeWith(f)([g, h, i])(...args) = f(g, f(h, i(...args)))
 */


var composeWith =
/*#__PURE__*/
_curry2(function composeWith(xf, list) {
  return pipeWith.apply(this, [xf, reverse(list)]);
});

module.exports = composeWith;
},{"./internal/_curry2":110,"./pipeWith":250,"./reverse":271}],38:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");

var _isFunction =
/*#__PURE__*/
require("./internal/_isFunction");

var _isString =
/*#__PURE__*/
require("./internal/_isString");

var toString =
/*#__PURE__*/
require("./toString");
/**
 * Returns the result of concatenating the given lists or strings.
 *
 * Note: `R.concat` expects both arguments to be of the same type,
 * unlike the native `Array.prototype.concat` method. It will throw
 * an error if you `concat` an Array with a non-Array value.
 *
 * Dispatches to the `concat` method of the first argument, if present.
 * Can also concatenate two members of a [fantasy-land
 * compatible semigroup](https://github.com/fantasyland/fantasy-land#semigroup).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @sig String -> String -> String
 * @param {Array|String} firstList The first list
 * @param {Array|String} secondList The second list
 * @return {Array|String} A list consisting of the elements of `firstList` followed by the elements of
 * `secondList`.
 *
 * @example
 *
 *      R.concat('ABC', 'DEF'); // 'ABCDEF'
 *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 *      R.concat([], []); //=> []
 */


var concat =
/*#__PURE__*/
_curry2(function concat(a, b) {
  if (_isArray(a)) {
    if (_isArray(b)) {
      return a.concat(b);
    }

    throw new TypeError(toString(b) + ' is not an array');
  }

  if (_isString(a)) {
    if (_isString(b)) {
      return a + b;
    }

    throw new TypeError(toString(b) + ' is not a string');
  }

  if (a != null && _isFunction(a['fantasy-land/concat'])) {
    return a['fantasy-land/concat'](b);
  }

  if (a != null && _isFunction(a.concat)) {
    return a.concat(b);
  }

  throw new TypeError(toString(a) + ' does not have a method named "concat" or "fantasy-land/concat"');
});

module.exports = concat;
},{"./internal/_curry2":110,"./internal/_isArray":127,"./internal/_isFunction":129,"./internal/_isString":135,"./toString":300}],39:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var map =
/*#__PURE__*/
require("./map");

var max =
/*#__PURE__*/
require("./max");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic.
 * `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments
 * to `fn` are applied to each of the predicates in turn until one returns a
 * "truthy" value, at which point `fn` returns the result of applying its
 * arguments to the corresponding transformer. If none of the predicates
 * matches, `fn` returns undefined.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Logic
 * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
 * @param {Array} pairs A list of [predicate, transformer]
 * @return {Function}
 * @see R.ifElse, R.unless, R.when
 * @example
 *
 *      const fn = R.cond([
 *        [R.equals(0),   R.always('water freezes at 0°C')],
 *        [R.equals(100), R.always('water boils at 100°C')],
 *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
 *      ]);
 *      fn(0); //=> 'water freezes at 0°C'
 *      fn(50); //=> 'nothing special happens at 50°C'
 *      fn(100); //=> 'water boils at 100°C'
 */


var cond =
/*#__PURE__*/
_curry1(function cond(pairs) {
  var arity = reduce(max, 0, map(function (pair) {
    return pair[0].length;
  }, pairs));
  return _arity(arity, function () {
    var idx = 0;

    while (idx < pairs.length) {
      if (pairs[idx][0].apply(this, arguments)) {
        return pairs[idx][1].apply(this, arguments);
      }

      idx += 1;
    }
  });
});

module.exports = cond;
},{"./internal/_arity":100,"./internal/_curry1":109,"./map":195,"./max":201,"./reduce":262}],40:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var constructN =
/*#__PURE__*/
require("./constructN");
/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> {*}) -> (* -> {*})
 * @param {Function} fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @see R.invoker
 * @example
 *
 *      // Constructor function
 *      function Animal(kind) {
 *        this.kind = kind;
 *      };
 *      Animal.prototype.sighting = function() {
 *        return "It's a " + this.kind + "!";
 *      }
 *
 *      const AnimalConstructor = R.construct(Animal)
 *
 *      // Notice we no longer need the 'new' keyword:
 *      AnimalConstructor('Pig'); //=> {"kind": "Pig", "sighting": function (){...}};
 *
 *      const animalTypes = ["Lion", "Tiger", "Bear"];
 *      const animalSighting = R.invoker(0, 'sighting');
 *      const sightNewAnimal = R.compose(animalSighting, AnimalConstructor);
 *      R.map(sightNewAnimal, animalTypes); //=> ["It's a Lion!", "It's a Tiger!", "It's a Bear!"]
 */


var construct =
/*#__PURE__*/
_curry1(function construct(Fn) {
  return constructN(Fn.length, Fn);
});

module.exports = construct;
},{"./constructN":41,"./internal/_curry1":109}],41:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var curry =
/*#__PURE__*/
require("./curry");

var nAry =
/*#__PURE__*/
require("./nAry");
/**
 * Wraps a constructor function inside a curried function that can be called
 * with the same arguments and returns the same type. The arity of the function
 * returned is specified to allow using variadic constructor functions.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Function
 * @sig Number -> (* -> {*}) -> (* -> {*})
 * @param {Number} n The arity of the constructor function.
 * @param {Function} Fn The constructor function to wrap.
 * @return {Function} A wrapped, curried constructor function.
 * @example
 *
 *      // Variadic Constructor function
 *      function Salad() {
 *        this.ingredients = arguments;
 *      }
 *
 *      Salad.prototype.recipe = function() {
 *        const instructions = R.map(ingredient => 'Add a dollop of ' + ingredient, this.ingredients);
 *        return R.join('\n', instructions);
 *      };
 *
 *      const ThreeLayerSalad = R.constructN(3, Salad);
 *
 *      // Notice we no longer need the 'new' keyword, and the constructor is curried for 3 arguments.
 *      const salad = ThreeLayerSalad('Mayonnaise')('Potato Chips')('Ketchup');
 *
 *      console.log(salad.recipe());
 *      // Add a dollop of Mayonnaise
 *      // Add a dollop of Potato Chips
 *      // Add a dollop of Ketchup
 */


var constructN =
/*#__PURE__*/
_curry2(function constructN(n, Fn) {
  if (n > 10) {
    throw new Error('Constructor with greater than ten arguments');
  }

  if (n === 0) {
    return function () {
      return new Fn();
    };
  }

  return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
    switch (arguments.length) {
      case 1:
        return new Fn($0);

      case 2:
        return new Fn($0, $1);

      case 3:
        return new Fn($0, $1, $2);

      case 4:
        return new Fn($0, $1, $2, $3);

      case 5:
        return new Fn($0, $1, $2, $3, $4);

      case 6:
        return new Fn($0, $1, $2, $3, $4, $5);

      case 7:
        return new Fn($0, $1, $2, $3, $4, $5, $6);

      case 8:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7);

      case 9:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);

      case 10:
        return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
    }
  }));
});

module.exports = constructN;
},{"./curry":45,"./internal/_curry2":110,"./nAry":221}],42:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./internal/_includes");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Works also with strings.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.includes
 * @deprecated since v0.26.0
 * @example
 *
 *      R.contains(3, [1, 2, 3]); //=> true
 *      R.contains(4, [1, 2, 3]); //=> false
 *      R.contains({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.contains([42], [[42]]); //=> true
 *      R.contains('ba', 'banana'); //=>true
 */


var contains =
/*#__PURE__*/
_curry2(_includes);

module.exports = contains;
},{"./internal/_curry2":110,"./internal/_includes":123}],43:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _map =
/*#__PURE__*/
require("./internal/_map");

var curryN =
/*#__PURE__*/
require("./curryN");

var max =
/*#__PURE__*/
require("./max");

var pluck =
/*#__PURE__*/
require("./pluck");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Accepts a converging function and a list of branching functions and returns
 * a new function. The arity of the new function is the same as the arity of
 * the longest branching function. When invoked, this new function is applied
 * to some arguments, and each branching function is applied to those same
 * arguments. The results of each branching function are passed as arguments
 * to the converging function to produce the return value.
 *
 * @func
 * @memberOf R
 * @since v0.4.2
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [((a, b, ...) -> x1), ((a, b, ...) -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} after A function. `after` will be invoked with the return values of
 *        `fn1` and `fn2` as its arguments.
 * @param {Array} functions A list of functions.
 * @return {Function} A new function.
 * @see R.useWith
 * @example
 *
 *      const average = R.converge(R.divide, [R.sum, R.length])
 *      average([1, 2, 3, 4, 5, 6, 7]) //=> 4
 *
 *      const strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])
 *      strangeConcat("Yodel") //=> "YODELyodel"
 *
 * @symb R.converge(f, [g, h])(a, b) = f(g(a, b), h(a, b))
 */


var converge =
/*#__PURE__*/
_curry2(function converge(after, fns) {
  return curryN(reduce(max, 0, pluck('length', fns)), function () {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function (fn) {
      return fn.apply(context, args);
    }, fns));
  });
});

module.exports = converge;
},{"./curryN":46,"./internal/_curry2":110,"./internal/_map":138,"./max":201,"./pluck":251,"./reduce":262}],44:[function(require,module,exports){
var reduceBy =
/*#__PURE__*/
require("./reduceBy");
/**
 * Counts the elements of a list according to how many match each value of a
 * key generated by the supplied function. Returns an object mapping the keys
 * produced by `fn` to the number of occurrences in the list. Note that all
 * keys are coerced to strings because of how JavaScript objects work.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig (a -> String) -> [a] -> {*}
 * @param {Function} fn The function used to map values to keys.
 * @param {Array} list The list to count elements from.
 * @return {Object} An object mapping keys to number of occurrences in the list.
 * @example
 *
 *      const numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
 *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
 *
 *      const letters = ['a', 'b', 'A', 'a', 'B', 'c'];
 *      R.countBy(R.toLower)(letters);   //=> {'a': 3, 'b': 2, 'c': 1}
 */


var countBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return acc + 1;
}, 0);
module.exports = countBy;
},{"./reduceBy":263}],45:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN, R.partial
 * @example
 *
 *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      const curriedAddFourNumbers = R.curry(addFourNumbers);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curry =
/*#__PURE__*/
_curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

module.exports = curry;
},{"./curryN":46,"./internal/_curry1":109}],46:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _curryN =
/*#__PURE__*/
require("./internal/_curryN");
/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curryN =
/*#__PURE__*/
_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1(fn);
  }

  return _arity(length, _curryN(length, [], fn));
});

module.exports = curryN;
},{"./internal/_arity":100,"./internal/_curry1":109,"./internal/_curry2":110,"./internal/_curryN":112}],47:[function(require,module,exports){
var add =
/*#__PURE__*/
require("./add");
/**
 * Decrements its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n - 1
 * @see R.inc
 * @example
 *
 *      R.dec(42); //=> 41
 */


var dec =
/*#__PURE__*/
add(-1);
module.exports = dec;
},{"./add":6}],48:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns the second argument if it is not `null`, `undefined` or `NaN`;
 * otherwise the first argument is returned.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {a} default The default value.
 * @param {b} val `val` will be returned instead of `default` unless `val` is `null`, `undefined` or `NaN`.
 * @return {*} The second value if it is not `null`, `undefined` or `NaN`, otherwise the default value
 * @example
 *
 *      const defaultTo42 = R.defaultTo(42);
 *
 *      defaultTo42(null);  //=> 42
 *      defaultTo42(undefined);  //=> 42
 *      defaultTo42(false);  //=> false
 *      defaultTo42('Ramda');  //=> 'Ramda'
 *      // parseInt('string') results in NaN
 *      defaultTo42(parseInt('string')); //=> 42
 */


var defaultTo =
/*#__PURE__*/
_curry2(function defaultTo(d, v) {
  return v == null || v !== v ? d : v;
});

module.exports = defaultTo;
},{"./internal/_curry2":110}],49:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Makes a descending comparator function out of a function that returns a value
 * that can be compared with `<` and `>`.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Function
 * @sig Ord b => (a -> b) -> a -> a -> Number
 * @param {Function} fn A function of arity one that returns a value that can be compared
 * @param {*} a The first item to be compared.
 * @param {*} b The second item to be compared.
 * @return {Number} `-1` if fn(a) > fn(b), `1` if fn(b) > fn(a), otherwise `0`
 * @see R.ascend
 * @example
 *
 *      const byAge = R.descend(R.prop('age'));
 *      const people = [
 *        { name: 'Emma', age: 70 },
 *        { name: 'Peter', age: 78 },
 *        { name: 'Mikhail', age: 62 },
 *      ];
 *      const peopleByOldestFirst = R.sort(byAge, people);
 *        //=> [{ name: 'Peter', age: 78 }, { name: 'Emma', age: 70 }, { name: 'Mikhail', age: 62 }]
 */


var descend =
/*#__PURE__*/
_curry3(function descend(fn, a, b) {
  var aa = fn(a);
  var bb = fn(b);
  return aa > bb ? -1 : aa < bb ? 1 : 0;
});

module.exports = descend;
},{"./internal/_curry3":111}],50:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _Set =
/*#__PURE__*/
require("./internal/_Set");
/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Objects and Arrays are compared in terms of
 * value equality, not reference equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith, R.without
 * @example
 *
 *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
 *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
 *      R.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]
 */


var difference =
/*#__PURE__*/
_curry2(function difference(first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;
  var secondLen = second.length;
  var toFilterOut = new _Set();

  for (var i = 0; i < secondLen; i += 1) {
    toFilterOut.add(second[i]);
  }

  while (idx < firstLen) {
    if (toFilterOut.add(first[idx])) {
      out[out.length] = first[idx];
    }

    idx += 1;
  }

  return out;
});

module.exports = difference;
},{"./internal/_Set":98,"./internal/_curry2":110}],51:[function(require,module,exports){
var _includesWith =
/*#__PURE__*/
require("./internal/_includesWith");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Finds the set (i.e. no duplicates) of all elements in the first list not
 * contained in the second list. Duplication is determined according to the
 * value returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` that are not in `list2`.
 * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
 * @example
 *
 *      const cmp = (x, y) => x.a === y.a;
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}];
 *      const l2 = [{a: 3}, {a: 4}];
 *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
 */


var differenceWith =
/*#__PURE__*/
_curry3(function differenceWith(pred, first, second) {
  var out = [];
  var idx = 0;
  var firstLen = first.length;

  while (idx < firstLen) {
    if (!_includesWith(pred, first[idx], second) && !_includesWith(pred, first[idx], out)) {
      out.push(first[idx]);
    }

    idx += 1;
  }

  return out;
});

module.exports = differenceWith;
},{"./internal/_curry3":111,"./internal/_includesWith":124}],52:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a new object that does not contain a `prop` property.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Object
 * @sig String -> {k: v} -> {k: v}
 * @param {String} prop The name of the property to dissociate
 * @param {Object} obj The object to clone
 * @return {Object} A new object equivalent to the original but without the specified property
 * @see R.assoc, R.omit
 * @example
 *
 *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
 */


var dissoc =
/*#__PURE__*/
_curry2(function dissoc(prop, obj) {
  var result = {};

  for (var p in obj) {
    result[p] = obj[p];
  }

  delete result[prop];
  return result;
});

module.exports = dissoc;
},{"./internal/_curry2":110}],53:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isInteger =
/*#__PURE__*/
require("./internal/_isInteger");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");

var assoc =
/*#__PURE__*/
require("./assoc");

var dissoc =
/*#__PURE__*/
require("./dissoc");

var remove =
/*#__PURE__*/
require("./remove");

var update =
/*#__PURE__*/
require("./update");
/**
 * Makes a shallow clone of an object, omitting the property at the given path.
 * Note that this copies and flattens prototype properties onto the new object
 * as well. All non-primitive properties are copied by reference.
 *
 * @func
 * @memberOf R
 * @since v0.11.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {k: v} -> {k: v}
 * @param {Array} path The path to the value to omit
 * @param {Object} obj The object to clone
 * @return {Object} A new object without the property at path
 * @see R.assocPath
 * @example
 *
 *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
 */


var dissocPath =
/*#__PURE__*/
_curry2(function dissocPath(path, obj) {
  switch (path.length) {
    case 0:
      return obj;

    case 1:
      return _isInteger(path[0]) && _isArray(obj) ? remove(path[0], 1, obj) : dissoc(path[0], obj);

    default:
      var head = path[0];
      var tail = Array.prototype.slice.call(path, 1);

      if (obj[head] == null) {
        return obj;
      } else if (_isInteger(head) && _isArray(obj)) {
        return update(head, dissocPath(tail, obj[head]), obj);
      } else {
        return assoc(head, dissocPath(tail, obj[head]), obj);
      }

  }
});

module.exports = dissocPath;
},{"./assoc":23,"./dissoc":52,"./internal/_curry2":110,"./internal/_isArray":127,"./internal/_isInteger":130,"./remove":268,"./update":320}],54:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Divides two numbers. Equivalent to `a / b`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a / b`.
 * @see R.multiply
 * @example
 *
 *      R.divide(71, 100); //=> 0.71
 *
 *      const half = R.divide(R.__, 2);
 *      half(42); //=> 21
 *
 *      const reciprocal = R.divide(1);
 *      reciprocal(4);   //=> 0.25
 */


var divide =
/*#__PURE__*/
_curry2(function divide(a, b) {
  return a / b;
});

module.exports = divide;
},{"./internal/_curry2":110}],55:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xdrop =
/*#__PURE__*/
require("./internal/_xdrop");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns all but the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `drop` method).
 *
 * Dispatches to the `drop` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*} A copy of list without the first `n` elements
 * @see R.take, R.transduce, R.dropLast, R.dropWhile
 * @example
 *
 *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
 *      R.drop(3, 'ramda');               //=> 'da'
 */


var drop =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['drop'], _xdrop, function drop(n, xs) {
  return slice(Math.max(0, n), Infinity, xs);
}));

module.exports = drop;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xdrop":154,"./slice":275}],56:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _dropLast =
/*#__PURE__*/
require("./internal/_dropLast");

var _xdropLast =
/*#__PURE__*/
require("./internal/_xdropLast");
/**
 * Returns a list containing all but the last `n` elements of the given `list`.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements of `list` to skip.
 * @param {Array} list The list of elements to consider.
 * @return {Array} A copy of the list with only the first `list.length - n` elements
 * @see R.takeLast, R.drop, R.dropWhile, R.dropLastWhile
 * @example
 *
 *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
 *      R.dropLast(3, 'ramda');               //=> 'ra'
 */


var dropLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLast, _dropLast));

module.exports = dropLast;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_dropLast":114,"./internal/_xdropLast":155}],57:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _dropLastWhile =
/*#__PURE__*/
require("./internal/_dropLastWhile");

var _xdropLastWhile =
/*#__PURE__*/
require("./internal/_xdropLastWhile");
/**
 * Returns a new list excluding all the tailing elements of a given list which
 * satisfy the supplied predicate function. It passes each value from the right
 * to the supplied predicate function, skipping elements until the predicate
 * function returns a `falsy` value. The predicate function is applied to one argument:
 * *(value)*.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} predicate The function to be called on each element
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array without any trailing elements that return `falsy` values from the `predicate`.
 * @see R.takeLastWhile, R.addIndex, R.drop, R.dropWhile
 * @example
 *
 *      const lteThree = x => x <= 3;
 *
 *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
 *
 *      R.dropLastWhile(x => x !== 'd' , 'Ramda'); //=> 'Ramd'
 */


var dropLastWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropLastWhile, _dropLastWhile));

module.exports = dropLastWhile;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_dropLastWhile":115,"./internal/_xdropLastWhile":156}],58:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xdropRepeatsWith =
/*#__PURE__*/
require("./internal/_xdropRepeatsWith");

var dropRepeatsWith =
/*#__PURE__*/
require("./dropRepeatsWith");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Returns a new list without any consecutively repeating elements.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
 */


var dropRepeats =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_dispatchable([],
/*#__PURE__*/
_xdropRepeatsWith(equals),
/*#__PURE__*/
dropRepeatsWith(equals)));

module.exports = dropRepeats;
},{"./dropRepeatsWith":59,"./equals":66,"./internal/_curry1":109,"./internal/_dispatchable":113,"./internal/_xdropRepeatsWith":157}],59:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xdropRepeatsWith =
/*#__PURE__*/
require("./internal/_xdropRepeatsWith");

var last =
/*#__PURE__*/
require("./last");
/**
 * Returns a new list without any consecutively repeating elements. Equality is
 * determined by applying the supplied predicate to each pair of consecutive elements. The
 * first element in a series of equal elements will be preserved.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} `list` without repeating elements.
 * @see R.transduce
 * @example
 *
 *      const l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
 *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
 */


var dropRepeatsWith =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
  var result = [];
  var idx = 1;
  var len = list.length;

  if (len !== 0) {
    result[0] = list[0];

    while (idx < len) {
      if (!pred(last(result), list[idx])) {
        result[result.length] = list[idx];
      }

      idx += 1;
    }
  }

  return result;
}));

module.exports = dropRepeatsWith;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xdropRepeatsWith":157,"./last":184}],60:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xdropWhile =
/*#__PURE__*/
require("./internal/_xdropWhile");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns a new list excluding the leading elements of a given list which
 * satisfy the supplied predicate function. It passes each value to the supplied
 * predicate function, skipping elements while the predicate function returns
 * `true`. The predicate function is applied to one argument: *(value)*.
 *
 * Dispatches to the `dropWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.takeWhile, R.transduce, R.addIndex
 * @example
 *
 *      const lteTwo = x => x <= 2;
 *
 *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
 *
 *      R.dropWhile(x => x !== 'd' , 'Ramda'); //=> 'da'
 */


var dropWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['dropWhile'], _xdropWhile, function dropWhile(pred, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && pred(xs[idx])) {
    idx += 1;
  }

  return slice(idx, Infinity, xs);
}));

module.exports = dropWhile;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xdropWhile":158,"./slice":275}],61:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isFunction =
/*#__PURE__*/
require("./internal/_isFunction");

var lift =
/*#__PURE__*/
require("./lift");

var or =
/*#__PURE__*/
require("./or");
/**
 * A function wrapping calls to the two functions in an `||` operation,
 * returning the result of the first function if it is truth-y and the result
 * of the second function otherwise. Note that this is short-circuited,
 * meaning that the second function will not be invoked if the first returns a
 * truth-y value.
 *
 * In addition to functions, `R.either` also accepts any fantasy-land compatible
 * applicative functor.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
 * @param {Function} f a predicate
 * @param {Function} g another predicate
 * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
 * @see R.or
 * @example
 *
 *      const gt10 = x => x > 10;
 *      const even = x => x % 2 === 0;
 *      const f = R.either(gt10, even);
 *      f(101); //=> true
 *      f(8); //=> true
 *
 *      R.either(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(55)
 *      R.either([false, false, 'a'], [11]) // => [11, 11, "a"]
 */


var either =
/*#__PURE__*/
_curry2(function either(f, g) {
  return _isFunction(f) ? function _either() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  } : lift(or)(f, g);
});

module.exports = either;
},{"./internal/_curry2":110,"./internal/_isFunction":129,"./lift":191,"./or":232}],62:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _isArguments =
/*#__PURE__*/
require("./internal/_isArguments");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");

var _isObject =
/*#__PURE__*/
require("./internal/_isObject");

var _isString =
/*#__PURE__*/
require("./internal/_isString");
/**
 * Returns the empty value of its argument's type. Ramda defines the empty
 * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
 * types are supported if they define `<Type>.empty`,
 * `<Type>.prototype.empty` or implement the
 * [FantasyLand Monoid spec](https://github.com/fantasyland/fantasy-land#monoid).
 *
 * Dispatches to the `empty` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> a
 * @param {*} x
 * @return {*}
 * @example
 *
 *      R.empty(Just(42));      //=> Nothing()
 *      R.empty([1, 2, 3]);     //=> []
 *      R.empty('unicorns');    //=> ''
 *      R.empty({x: 1, y: 2});  //=> {}
 */


var empty =
/*#__PURE__*/
_curry1(function empty(x) {
  return x != null && typeof x['fantasy-land/empty'] === 'function' ? x['fantasy-land/empty']() : x != null && x.constructor != null && typeof x.constructor['fantasy-land/empty'] === 'function' ? x.constructor['fantasy-land/empty']() : x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
    return arguments;
  }() : void 0 // else
  ;
});

module.exports = empty;
},{"./internal/_curry1":109,"./internal/_isArguments":126,"./internal/_isArray":127,"./internal/_isObject":132,"./internal/_isString":135}],63:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var equals =
/*#__PURE__*/
require("./equals");

var takeLast =
/*#__PURE__*/
require("./takeLast");
/**
 * Checks if a list ends with the provided sublist.
 *
 * Similarly, checks if a string ends with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} suffix
 * @param {*} list
 * @return {Boolean}
 * @see R.startsWith
 * @example
 *
 *      R.endsWith('c', 'abc')                //=> true
 *      R.endsWith('b', 'abc')                //=> false
 *      R.endsWith(['c'], ['a', 'b', 'c'])    //=> true
 *      R.endsWith(['b'], ['a', 'b', 'c'])    //=> false
 */


var endsWith =
/*#__PURE__*/
_curry2(function (suffix, list) {
  return equals(takeLast(suffix.length, list), suffix);
});

module.exports = endsWith;
},{"./equals":66,"./internal/_curry2":110,"./takeLast":290}],64:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Takes a function and two values in its domain and returns `true` if the
 * values map to the same value in the codomain; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Relation
 * @sig (a -> b) -> a -> a -> Boolean
 * @param {Function} f
 * @param {*} x
 * @param {*} y
 * @return {Boolean}
 * @example
 *
 *      R.eqBy(Math.abs, 5, -5); //=> true
 */


var eqBy =
/*#__PURE__*/
_curry3(function eqBy(f, x, y) {
  return equals(f(x), f(y));
});

module.exports = eqBy;
},{"./equals":66,"./internal/_curry3":111}],65:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Reports whether two objects have the same value, in [`R.equals`](#equals)
 * terms, for the specified property. Useful as a curried predicate.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig k -> {k: v} -> {k: v} -> Boolean
 * @param {String} prop The name of the property to compare
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean}
 *
 * @example
 *
 *      const o1 = { a: 1, b: 2, c: 3, d: 4 };
 *      const o2 = { a: 10, b: 20, c: 3, d: 40 };
 *      R.eqProps('a', o1, o2); //=> false
 *      R.eqProps('c', o1, o2); //=> true
 */


var eqProps =
/*#__PURE__*/
_curry3(function eqProps(prop, obj1, obj2) {
  return equals(obj1[prop], obj2[prop]);
});

module.exports = eqProps;
},{"./equals":66,"./internal/_curry3":111}],66:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _equals =
/*#__PURE__*/
require("./internal/_equals");
/**
 * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
 * cyclical data structures.
 *
 * Dispatches symmetrically to the `equals` methods of both arguments, if
 * present.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> b -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      R.equals(1, 1); //=> true
 *      R.equals(1, '1'); //=> false
 *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
 *
 *      const a = {}; a.v = a;
 *      const b = {}; b.v = b;
 *      R.equals(a, b); //=> true
 */


var equals =
/*#__PURE__*/
_curry2(function equals(a, b) {
  return _equals(a, b, [], []);
});

module.exports = equals;
},{"./internal/_curry2":110,"./internal/_equals":116}],67:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a new object by recursively evolving a shallow copy of `object`,
 * according to the `transformation` functions. All non-primitive properties
 * are copied by reference.
 *
 * A `transformation` function will not be invoked if its corresponding key
 * does not exist in the evolved object.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {k: (v -> v)} -> {k: v} -> {k: v}
 * @param {Object} transformations The object specifying transformation functions to apply
 *        to the object.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const tomato = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
 *      const transformations = {
 *        firstName: R.trim,
 *        lastName: R.trim, // Will not get invoked.
 *        data: {elapsed: R.add(1), remaining: R.add(-1)}
 *      };
 *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
 */


var evolve =
/*#__PURE__*/
_curry2(function evolve(transformations, object) {
  var result = object instanceof Array ? [] : {};
  var transformation, key, type;

  for (key in object) {
    transformation = transformations[key];
    type = typeof transformation;
    result[key] = type === 'function' ? transformation(object[key]) : transformation && type === 'object' ? evolve(transformation, object[key]) : object[key];
  }

  return result;
});

module.exports = evolve;
},{"./internal/_curry2":110}],68:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _filter =
/*#__PURE__*/
require("./internal/_filter");

var _isObject =
/*#__PURE__*/
require("./internal/_isObject");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _xfilter =
/*#__PURE__*/
require("./internal/_xfilter");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Takes a predicate and a `Filterable`, and returns a new filterable of the
 * same type containing the members of the given filterable which satisfy the
 * given predicate. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * Dispatches to the `filter` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array} Filterable
 * @see R.reject, R.transduce, R.addIndex
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *
 *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var filter =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['filter'], _xfilter, function (pred, filterable) {
  return _isObject(filterable) ? _reduce(function (acc, key) {
    if (pred(filterable[key])) {
      acc[key] = filterable[key];
    }

    return acc;
  }, {}, keys(filterable)) : // else
  _filter(pred, filterable);
}));

module.exports = filter;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_filter":117,"./internal/_isObject":132,"./internal/_reduce":145,"./internal/_xfilter":160,"./keys":182}],69:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xfind =
/*#__PURE__*/
require("./internal/_xfind");
/**
 * Returns the first element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Dispatches to the `find` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 *        desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
 *      R.find(R.propEq('a', 4))(xs); //=> undefined
 */


var find =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['find'], _xfind, function find(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx += 1;
  }
}));

module.exports = find;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xfind":161}],70:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xfindIndex =
/*#__PURE__*/
require("./internal/_xfindIndex");
/**
 * Returns the index of the first element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1}, {a: 2}, {a: 3}];
 *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
 *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
 */


var findIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindIndex, function findIndex(fn, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (fn(list[idx])) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}));

module.exports = findIndex;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xfindIndex":162}],71:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xfindLast =
/*#__PURE__*/
require("./internal/_xfindLast");
/**
 * Returns the last element of the list which matches the predicate, or
 * `undefined` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> a | undefined
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Object} The element found, or `undefined`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
 *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
 */


var findLast =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLast, function findLast(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return list[idx];
    }

    idx -= 1;
  }
}));

module.exports = findLast;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xfindLast":163}],72:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xfindLastIndex =
/*#__PURE__*/
require("./internal/_xfindLastIndex");
/**
 * Returns the index of the last element of the list which matches the
 * predicate, or `-1` if no element matches.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> Boolean) -> [a] -> Number
 * @param {Function} fn The predicate function used to determine if the element is the
 * desired one.
 * @param {Array} list The array to consider.
 * @return {Number} The index of the element found, or `-1`.
 * @see R.transduce
 * @example
 *
 *      const xs = [{a: 1, b: 0}, {a:1, b: 1}];
 *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
 *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
 */


var findLastIndex =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xfindLastIndex, function findLastIndex(fn, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx;
    }

    idx -= 1;
  }

  return -1;
}));

module.exports = findLastIndex;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xfindLastIndex":164}],73:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _makeFlat =
/*#__PURE__*/
require("./internal/_makeFlat");
/**
 * Returns a new list by pulling every item out of it (and all its sub-arrays)
 * and putting them in a new array, depth-first.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b]
 * @param {Array} list The array to consider.
 * @return {Array} The flattened list.
 * @see R.unnest
 * @example
 *
 *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
 *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 */


var flatten =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_makeFlat(true));

module.exports = flatten;
},{"./internal/_curry1":109,"./internal/_makeFlat":137}],74:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Returns a new function much like the supplied one, except that the first two
 * arguments' order is reversed.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((a, b, c, ...) -> z) -> (b -> a -> c -> ... -> z)
 * @param {Function} fn The function to invoke with its first two parameters reversed.
 * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
 * @example
 *
 *      const mergeThree = (a, b, c) => [].concat(a, b, c);
 *
 *      mergeThree(1, 2, 3); //=> [1, 2, 3]
 *
 *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
 * @symb R.flip(f)(a, b, c) = f(b, a, c)
 */


var flip =
/*#__PURE__*/
_curry1(function flip(fn) {
  return curryN(fn.length, function (a, b) {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = b;
    args[1] = a;
    return fn.apply(this, args);
  });
});

module.exports = flip;
},{"./curryN":46,"./internal/_curry1":109}],75:[function(require,module,exports){
var _checkForMethod =
/*#__PURE__*/
require("./internal/_checkForMethod");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Iterate over an input `list`, calling a provided function `fn` for each
 * element in the list.
 *
 * `fn` receives one argument: *(value)*.
 *
 * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.forEach` method. For more
 * details on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
 *
 * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
 * the original array. In some libraries this function is named `each`.
 *
 * Dispatches to the `forEach` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig (a -> *) -> [a] -> [a]
 * @param {Function} fn The function to invoke. Receives one argument, `value`.
 * @param {Array} list The list to iterate over.
 * @return {Array} The original list.
 * @see R.addIndex
 * @example
 *
 *      const printXPlusFive = x => console.log(x + 5);
 *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
 *      // logs 6
 *      // logs 7
 *      // logs 8
 * @symb R.forEach(f, [a, b, c]) = [a, b, c]
 */


var forEach =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('forEach', function forEach(fn, list) {
  var len = list.length;
  var idx = 0;

  while (idx < len) {
    fn(list[idx]);
    idx += 1;
  }

  return list;
}));

module.exports = forEach;
},{"./internal/_checkForMethod":103,"./internal/_curry2":110}],76:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Iterate over an input `object`, calling a provided function `fn` for each
 * key and value in the object.
 *
 * `fn` receives three argument: *(value, key, obj)*.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Object
 * @sig ((a, String, StrMap a) -> Any) -> StrMap a -> StrMap a
 * @param {Function} fn The function to invoke. Receives three argument, `value`, `key`, `obj`.
 * @param {Object} obj The object to iterate over.
 * @return {Object} The original object.
 * @example
 *
 *      const printKeyConcatValue = (value, key) => console.log(key + ':' + value);
 *      R.forEachObjIndexed(printKeyConcatValue, {x: 1, y: 2}); //=> {x: 1, y: 2}
 *      // logs x:1
 *      // logs y:2
 * @symb R.forEachObjIndexed(f, {x: a, y: b}) = {x: a, y: b}
 */


var forEachObjIndexed =
/*#__PURE__*/
_curry2(function forEachObjIndexed(fn, obj) {
  var keyList = keys(obj);
  var idx = 0;

  while (idx < keyList.length) {
    var key = keyList[idx];
    fn(obj[key], key, obj);
    idx += 1;
  }

  return obj;
});

module.exports = forEachObjIndexed;
},{"./internal/_curry2":110,"./keys":182}],77:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Creates a new object from a list key-value pairs. If a key appears in
 * multiple pairs, the rightmost pair is included in the object.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [[k,v]] -> {k: v}
 * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
 * @return {Object} The object made by pairing up `keys` and `values`.
 * @see R.toPairs, R.pair
 * @example
 *
 *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
 */


var fromPairs =
/*#__PURE__*/
_curry1(function fromPairs(pairs) {
  var result = {};
  var idx = 0;

  while (idx < pairs.length) {
    result[pairs[idx][0]] = pairs[idx][1];
    idx += 1;
  }

  return result;
});

module.exports = fromPairs;
},{"./internal/_curry1":109}],78:[function(require,module,exports){
var _checkForMethod =
/*#__PURE__*/
require("./internal/_checkForMethod");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var reduceBy =
/*#__PURE__*/
require("./reduceBy");
/**
 * Splits a list into sub-lists stored in an object, based on the result of
 * calling a String-returning function on each element, and grouping the
 * results according to values returned.
 *
 * Dispatches to the `groupBy` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> String) -> [a] -> {String: [a]}
 * @param {Function} fn Function :: a -> String
 * @param {Array} list The array to group
 * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
 *         that produced that key when passed to `fn`.
 * @see R.reduceBy, R.transduce
 * @example
 *
 *      const byGrade = R.groupBy(function(student) {
 *        const score = student.score;
 *        return score < 65 ? 'F' :
 *               score < 70 ? 'D' :
 *               score < 80 ? 'C' :
 *               score < 90 ? 'B' : 'A';
 *      });
 *      const students = [{name: 'Abby', score: 84},
 *                      {name: 'Eddy', score: 58},
 *                      // ...
 *                      {name: 'Jack', score: 69}];
 *      byGrade(students);
 *      // {
 *      //   'A': [{name: 'Dianne', score: 99}],
 *      //   'B': [{name: 'Abby', score: 84}]
 *      //   // ...,
 *      //   'F': [{name: 'Eddy', score: 58}]
 *      // }
 */


var groupBy =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('groupBy',
/*#__PURE__*/
reduceBy(function (acc, item) {
  if (acc == null) {
    acc = [];
  }

  acc.push(item);
  return acc;
}, null)));

module.exports = groupBy;
},{"./internal/_checkForMethod":103,"./internal/_curry2":110,"./reduceBy":263}],79:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Takes a list and returns a list of lists where each sublist's elements are
 * all satisfied pairwise comparison according to the provided function.
 * Only adjacent elements are passed to the comparison function.
 *
 * @func
 * @memberOf R
 * @since v0.21.0
 * @category List
 * @sig ((a, a) → Boolean) → [a] → [[a]]
 * @param {Function} fn Function for determining whether two given (adjacent)
 *        elements should be in the same group
 * @param {Array} list The array to group. Also accepts a string, which will be
 *        treated as a list of characters.
 * @return {List} A list that contains sublists of elements,
 *         whose concatenations are equal to the original list.
 * @example
 *
 * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]
 *
 * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
 * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
 *
 * R.groupWith(R.eqBy(isVowel), 'aestiou')
 * //=> ['ae', 'st', 'iou']
 */


var groupWith =
/*#__PURE__*/
_curry2(function (fn, list) {
  var res = [];
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    var nextidx = idx + 1;

    while (nextidx < len && fn(list[nextidx - 1], list[nextidx])) {
      nextidx += 1;
    }

    res.push(list.slice(idx, nextidx));
    idx = nextidx;
  }

  return res;
});

module.exports = groupWith;
},{"./internal/_curry2":110}],80:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the first argument is greater than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.lt
 * @example
 *
 *      R.gt(2, 1); //=> true
 *      R.gt(2, 2); //=> false
 *      R.gt(2, 3); //=> false
 *      R.gt('a', 'z'); //=> false
 *      R.gt('z', 'a'); //=> true
 */


var gt =
/*#__PURE__*/
_curry2(function gt(a, b) {
  return a > b;
});

module.exports = gt;
},{"./internal/_curry2":110}],81:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the first argument is greater than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.lte
 * @example
 *
 *      R.gte(2, 1); //=> true
 *      R.gte(2, 2); //=> true
 *      R.gte(2, 3); //=> false
 *      R.gte('a', 'z'); //=> false
 *      R.gte('z', 'a'); //=> true
 */


var gte =
/*#__PURE__*/
_curry2(function gte(a, b) {
  return a >= b;
});

module.exports = gte;
},{"./internal/_curry2":110}],82:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var hasPath =
/*#__PURE__*/
require("./hasPath");
/**
 * Returns whether or not an object has an own property with the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      const hasName = R.has('name');
 *      hasName({name: 'alice'});   //=> true
 *      hasName({name: 'bob'});     //=> true
 *      hasName({});                //=> false
 *
 *      const point = {x: 0, y: 0};
 *      const pointHas = R.has(R.__, point);
 *      pointHas('x');  //=> true
 *      pointHas('y');  //=> true
 *      pointHas('z');  //=> false
 */


var has =
/*#__PURE__*/
_curry2(function has(prop, obj) {
  return hasPath([prop], obj);
});

module.exports = has;
},{"./hasPath":84,"./internal/_curry2":110}],83:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns whether or not an object or its prototype chain has a property with
 * the specified name
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Object
 * @sig s -> {s: x} -> Boolean
 * @param {String} prop The name of the property to check for.
 * @param {Object} obj The object to query.
 * @return {Boolean} Whether the property exists.
 * @example
 *
 *      function Rectangle(width, height) {
 *        this.width = width;
 *        this.height = height;
 *      }
 *      Rectangle.prototype.area = function() {
 *        return this.width * this.height;
 *      };
 *
 *      const square = new Rectangle(2, 2);
 *      R.hasIn('width', square);  //=> true
 *      R.hasIn('area', square);  //=> true
 */


var hasIn =
/*#__PURE__*/
_curry2(function hasIn(prop, obj) {
  return prop in obj;
});

module.exports = hasIn;
},{"./internal/_curry2":110}],84:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _has =
/*#__PURE__*/
require("./internal/_has");

var isNil =
/*#__PURE__*/
require("./isNil");
/**
 * Returns whether or not a path exists in an object. Only the object's
 * own properties are checked.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {a} -> Boolean
 * @param {Array} path The path to use.
 * @param {Object} obj The object to check the path in.
 * @return {Boolean} Whether the path exists.
 * @see R.has
 * @example
 *
 *      R.hasPath(['a', 'b'], {a: {b: 2}});         // => true
 *      R.hasPath(['a', 'b'], {a: {b: undefined}}); // => true
 *      R.hasPath(['a', 'b'], {a: {c: 2}});         // => false
 *      R.hasPath(['a', 'b'], {});                  // => false
 */


var hasPath =
/*#__PURE__*/
_curry2(function hasPath(_path, obj) {
  if (_path.length === 0 || isNil(obj)) {
    return false;
  }

  var val = obj;
  var idx = 0;

  while (idx < _path.length) {
    if (!isNil(val) && _has(_path[idx], val)) {
      val = val[_path[idx]];
      idx += 1;
    } else {
      return false;
    }
  }

  return true;
});

module.exports = hasPath;
},{"./internal/_curry2":110,"./internal/_has":121,"./isNil":179}],85:[function(require,module,exports){
var nth =
/*#__PURE__*/
require("./nth");
/**
 * Returns the first element of the given list or string. In some libraries
 * this function is named `first`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {Array|String} list
 * @return {*}
 * @see R.tail, R.init, R.last
 * @example
 *
 *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
 *      R.head([]); //=> undefined
 *
 *      R.head('abc'); //=> 'a'
 *      R.head(''); //=> ''
 */


var head =
/*#__PURE__*/
nth(0);
module.exports = head;
},{"./nth":225}],86:[function(require,module,exports){
var _objectIs =
/*#__PURE__*/
require("./internal/_objectIs");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns true if its arguments are identical, false otherwise. Values are
 * identical if they reference the same memory. `NaN` is identical to `NaN`;
 * `0` and `-0` are not identical.
 *
 * Note this is merely a curried version of ES6 `Object.is`.
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category Relation
 * @sig a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @example
 *
 *      const o = {};
 *      R.identical(o, o); //=> true
 *      R.identical(1, 1); //=> true
 *      R.identical(1, '1'); //=> false
 *      R.identical([], []); //=> false
 *      R.identical(0, -0); //=> false
 *      R.identical(NaN, NaN); //=> true
 */


var identical =
/*#__PURE__*/
_curry2(_objectIs);

module.exports = identical;
},{"./internal/_curry2":110,"./internal/_objectIs":140}],87:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _identity =
/*#__PURE__*/
require("./internal/_identity");
/**
 * A function that does nothing but return the parameter supplied to it. Good
 * as a default or placeholder function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig a -> a
 * @param {*} x The value to return.
 * @return {*} The input value, `x`.
 * @example
 *
 *      R.identity(1); //=> 1
 *
 *      const obj = {};
 *      R.identity(obj) === obj; //=> true
 * @symb R.identity(a) = a
 */


var identity =
/*#__PURE__*/
_curry1(_identity);

module.exports = identity;
},{"./internal/_curry1":109,"./internal/_identity":122}],88:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Creates a function that will process either the `onTrue` or the `onFalse`
 * function depending upon the result of the `condition` predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Logic
 * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
 * @param {Function} condition A predicate function
 * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
 * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
 * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
 *                    function depending upon the result of the `condition` predicate.
 * @see R.unless, R.when, R.cond
 * @example
 *
 *      const incCount = R.ifElse(
 *        R.has('count'),
 *        R.over(R.lensProp('count'), R.inc),
 *        R.assoc('count', 1)
 *      );
 *      incCount({});           //=> { count: 1 }
 *      incCount({ count: 1 }); //=> { count: 2 }
 */


var ifElse =
/*#__PURE__*/
_curry3(function ifElse(condition, onTrue, onFalse) {
  return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
    return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
  });
});

module.exports = ifElse;
},{"./curryN":46,"./internal/_curry3":111}],89:[function(require,module,exports){
var add =
/*#__PURE__*/
require("./add");
/**
 * Increments its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number} n + 1
 * @see R.dec
 * @example
 *
 *      R.inc(42); //=> 43
 */


var inc =
/*#__PURE__*/
add(1);
module.exports = inc;
},{"./add":6}],90:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./internal/_includes");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the specified value is equal, in [`R.equals`](#equals)
 * terms, to at least one element of the given list; `false` otherwise.
 * Works also with strings.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category List
 * @sig a -> [a] -> Boolean
 * @param {Object} a The item to compare against.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if an equivalent item is in the list, `false` otherwise.
 * @see R.any
 * @example
 *
 *      R.includes(3, [1, 2, 3]); //=> true
 *      R.includes(4, [1, 2, 3]); //=> false
 *      R.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true
 *      R.includes([42], [[42]]); //=> true
 *      R.includes('ba', 'banana'); //=>true
 */


var includes =
/*#__PURE__*/
_curry2(_includes);

module.exports = includes;
},{"./internal/_curry2":110,"./internal/_includes":123}],91:[function(require,module,exports){
module.exports = {};
module.exports.F =
/*#__PURE__*/
require("./F");
module.exports.T =
/*#__PURE__*/
require("./T");
module.exports.__ =
/*#__PURE__*/
require("./__");
module.exports.add =
/*#__PURE__*/
require("./add");
module.exports.addIndex =
/*#__PURE__*/
require("./addIndex");
module.exports.adjust =
/*#__PURE__*/
require("./adjust");
module.exports.all =
/*#__PURE__*/
require("./all");
module.exports.allPass =
/*#__PURE__*/
require("./allPass");
module.exports.always =
/*#__PURE__*/
require("./always");
module.exports.and =
/*#__PURE__*/
require("./and");
module.exports.any =
/*#__PURE__*/
require("./any");
module.exports.anyPass =
/*#__PURE__*/
require("./anyPass");
module.exports.ap =
/*#__PURE__*/
require("./ap");
module.exports.aperture =
/*#__PURE__*/
require("./aperture");
module.exports.append =
/*#__PURE__*/
require("./append");
module.exports.apply =
/*#__PURE__*/
require("./apply");
module.exports.applySpec =
/*#__PURE__*/
require("./applySpec");
module.exports.applyTo =
/*#__PURE__*/
require("./applyTo");
module.exports.ascend =
/*#__PURE__*/
require("./ascend");
module.exports.assoc =
/*#__PURE__*/
require("./assoc");
module.exports.assocPath =
/*#__PURE__*/
require("./assocPath");
module.exports.binary =
/*#__PURE__*/
require("./binary");
module.exports.bind =
/*#__PURE__*/
require("./bind");
module.exports.both =
/*#__PURE__*/
require("./both");
module.exports.call =
/*#__PURE__*/
require("./call");
module.exports.chain =
/*#__PURE__*/
require("./chain");
module.exports.clamp =
/*#__PURE__*/
require("./clamp");
module.exports.clone =
/*#__PURE__*/
require("./clone");
module.exports.comparator =
/*#__PURE__*/
require("./comparator");
module.exports.complement =
/*#__PURE__*/
require("./complement");
module.exports.compose =
/*#__PURE__*/
require("./compose");
module.exports.composeK =
/*#__PURE__*/
require("./composeK");
module.exports.composeP =
/*#__PURE__*/
require("./composeP");
module.exports.composeWith =
/*#__PURE__*/
require("./composeWith");
module.exports.concat =
/*#__PURE__*/
require("./concat");
module.exports.cond =
/*#__PURE__*/
require("./cond");
module.exports.construct =
/*#__PURE__*/
require("./construct");
module.exports.constructN =
/*#__PURE__*/
require("./constructN");
module.exports.contains =
/*#__PURE__*/
require("./contains");
module.exports.converge =
/*#__PURE__*/
require("./converge");
module.exports.countBy =
/*#__PURE__*/
require("./countBy");
module.exports.curry =
/*#__PURE__*/
require("./curry");
module.exports.curryN =
/*#__PURE__*/
require("./curryN");
module.exports.dec =
/*#__PURE__*/
require("./dec");
module.exports.defaultTo =
/*#__PURE__*/
require("./defaultTo");
module.exports.descend =
/*#__PURE__*/
require("./descend");
module.exports.difference =
/*#__PURE__*/
require("./difference");
module.exports.differenceWith =
/*#__PURE__*/
require("./differenceWith");
module.exports.dissoc =
/*#__PURE__*/
require("./dissoc");
module.exports.dissocPath =
/*#__PURE__*/
require("./dissocPath");
module.exports.divide =
/*#__PURE__*/
require("./divide");
module.exports.drop =
/*#__PURE__*/
require("./drop");
module.exports.dropLast =
/*#__PURE__*/
require("./dropLast");
module.exports.dropLastWhile =
/*#__PURE__*/
require("./dropLastWhile");
module.exports.dropRepeats =
/*#__PURE__*/
require("./dropRepeats");
module.exports.dropRepeatsWith =
/*#__PURE__*/
require("./dropRepeatsWith");
module.exports.dropWhile =
/*#__PURE__*/
require("./dropWhile");
module.exports.either =
/*#__PURE__*/
require("./either");
module.exports.empty =
/*#__PURE__*/
require("./empty");
module.exports.endsWith =
/*#__PURE__*/
require("./endsWith");
module.exports.eqBy =
/*#__PURE__*/
require("./eqBy");
module.exports.eqProps =
/*#__PURE__*/
require("./eqProps");
module.exports.equals =
/*#__PURE__*/
require("./equals");
module.exports.evolve =
/*#__PURE__*/
require("./evolve");
module.exports.filter =
/*#__PURE__*/
require("./filter");
module.exports.find =
/*#__PURE__*/
require("./find");
module.exports.findIndex =
/*#__PURE__*/
require("./findIndex");
module.exports.findLast =
/*#__PURE__*/
require("./findLast");
module.exports.findLastIndex =
/*#__PURE__*/
require("./findLastIndex");
module.exports.flatten =
/*#__PURE__*/
require("./flatten");
module.exports.flip =
/*#__PURE__*/
require("./flip");
module.exports.forEach =
/*#__PURE__*/
require("./forEach");
module.exports.forEachObjIndexed =
/*#__PURE__*/
require("./forEachObjIndexed");
module.exports.fromPairs =
/*#__PURE__*/
require("./fromPairs");
module.exports.groupBy =
/*#__PURE__*/
require("./groupBy");
module.exports.groupWith =
/*#__PURE__*/
require("./groupWith");
module.exports.gt =
/*#__PURE__*/
require("./gt");
module.exports.gte =
/*#__PURE__*/
require("./gte");
module.exports.has =
/*#__PURE__*/
require("./has");
module.exports.hasIn =
/*#__PURE__*/
require("./hasIn");
module.exports.hasPath =
/*#__PURE__*/
require("./hasPath");
module.exports.head =
/*#__PURE__*/
require("./head");
module.exports.identical =
/*#__PURE__*/
require("./identical");
module.exports.identity =
/*#__PURE__*/
require("./identity");
module.exports.ifElse =
/*#__PURE__*/
require("./ifElse");
module.exports.inc =
/*#__PURE__*/
require("./inc");
module.exports.includes =
/*#__PURE__*/
require("./includes");
module.exports.indexBy =
/*#__PURE__*/
require("./indexBy");
module.exports.indexOf =
/*#__PURE__*/
require("./indexOf");
module.exports.init =
/*#__PURE__*/
require("./init");
module.exports.innerJoin =
/*#__PURE__*/
require("./innerJoin");
module.exports.insert =
/*#__PURE__*/
require("./insert");
module.exports.insertAll =
/*#__PURE__*/
require("./insertAll");
module.exports.intersection =
/*#__PURE__*/
require("./intersection");
module.exports.intersperse =
/*#__PURE__*/
require("./intersperse");
module.exports.into =
/*#__PURE__*/
require("./into");
module.exports.invert =
/*#__PURE__*/
require("./invert");
module.exports.invertObj =
/*#__PURE__*/
require("./invertObj");
module.exports.invoker =
/*#__PURE__*/
require("./invoker");
module.exports.is =
/*#__PURE__*/
require("./is");
module.exports.isEmpty =
/*#__PURE__*/
require("./isEmpty");
module.exports.isNil =
/*#__PURE__*/
require("./isNil");
module.exports.join =
/*#__PURE__*/
require("./join");
module.exports.juxt =
/*#__PURE__*/
require("./juxt");
module.exports.keys =
/*#__PURE__*/
require("./keys");
module.exports.keysIn =
/*#__PURE__*/
require("./keysIn");
module.exports.last =
/*#__PURE__*/
require("./last");
module.exports.lastIndexOf =
/*#__PURE__*/
require("./lastIndexOf");
module.exports.length =
/*#__PURE__*/
require("./length");
module.exports.lens =
/*#__PURE__*/
require("./lens");
module.exports.lensIndex =
/*#__PURE__*/
require("./lensIndex");
module.exports.lensPath =
/*#__PURE__*/
require("./lensPath");
module.exports.lensProp =
/*#__PURE__*/
require("./lensProp");
module.exports.lift =
/*#__PURE__*/
require("./lift");
module.exports.liftN =
/*#__PURE__*/
require("./liftN");
module.exports.lt =
/*#__PURE__*/
require("./lt");
module.exports.lte =
/*#__PURE__*/
require("./lte");
module.exports.map =
/*#__PURE__*/
require("./map");
module.exports.mapAccum =
/*#__PURE__*/
require("./mapAccum");
module.exports.mapAccumRight =
/*#__PURE__*/
require("./mapAccumRight");
module.exports.mapObjIndexed =
/*#__PURE__*/
require("./mapObjIndexed");
module.exports.match =
/*#__PURE__*/
require("./match");
module.exports.mathMod =
/*#__PURE__*/
require("./mathMod");
module.exports.max =
/*#__PURE__*/
require("./max");
module.exports.maxBy =
/*#__PURE__*/
require("./maxBy");
module.exports.mean =
/*#__PURE__*/
require("./mean");
module.exports.median =
/*#__PURE__*/
require("./median");
module.exports.memoizeWith =
/*#__PURE__*/
require("./memoizeWith");
module.exports.merge =
/*#__PURE__*/
require("./merge");
module.exports.mergeAll =
/*#__PURE__*/
require("./mergeAll");
module.exports.mergeDeepLeft =
/*#__PURE__*/
require("./mergeDeepLeft");
module.exports.mergeDeepRight =
/*#__PURE__*/
require("./mergeDeepRight");
module.exports.mergeDeepWith =
/*#__PURE__*/
require("./mergeDeepWith");
module.exports.mergeDeepWithKey =
/*#__PURE__*/
require("./mergeDeepWithKey");
module.exports.mergeLeft =
/*#__PURE__*/
require("./mergeLeft");
module.exports.mergeRight =
/*#__PURE__*/
require("./mergeRight");
module.exports.mergeWith =
/*#__PURE__*/
require("./mergeWith");
module.exports.mergeWithKey =
/*#__PURE__*/
require("./mergeWithKey");
module.exports.min =
/*#__PURE__*/
require("./min");
module.exports.minBy =
/*#__PURE__*/
require("./minBy");
module.exports.modulo =
/*#__PURE__*/
require("./modulo");
module.exports.move =
/*#__PURE__*/
require("./move");
module.exports.multiply =
/*#__PURE__*/
require("./multiply");
module.exports.nAry =
/*#__PURE__*/
require("./nAry");
module.exports.negate =
/*#__PURE__*/
require("./negate");
module.exports.none =
/*#__PURE__*/
require("./none");
module.exports.not =
/*#__PURE__*/
require("./not");
module.exports.nth =
/*#__PURE__*/
require("./nth");
module.exports.nthArg =
/*#__PURE__*/
require("./nthArg");
module.exports.o =
/*#__PURE__*/
require("./o");
module.exports.objOf =
/*#__PURE__*/
require("./objOf");
module.exports.of =
/*#__PURE__*/
require("./of");
module.exports.omit =
/*#__PURE__*/
require("./omit");
module.exports.once =
/*#__PURE__*/
require("./once");
module.exports.or =
/*#__PURE__*/
require("./or");
module.exports.otherwise =
/*#__PURE__*/
require("./otherwise");
module.exports.over =
/*#__PURE__*/
require("./over");
module.exports.pair =
/*#__PURE__*/
require("./pair");
module.exports.partial =
/*#__PURE__*/
require("./partial");
module.exports.partialRight =
/*#__PURE__*/
require("./partialRight");
module.exports.partition =
/*#__PURE__*/
require("./partition");
module.exports.path =
/*#__PURE__*/
require("./path");
module.exports.paths =
/*#__PURE__*/
require("./paths");
module.exports.pathEq =
/*#__PURE__*/
require("./pathEq");
module.exports.pathOr =
/*#__PURE__*/
require("./pathOr");
module.exports.pathSatisfies =
/*#__PURE__*/
require("./pathSatisfies");
module.exports.pick =
/*#__PURE__*/
require("./pick");
module.exports.pickAll =
/*#__PURE__*/
require("./pickAll");
module.exports.pickBy =
/*#__PURE__*/
require("./pickBy");
module.exports.pipe =
/*#__PURE__*/
require("./pipe");
module.exports.pipeK =
/*#__PURE__*/
require("./pipeK");
module.exports.pipeP =
/*#__PURE__*/
require("./pipeP");
module.exports.pipeWith =
/*#__PURE__*/
require("./pipeWith");
module.exports.pluck =
/*#__PURE__*/
require("./pluck");
module.exports.prepend =
/*#__PURE__*/
require("./prepend");
module.exports.product =
/*#__PURE__*/
require("./product");
module.exports.project =
/*#__PURE__*/
require("./project");
module.exports.prop =
/*#__PURE__*/
require("./prop");
module.exports.propEq =
/*#__PURE__*/
require("./propEq");
module.exports.propIs =
/*#__PURE__*/
require("./propIs");
module.exports.propOr =
/*#__PURE__*/
require("./propOr");
module.exports.propSatisfies =
/*#__PURE__*/
require("./propSatisfies");
module.exports.props =
/*#__PURE__*/
require("./props");
module.exports.range =
/*#__PURE__*/
require("./range");
module.exports.reduce =
/*#__PURE__*/
require("./reduce");
module.exports.reduceBy =
/*#__PURE__*/
require("./reduceBy");
module.exports.reduceRight =
/*#__PURE__*/
require("./reduceRight");
module.exports.reduceWhile =
/*#__PURE__*/
require("./reduceWhile");
module.exports.reduced =
/*#__PURE__*/
require("./reduced");
module.exports.reject =
/*#__PURE__*/
require("./reject");
module.exports.remove =
/*#__PURE__*/
require("./remove");
module.exports.repeat =
/*#__PURE__*/
require("./repeat");
module.exports.replace =
/*#__PURE__*/
require("./replace");
module.exports.reverse =
/*#__PURE__*/
require("./reverse");
module.exports.scan =
/*#__PURE__*/
require("./scan");
module.exports.sequence =
/*#__PURE__*/
require("./sequence");
module.exports.set =
/*#__PURE__*/
require("./set");
module.exports.slice =
/*#__PURE__*/
require("./slice");
module.exports.sort =
/*#__PURE__*/
require("./sort");
module.exports.sortBy =
/*#__PURE__*/
require("./sortBy");
module.exports.sortWith =
/*#__PURE__*/
require("./sortWith");
module.exports.split =
/*#__PURE__*/
require("./split");
module.exports.splitAt =
/*#__PURE__*/
require("./splitAt");
module.exports.splitEvery =
/*#__PURE__*/
require("./splitEvery");
module.exports.splitWhen =
/*#__PURE__*/
require("./splitWhen");
module.exports.startsWith =
/*#__PURE__*/
require("./startsWith");
module.exports.subtract =
/*#__PURE__*/
require("./subtract");
module.exports.sum =
/*#__PURE__*/
require("./sum");
module.exports.symmetricDifference =
/*#__PURE__*/
require("./symmetricDifference");
module.exports.symmetricDifferenceWith =
/*#__PURE__*/
require("./symmetricDifferenceWith");
module.exports.tail =
/*#__PURE__*/
require("./tail");
module.exports.take =
/*#__PURE__*/
require("./take");
module.exports.takeLast =
/*#__PURE__*/
require("./takeLast");
module.exports.takeLastWhile =
/*#__PURE__*/
require("./takeLastWhile");
module.exports.takeWhile =
/*#__PURE__*/
require("./takeWhile");
module.exports.tap =
/*#__PURE__*/
require("./tap");
module.exports.test =
/*#__PURE__*/
require("./test");
module.exports.andThen =
/*#__PURE__*/
require("./andThen");
module.exports.times =
/*#__PURE__*/
require("./times");
module.exports.toLower =
/*#__PURE__*/
require("./toLower");
module.exports.toPairs =
/*#__PURE__*/
require("./toPairs");
module.exports.toPairsIn =
/*#__PURE__*/
require("./toPairsIn");
module.exports.toString =
/*#__PURE__*/
require("./toString");
module.exports.toUpper =
/*#__PURE__*/
require("./toUpper");
module.exports.transduce =
/*#__PURE__*/
require("./transduce");
module.exports.transpose =
/*#__PURE__*/
require("./transpose");
module.exports.traverse =
/*#__PURE__*/
require("./traverse");
module.exports.trim =
/*#__PURE__*/
require("./trim");
module.exports.tryCatch =
/*#__PURE__*/
require("./tryCatch");
module.exports.type =
/*#__PURE__*/
require("./type");
module.exports.unapply =
/*#__PURE__*/
require("./unapply");
module.exports.unary =
/*#__PURE__*/
require("./unary");
module.exports.uncurryN =
/*#__PURE__*/
require("./uncurryN");
module.exports.unfold =
/*#__PURE__*/
require("./unfold");
module.exports.union =
/*#__PURE__*/
require("./union");
module.exports.unionWith =
/*#__PURE__*/
require("./unionWith");
module.exports.uniq =
/*#__PURE__*/
require("./uniq");
module.exports.uniqBy =
/*#__PURE__*/
require("./uniqBy");
module.exports.uniqWith =
/*#__PURE__*/
require("./uniqWith");
module.exports.unless =
/*#__PURE__*/
require("./unless");
module.exports.unnest =
/*#__PURE__*/
require("./unnest");
module.exports.until =
/*#__PURE__*/
require("./until");
module.exports.update =
/*#__PURE__*/
require("./update");
module.exports.useWith =
/*#__PURE__*/
require("./useWith");
module.exports.values =
/*#__PURE__*/
require("./values");
module.exports.valuesIn =
/*#__PURE__*/
require("./valuesIn");
module.exports.view =
/*#__PURE__*/
require("./view");
module.exports.when =
/*#__PURE__*/
require("./when");
module.exports.where =
/*#__PURE__*/
require("./where");
module.exports.whereEq =
/*#__PURE__*/
require("./whereEq");
module.exports.without =
/*#__PURE__*/
require("./without");
module.exports.xor =
/*#__PURE__*/
require("./xor");
module.exports.xprod =
/*#__PURE__*/
require("./xprod");
module.exports.zip =
/*#__PURE__*/
require("./zip");
module.exports.zipObj =
/*#__PURE__*/
require("./zipObj");
module.exports.zipWith =
/*#__PURE__*/
require("./zipWith");
module.exports.thunkify =
/*#__PURE__*/
require("./thunkify");
},{"./F":3,"./T":4,"./__":5,"./add":6,"./addIndex":7,"./adjust":8,"./all":9,"./allPass":10,"./always":11,"./and":12,"./andThen":13,"./any":14,"./anyPass":15,"./ap":16,"./aperture":17,"./append":18,"./apply":19,"./applySpec":20,"./applyTo":21,"./ascend":22,"./assoc":23,"./assocPath":24,"./binary":25,"./bind":26,"./both":27,"./call":28,"./chain":29,"./clamp":30,"./clone":31,"./comparator":32,"./complement":33,"./compose":34,"./composeK":35,"./composeP":36,"./composeWith":37,"./concat":38,"./cond":39,"./construct":40,"./constructN":41,"./contains":42,"./converge":43,"./countBy":44,"./curry":45,"./curryN":46,"./dec":47,"./defaultTo":48,"./descend":49,"./difference":50,"./differenceWith":51,"./dissoc":52,"./dissocPath":53,"./divide":54,"./drop":55,"./dropLast":56,"./dropLastWhile":57,"./dropRepeats":58,"./dropRepeatsWith":59,"./dropWhile":60,"./either":61,"./empty":62,"./endsWith":63,"./eqBy":64,"./eqProps":65,"./equals":66,"./evolve":67,"./filter":68,"./find":69,"./findIndex":70,"./findLast":71,"./findLastIndex":72,"./flatten":73,"./flip":74,"./forEach":75,"./forEachObjIndexed":76,"./fromPairs":77,"./groupBy":78,"./groupWith":79,"./gt":80,"./gte":81,"./has":82,"./hasIn":83,"./hasPath":84,"./head":85,"./identical":86,"./identity":87,"./ifElse":88,"./inc":89,"./includes":90,"./indexBy":92,"./indexOf":93,"./init":94,"./innerJoin":95,"./insert":96,"./insertAll":97,"./intersection":171,"./intersperse":172,"./into":173,"./invert":174,"./invertObj":175,"./invoker":176,"./is":177,"./isEmpty":178,"./isNil":179,"./join":180,"./juxt":181,"./keys":182,"./keysIn":183,"./last":184,"./lastIndexOf":185,"./length":186,"./lens":187,"./lensIndex":188,"./lensPath":189,"./lensProp":190,"./lift":191,"./liftN":192,"./lt":193,"./lte":194,"./map":195,"./mapAccum":196,"./mapAccumRight":197,"./mapObjIndexed":198,"./match":199,"./mathMod":200,"./max":201,"./maxBy":202,"./mean":203,"./median":204,"./memoizeWith":205,"./merge":206,"./mergeAll":207,"./mergeDeepLeft":208,"./mergeDeepRight":209,"./mergeDeepWith":210,"./mergeDeepWithKey":211,"./mergeLeft":212,"./mergeRight":213,"./mergeWith":214,"./mergeWithKey":215,"./min":216,"./minBy":217,"./modulo":218,"./move":219,"./multiply":220,"./nAry":221,"./negate":222,"./none":223,"./not":224,"./nth":225,"./nthArg":226,"./o":227,"./objOf":228,"./of":229,"./omit":230,"./once":231,"./or":232,"./otherwise":233,"./over":234,"./pair":235,"./partial":236,"./partialRight":237,"./partition":238,"./path":239,"./pathEq":240,"./pathOr":241,"./pathSatisfies":242,"./paths":243,"./pick":244,"./pickAll":245,"./pickBy":246,"./pipe":247,"./pipeK":248,"./pipeP":249,"./pipeWith":250,"./pluck":251,"./prepend":252,"./product":253,"./project":254,"./prop":255,"./propEq":256,"./propIs":257,"./propOr":258,"./propSatisfies":259,"./props":260,"./range":261,"./reduce":262,"./reduceBy":263,"./reduceRight":264,"./reduceWhile":265,"./reduced":266,"./reject":267,"./remove":268,"./repeat":269,"./replace":270,"./reverse":271,"./scan":272,"./sequence":273,"./set":274,"./slice":275,"./sort":276,"./sortBy":277,"./sortWith":278,"./split":279,"./splitAt":280,"./splitEvery":281,"./splitWhen":282,"./startsWith":283,"./subtract":284,"./sum":285,"./symmetricDifference":286,"./symmetricDifferenceWith":287,"./tail":288,"./take":289,"./takeLast":290,"./takeLastWhile":291,"./takeWhile":292,"./tap":293,"./test":294,"./thunkify":295,"./times":296,"./toLower":297,"./toPairs":298,"./toPairsIn":299,"./toString":300,"./toUpper":301,"./transduce":302,"./transpose":303,"./traverse":304,"./trim":305,"./tryCatch":306,"./type":307,"./unapply":308,"./unary":309,"./uncurryN":310,"./unfold":311,"./union":312,"./unionWith":313,"./uniq":314,"./uniqBy":315,"./uniqWith":316,"./unless":317,"./unnest":318,"./until":319,"./update":320,"./useWith":321,"./values":322,"./valuesIn":323,"./view":324,"./when":325,"./where":326,"./whereEq":327,"./without":328,"./xor":329,"./xprod":330,"./zip":331,"./zipObj":332,"./zipWith":333}],92:[function(require,module,exports){
var reduceBy =
/*#__PURE__*/
require("./reduceBy");
/**
 * Given a function that generates a key, turns a list of objects into an
 * object indexing the objects by the given key. Note that if multiple
 * objects generate the same value for the indexing key only the last value
 * will be included in the generated object.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (a -> String) -> [{k: v}] -> {k: {k: v}}
 * @param {Function} fn Function :: a -> String
 * @param {Array} array The array of objects to index
 * @return {Object} An object indexing each array element by the given property.
 * @example
 *
 *      const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
 *      R.indexBy(R.prop('id'), list);
 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
 */


var indexBy =
/*#__PURE__*/
reduceBy(function (acc, elem) {
  return elem;
}, null);
module.exports = indexBy;
},{"./reduceBy":263}],93:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _indexOf =
/*#__PURE__*/
require("./internal/_indexOf");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");
/**
 * Returns the position of the first occurrence of an item in an array, or -1
 * if the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.lastIndexOf
 * @example
 *
 *      R.indexOf(3, [1,2,3,4]); //=> 2
 *      R.indexOf(10, [1,2,3,4]); //=> -1
 */


var indexOf =
/*#__PURE__*/
_curry2(function indexOf(target, xs) {
  return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
});

module.exports = indexOf;
},{"./internal/_curry2":110,"./internal/_indexOf":125,"./internal/_isArray":127}],94:[function(require,module,exports){
var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns all but the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.last, R.head, R.tail
 * @example
 *
 *      R.init([1, 2, 3]);  //=> [1, 2]
 *      R.init([1, 2]);     //=> [1]
 *      R.init([1]);        //=> []
 *      R.init([]);         //=> []
 *
 *      R.init('abc');  //=> 'ab'
 *      R.init('ab');   //=> 'a'
 *      R.init('a');    //=> ''
 *      R.init('');     //=> ''
 */


var init =
/*#__PURE__*/
slice(0, -1);
module.exports = init;
},{"./slice":275}],95:[function(require,module,exports){
var _includesWith =
/*#__PURE__*/
require("./internal/_includesWith");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _filter =
/*#__PURE__*/
require("./internal/_filter");
/**
 * Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list
 * `xs'` comprising each of the elements of `xs` which is equal to one or more
 * elements of `ys` according to `pred`.
 *
 * `pred` must be a binary function expecting an element from each list.
 *
 * `xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should
 * not be significant, but since `xs'` is ordered the implementation guarantees
 * that its values are in the same order as they appear in `xs`. Duplicates are
 * not removed, so `xs'` may contain duplicates if `xs` contains duplicates.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Relation
 * @sig ((a, b) -> Boolean) -> [a] -> [b] -> [a]
 * @param {Function} pred
 * @param {Array} xs
 * @param {Array} ys
 * @return {Array}
 * @see R.intersection
 * @example
 *
 *      R.innerJoin(
 *        (record, id) => record.id === id,
 *        [{id: 824, name: 'Richie Furay'},
 *         {id: 956, name: 'Dewey Martin'},
 *         {id: 313, name: 'Bruce Palmer'},
 *         {id: 456, name: 'Stephen Stills'},
 *         {id: 177, name: 'Neil Young'}],
 *        [177, 456, 999]
 *      );
 *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
 */


var innerJoin =
/*#__PURE__*/
_curry3(function innerJoin(pred, xs, ys) {
  return _filter(function (x) {
    return _includesWith(pred, x, ys);
  }, xs);
});

module.exports = innerJoin;
},{"./internal/_curry3":111,"./internal/_filter":117,"./internal/_includesWith":124}],96:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Inserts the supplied element into the list, at the specified `index`. _Note that

 * this is not destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} index The position to insert the element
 * @param {*} elt The element to insert into the Array
 * @param {Array} list The list to insert into
 * @return {Array} A new Array with `elt` inserted at `index`.
 * @example
 *
 *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
 */


var insert =
/*#__PURE__*/
_curry3(function insert(idx, elt, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  var result = Array.prototype.slice.call(list, 0);
  result.splice(idx, 0, elt);
  return result;
});

module.exports = insert;
},{"./internal/_curry3":111}],97:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Inserts the sub-list into the list, at the specified `index`. _Note that this is not
 * destructive_: it returns a copy of the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category List
 * @sig Number -> [a] -> [a] -> [a]
 * @param {Number} index The position to insert the sub-list
 * @param {Array} elts The sub-list to insert into the Array
 * @param {Array} list The list to insert the sub-list into
 * @return {Array} A new Array with `elts` inserted starting at `index`.
 * @example
 *
 *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
 */


var insertAll =
/*#__PURE__*/
_curry3(function insertAll(idx, elts, list) {
  idx = idx < list.length && idx >= 0 ? idx : list.length;
  return [].concat(Array.prototype.slice.call(list, 0, idx), elts, Array.prototype.slice.call(list, idx));
});

module.exports = insertAll;
},{"./internal/_curry3":111}],98:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./_includes");

var _Set =
/*#__PURE__*/
function () {
  function _Set() {
    /* globals Set */
    this._nativeSet = typeof Set === 'function' ? new Set() : null;
    this._items = {};
  }

  // until we figure out why jsdoc chokes on this
  // @param item The item to add to the Set
  // @returns {boolean} true if the item did not exist prior, otherwise false
  //
  _Set.prototype.add = function (item) {
    return !hasOrAdd(item, true, this);
  }; //
  // @param item The item to check for existence in the Set
  // @returns {boolean} true if the item exists in the Set, otherwise false
  //


  _Set.prototype.has = function (item) {
    return hasOrAdd(item, false, this);
  }; //
  // Combines the logic for checking whether an item is a member of the set and
  // for adding a new item to the set.
  //
  // @param item       The item to check or add to the Set instance.
  // @param shouldAdd  If true, the item will be added to the set if it doesn't
  //                   already exist.
  // @param set        The set instance to check or add to.
  // @return {boolean} true if the item already existed, otherwise false.
  //


  return _Set;
}();

function hasOrAdd(item, shouldAdd, set) {
  var type = typeof item;
  var prevSize, newSize;

  switch (type) {
    case 'string':
    case 'number':
      // distinguish between +0 and -0
      if (item === 0 && 1 / item === -Infinity) {
        if (set._items['-0']) {
          return true;
        } else {
          if (shouldAdd) {
            set._items['-0'] = true;
          }

          return false;
        }
      } // these types can all utilise the native Set


      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = {};
            set._items[type][item] = true;
          }

          return false;
        } else if (item in set._items[type]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][item] = true;
          }

          return false;
        }
      }

    case 'boolean':
      // set._items['boolean'] holds a two element array
      // representing [ falseExists, trueExists ]
      if (type in set._items) {
        var bIdx = item ? 1 : 0;

        if (set._items[type][bIdx]) {
          return true;
        } else {
          if (shouldAdd) {
            set._items[type][bIdx] = true;
          }

          return false;
        }
      } else {
        if (shouldAdd) {
          set._items[type] = item ? [false, true] : [true, false];
        }

        return false;
      }

    case 'function':
      // compare functions for reference equality
      if (set._nativeSet !== null) {
        if (shouldAdd) {
          prevSize = set._nativeSet.size;

          set._nativeSet.add(item);

          newSize = set._nativeSet.size;
          return newSize === prevSize;
        } else {
          return set._nativeSet.has(item);
        }
      } else {
        if (!(type in set._items)) {
          if (shouldAdd) {
            set._items[type] = [item];
          }

          return false;
        }

        if (!_includes(item, set._items[type])) {
          if (shouldAdd) {
            set._items[type].push(item);
          }

          return false;
        }

        return true;
      }

    case 'undefined':
      if (set._items[type]) {
        return true;
      } else {
        if (shouldAdd) {
          set._items[type] = true;
        }

        return false;
      }

    case 'object':
      if (item === null) {
        if (!set._items['null']) {
          if (shouldAdd) {
            set._items['null'] = true;
          }

          return false;
        }

        return true;
      }

    /* falls through */

    default:
      // reduce the search size of heterogeneous sets by creating buckets
      // for each type.
      type = Object.prototype.toString.call(item);

      if (!(type in set._items)) {
        if (shouldAdd) {
          set._items[type] = [item];
        }

        return false;
      } // scan through all previously applied items


      if (!_includes(item, set._items[type])) {
        if (shouldAdd) {
          set._items[type].push(item);
        }

        return false;
      }

      return true;
  }
} // A simple Set type that honours R.equals semantics


module.exports = _Set;
},{"./_includes":123}],99:[function(require,module,exports){
function _aperture(n, list) {
  var idx = 0;
  var limit = list.length - (n - 1);
  var acc = new Array(limit >= 0 ? limit : 0);

  while (idx < limit) {
    acc[idx] = Array.prototype.slice.call(list, idx, idx + n);
    idx += 1;
  }

  return acc;
}

module.exports = _aperture;
},{}],100:[function(require,module,exports){
function _arity(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

module.exports = _arity;
},{}],101:[function(require,module,exports){
function _arrayFromIterator(iter) {
  var list = [];
  var next;

  while (!(next = iter.next()).done) {
    list.push(next.value);
  }

  return list;
}

module.exports = _arrayFromIterator;
},{}],102:[function(require,module,exports){
var _isFunction =
/*#__PURE__*/
require("./_isFunction");

var _toString =
/*#__PURE__*/
require("./_toString");

function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError('`' + name + '` expected a Promise, received ' + _toString(p, []));
  }
}

module.exports = _assertPromise;
},{"./_isFunction":129,"./_toString":149}],103:[function(require,module,exports){
var _isArray =
/*#__PURE__*/
require("./_isArray");
/**
 * This checks whether a function has a [methodname] function. If it isn't an
 * array it will execute that function otherwise it will default to the ramda
 * implementation.
 *
 * @private
 * @param {Function} fn ramda implemtation
 * @param {String} methodname property to check for a custom implementation
 * @return {Object} Whatever the return value of the method is.
 */


function _checkForMethod(methodname, fn) {
  return function () {
    var length = arguments.length;

    if (length === 0) {
      return fn();
    }

    var obj = arguments[length - 1];
    return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
  };
}

module.exports = _checkForMethod;
},{"./_isArray":127}],104:[function(require,module,exports){
var _cloneRegExp =
/*#__PURE__*/
require("./_cloneRegExp");

var type =
/*#__PURE__*/
require("../type");
/**
 * Copies an object.
 *
 * @private
 * @param {*} value The value to be copied
 * @param {Array} refFrom Array containing the source references
 * @param {Array} refTo Array containing the copied source references
 * @param {Boolean} deep Whether or not to perform deep cloning.
 * @return {*} The copied value.
 */


function _clone(value, refFrom, refTo, deep) {
  var copy = function copy(copiedValue) {
    var len = refFrom.length;
    var idx = 0;

    while (idx < len) {
      if (value === refFrom[idx]) {
        return refTo[idx];
      }

      idx += 1;
    }

    refFrom[idx + 1] = value;
    refTo[idx + 1] = copiedValue;

    for (var key in value) {
      copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
    }

    return copiedValue;
  };

  switch (type(value)) {
    case 'Object':
      return copy({});

    case 'Array':
      return copy([]);

    case 'Date':
      return new Date(value.valueOf());

    case 'RegExp':
      return _cloneRegExp(value);

    default:
      return value;
  }
}

module.exports = _clone;
},{"../type":307,"./_cloneRegExp":105}],105:[function(require,module,exports){
function _cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
}

module.exports = _cloneRegExp;
},{}],106:[function(require,module,exports){
function _complement(f) {
  return function () {
    return !f.apply(this, arguments);
  };
}

module.exports = _complement;
},{}],107:[function(require,module,exports){
/**
 * Private `concat` function to merge two array-like objects.
 *
 * @private
 * @param {Array|Arguments} [set1=[]] An array-like object.
 * @param {Array|Arguments} [set2=[]] An array-like object.
 * @return {Array} A new, merged array.
 * @example
 *
 *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
 */
function _concat(set1, set2) {
  set1 = set1 || [];
  set2 = set2 || [];
  var idx;
  var len1 = set1.length;
  var len2 = set2.length;
  var result = [];
  idx = 0;

  while (idx < len1) {
    result[result.length] = set1[idx];
    idx += 1;
  }

  idx = 0;

  while (idx < len2) {
    result[result.length] = set2[idx];
    idx += 1;
  }

  return result;
}

module.exports = _concat;
},{}],108:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./_arity");

var _curry2 =
/*#__PURE__*/
require("./_curry2");

function _createPartialApplicator(concat) {
  return _curry2(function (fn, args) {
    return _arity(Math.max(0, fn.length - args.length), function () {
      return fn.apply(this, concat(args, arguments));
    });
  });
}

module.exports = _createPartialApplicator;
},{"./_arity":100,"./_curry2":110}],109:[function(require,module,exports){
var _isPlaceholder =
/*#__PURE__*/
require("./_isPlaceholder");
/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

module.exports = _curry1;
},{"./_isPlaceholder":133}],110:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./_curry1");

var _isPlaceholder =
/*#__PURE__*/
require("./_isPlaceholder");
/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;

      case 1:
        return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
          return fn(a, _b);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b);
        }) : fn(a, b);
    }
  };
}

module.exports = _curry2;
},{"./_curry1":109,"./_isPlaceholder":133}],111:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./_curry1");

var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _isPlaceholder =
/*#__PURE__*/
require("./_isPlaceholder");
/**
 * Optimized internal three-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curry3(fn) {
  return function f3(a, b, c) {
    switch (arguments.length) {
      case 0:
        return f3;

      case 1:
        return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        });

      case 2:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _curry1(function (_c) {
          return fn(a, b, _c);
        });

      default:
        return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
          return fn(_a, _b, c);
        }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
          return fn(_a, b, _c);
        }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
          return fn(a, _b, _c);
        }) : _isPlaceholder(a) ? _curry1(function (_a) {
          return fn(_a, b, c);
        }) : _isPlaceholder(b) ? _curry1(function (_b) {
          return fn(a, _b, c);
        }) : _isPlaceholder(c) ? _curry1(function (_c) {
          return fn(a, b, _c);
        }) : fn(a, b, c);
    }
  };
}

module.exports = _curry3;
},{"./_curry1":109,"./_curry2":110,"./_isPlaceholder":133}],112:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./_arity");

var _isPlaceholder =
/*#__PURE__*/
require("./_isPlaceholder");
/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curryN(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;

    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;

      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }

      combined[combinedIdx] = result;

      if (!_isPlaceholder(result)) {
        left -= 1;
      }

      combinedIdx += 1;
    }

    return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
  };
}

module.exports = _curryN;
},{"./_arity":100,"./_isPlaceholder":133}],113:[function(require,module,exports){
var _isArray =
/*#__PURE__*/
require("./_isArray");

var _isTransformer =
/*#__PURE__*/
require("./_isTransformer");
/**
 * Returns a function that dispatches with different strategies based on the
 * object in list position (last argument). If it is an array, executes [fn].
 * Otherwise, if it has a function with one of the given method names, it will
 * execute that function (functor case). Otherwise, if it is a transformer,
 * uses transducer [xf] to return a new transformer (transducer case).
 * Otherwise, it will default to executing [fn].
 *
 * @private
 * @param {Array} methodNames properties to check for a custom implementation
 * @param {Function} xf transducer to initialize if object is transformer
 * @param {Function} fn default ramda implementation
 * @return {Function} A function that dispatches on object in list position
 */


function _dispatchable(methodNames, xf, fn) {
  return function () {
    if (arguments.length === 0) {
      return fn();
    }

    var args = Array.prototype.slice.call(arguments, 0);
    var obj = args.pop();

    if (!_isArray(obj)) {
      var idx = 0;

      while (idx < methodNames.length) {
        if (typeof obj[methodNames[idx]] === 'function') {
          return obj[methodNames[idx]].apply(obj, args);
        }

        idx += 1;
      }

      if (_isTransformer(obj)) {
        var transducer = xf.apply(null, args);
        return transducer(obj);
      }
    }

    return fn.apply(this, arguments);
  };
}

module.exports = _dispatchable;
},{"./_isArray":127,"./_isTransformer":136}],114:[function(require,module,exports){
var take =
/*#__PURE__*/
require("../take");

function dropLast(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
}

module.exports = dropLast;
},{"../take":289}],115:[function(require,module,exports){
var slice =
/*#__PURE__*/
require("../slice");

function dropLastWhile(pred, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && pred(xs[idx])) {
    idx -= 1;
  }

  return slice(0, idx + 1, xs);
}

module.exports = dropLastWhile;
},{"../slice":275}],116:[function(require,module,exports){
var _arrayFromIterator =
/*#__PURE__*/
require("./_arrayFromIterator");

var _includesWith =
/*#__PURE__*/
require("./_includesWith");

var _functionName =
/*#__PURE__*/
require("./_functionName");

var _has =
/*#__PURE__*/
require("./_has");

var _objectIs =
/*#__PURE__*/
require("./_objectIs");

var keys =
/*#__PURE__*/
require("../keys");

var type =
/*#__PURE__*/
require("../type");
/**
 * private _uniqContentEquals function.
 * That function is checking equality of 2 iterator contents with 2 assumptions
 * - iterators lengths are the same
 * - iterators values are unique
 *
 * false-positive result will be returned for comparision of, e.g.
 * - [1,2,3] and [1,2,3,4]
 * - [1,1,1] and [1,2,3]
 * */


function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
  var a = _arrayFromIterator(aIterator);

  var b = _arrayFromIterator(bIterator);

  function eq(_a, _b) {
    return _equals(_a, _b, stackA.slice(), stackB.slice());
  } // if *a* array contains any element that is not included in *b*


  return !_includesWith(function (b, aItem) {
    return !_includesWith(eq, aItem, b);
  }, b, a);
}

function _equals(a, b, stackA, stackB) {
  if (_objectIs(a, b)) {
    return true;
  }

  var typeA = type(a);

  if (typeA !== type(b)) {
    return false;
  }

  if (a == null || b == null) {
    return false;
  }

  if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
    return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
  }

  if (typeof a.equals === 'function' || typeof b.equals === 'function') {
    return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
  }

  switch (typeA) {
    case 'Arguments':
    case 'Array':
    case 'Object':
      if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
        return a === b;
      }

      break;

    case 'Boolean':
    case 'Number':
    case 'String':
      if (!(typeof a === typeof b && _objectIs(a.valueOf(), b.valueOf()))) {
        return false;
      }

      break;

    case 'Date':
      if (!_objectIs(a.valueOf(), b.valueOf())) {
        return false;
      }

      break;

    case 'Error':
      return a.name === b.name && a.message === b.message;

    case 'RegExp':
      if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
        return false;
      }

      break;
  }

  var idx = stackA.length - 1;

  while (idx >= 0) {
    if (stackA[idx] === a) {
      return stackB[idx] === b;
    }

    idx -= 1;
  }

  switch (typeA) {
    case 'Map':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

    case 'Set':
      if (a.size !== b.size) {
        return false;
      }

      return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

    case 'Arguments':
    case 'Array':
    case 'Object':
    case 'Boolean':
    case 'Number':
    case 'String':
    case 'Date':
    case 'Error':
    case 'RegExp':
    case 'Int8Array':
    case 'Uint8Array':
    case 'Uint8ClampedArray':
    case 'Int16Array':
    case 'Uint16Array':
    case 'Int32Array':
    case 'Uint32Array':
    case 'Float32Array':
    case 'Float64Array':
    case 'ArrayBuffer':
      break;

    default:
      // Values of other types are only equal if identical.
      return false;
  }

  var keysA = keys(a);

  if (keysA.length !== keys(b).length) {
    return false;
  }

  var extendedStackA = stackA.concat([a]);
  var extendedStackB = stackB.concat([b]);
  idx = keysA.length - 1;

  while (idx >= 0) {
    var key = keysA[idx];

    if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
      return false;
    }

    idx -= 1;
  }

  return true;
}

module.exports = _equals;
},{"../keys":182,"../type":307,"./_arrayFromIterator":101,"./_functionName":120,"./_has":121,"./_includesWith":124,"./_objectIs":140}],117:[function(require,module,exports){
function _filter(fn, list) {
  var idx = 0;
  var len = list.length;
  var result = [];

  while (idx < len) {
    if (fn(list[idx])) {
      result[result.length] = list[idx];
    }

    idx += 1;
  }

  return result;
}

module.exports = _filter;
},{}],118:[function(require,module,exports){
var _forceReduced =
/*#__PURE__*/
require("./_forceReduced");

var _isArrayLike =
/*#__PURE__*/
require("./_isArrayLike");

var _reduce =
/*#__PURE__*/
require("./_reduce");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var preservingReduced = function (xf) {
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return xf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      var ret = xf['@@transducer/step'](result, input);
      return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
    }
  };
};

var _flatCat = function _xcat(xf) {
  var rxf = preservingReduced(xf);
  return {
    '@@transducer/init': _xfBase.init,
    '@@transducer/result': function (result) {
      return rxf['@@transducer/result'](result);
    },
    '@@transducer/step': function (result, input) {
      return !_isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
    }
  };
};

module.exports = _flatCat;
},{"./_forceReduced":119,"./_isArrayLike":128,"./_reduce":145,"./_xfBase":159}],119:[function(require,module,exports){
function _forceReduced(x) {
  return {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

module.exports = _forceReduced;
},{}],120:[function(require,module,exports){
function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}

module.exports = _functionName;
},{}],121:[function(require,module,exports){
function _has(prop, obj) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = _has;
},{}],122:[function(require,module,exports){
function _identity(x) {
  return x;
}

module.exports = _identity;
},{}],123:[function(require,module,exports){
var _indexOf =
/*#__PURE__*/
require("./_indexOf");

function _includes(a, list) {
  return _indexOf(list, a, 0) >= 0;
}

module.exports = _includes;
},{"./_indexOf":125}],124:[function(require,module,exports){
function _includesWith(pred, x, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    if (pred(x, list[idx])) {
      return true;
    }

    idx += 1;
  }

  return false;
}

module.exports = _includesWith;
},{}],125:[function(require,module,exports){
var equals =
/*#__PURE__*/
require("../equals");

function _indexOf(list, a, idx) {
  var inf, item; // Array.prototype.indexOf doesn't exist below IE9

  if (typeof list.indexOf === 'function') {
    switch (typeof a) {
      case 'number':
        if (a === 0) {
          // manually crawl the list to distinguish between +0 and -0
          inf = 1 / a;

          while (idx < list.length) {
            item = list[idx];

            if (item === 0 && 1 / item === inf) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } else if (a !== a) {
          // NaN
          while (idx < list.length) {
            item = list[idx];

            if (typeof item === 'number' && item !== item) {
              return idx;
            }

            idx += 1;
          }

          return -1;
        } // non-zero numbers can utilise Set


        return list.indexOf(a, idx);
      // all these types can utilise Set

      case 'string':
      case 'boolean':
      case 'function':
      case 'undefined':
        return list.indexOf(a, idx);

      case 'object':
        if (a === null) {
          // null can utilise Set
          return list.indexOf(a, idx);
        }

    }
  } // anything else not covered above, defer to R.equals


  while (idx < list.length) {
    if (equals(list[idx], a)) {
      return idx;
    }

    idx += 1;
  }

  return -1;
}

module.exports = _indexOf;
},{"../equals":66}],126:[function(require,module,exports){
var _has =
/*#__PURE__*/
require("./_has");

var toString = Object.prototype.toString;

var _isArguments =
/*#__PURE__*/
function () {
  return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
    return toString.call(x) === '[object Arguments]';
  } : function _isArguments(x) {
    return _has('callee', x);
  };
}();

module.exports = _isArguments;
},{"./_has":121}],127:[function(require,module,exports){
/**
 * Tests whether or not an object is an array.
 *
 * @private
 * @param {*} val The object to test.
 * @return {Boolean} `true` if `val` is an array, `false` otherwise.
 * @example
 *
 *      _isArray([]); //=> true
 *      _isArray(null); //=> false
 *      _isArray({}); //=> false
 */
module.exports = Array.isArray || function _isArray(val) {
  return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
};
},{}],128:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./_curry1");

var _isArray =
/*#__PURE__*/
require("./_isArray");

var _isString =
/*#__PURE__*/
require("./_isString");
/**
 * Tests whether or not an object is similar to an array.
 *
 * @private
 * @category Type
 * @category List
 * @sig * -> Boolean
 * @param {*} x The object to test.
 * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
 * @example
 *
 *      _isArrayLike([]); //=> true
 *      _isArrayLike(true); //=> false
 *      _isArrayLike({}); //=> false
 *      _isArrayLike({length: 10}); //=> false
 *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
 */


var _isArrayLike =
/*#__PURE__*/
_curry1(function isArrayLike(x) {
  if (_isArray(x)) {
    return true;
  }

  if (!x) {
    return false;
  }

  if (typeof x !== 'object') {
    return false;
  }

  if (_isString(x)) {
    return false;
  }

  if (x.nodeType === 1) {
    return !!x.length;
  }

  if (x.length === 0) {
    return true;
  }

  if (x.length > 0) {
    return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
  }

  return false;
});

module.exports = _isArrayLike;
},{"./_curry1":109,"./_isArray":127,"./_isString":135}],129:[function(require,module,exports){
function _isFunction(x) {
  var type = Object.prototype.toString.call(x);
  return type === '[object Function]' || type === '[object AsyncFunction]' || type === '[object GeneratorFunction]' || type === '[object AsyncGeneratorFunction]';
}

module.exports = _isFunction;
},{}],130:[function(require,module,exports){
/**
 * Determine if the passed argument is an integer.
 *
 * @private
 * @param {*} n
 * @category Type
 * @return {Boolean}
 */
module.exports = Number.isInteger || function _isInteger(n) {
  return n << 0 === n;
};
},{}],131:[function(require,module,exports){
function _isNumber(x) {
  return Object.prototype.toString.call(x) === '[object Number]';
}

module.exports = _isNumber;
},{}],132:[function(require,module,exports){
function _isObject(x) {
  return Object.prototype.toString.call(x) === '[object Object]';
}

module.exports = _isObject;
},{}],133:[function(require,module,exports){
function _isPlaceholder(a) {
  return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

module.exports = _isPlaceholder;
},{}],134:[function(require,module,exports){
function _isRegExp(x) {
  return Object.prototype.toString.call(x) === '[object RegExp]';
}

module.exports = _isRegExp;
},{}],135:[function(require,module,exports){
function _isString(x) {
  return Object.prototype.toString.call(x) === '[object String]';
}

module.exports = _isString;
},{}],136:[function(require,module,exports){
function _isTransformer(obj) {
  return obj != null && typeof obj['@@transducer/step'] === 'function';
}

module.exports = _isTransformer;
},{}],137:[function(require,module,exports){
var _isArrayLike =
/*#__PURE__*/
require("./_isArrayLike");
/**
 * `_makeFlat` is a helper function that returns a one-level or fully recursive
 * function based on the flag passed in.
 *
 * @private
 */


function _makeFlat(recursive) {
  return function flatt(list) {
    var value, jlen, j;
    var result = [];
    var idx = 0;
    var ilen = list.length;

    while (idx < ilen) {
      if (_isArrayLike(list[idx])) {
        value = recursive ? flatt(list[idx]) : list[idx];
        j = 0;
        jlen = value.length;

        while (j < jlen) {
          result[result.length] = value[j];
          j += 1;
        }
      } else {
        result[result.length] = list[idx];
      }

      idx += 1;
    }

    return result;
  };
}

module.exports = _makeFlat;
},{"./_isArrayLike":128}],138:[function(require,module,exports){
function _map(fn, functor) {
  var idx = 0;
  var len = functor.length;
  var result = Array(len);

  while (idx < len) {
    result[idx] = fn(functor[idx]);
    idx += 1;
  }

  return result;
}

module.exports = _map;
},{}],139:[function(require,module,exports){
var _has =
/*#__PURE__*/
require("./_has"); // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign


function _objectAssign(target) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  var idx = 1;
  var length = arguments.length;

  while (idx < length) {
    var source = arguments[idx];

    if (source != null) {
      for (var nextKey in source) {
        if (_has(nextKey, source)) {
          output[nextKey] = source[nextKey];
        }
      }
    }

    idx += 1;
  }

  return output;
}

module.exports = typeof Object.assign === 'function' ? Object.assign : _objectAssign;
},{"./_has":121}],140:[function(require,module,exports){
// Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function _objectIs(a, b) {
  // SameValue algorithm
  if (a === b) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return a !== 0 || 1 / a === 1 / b;
  } else {
    // Step 6.a: NaN == NaN
    return a !== a && b !== b;
  }
}

module.exports = typeof Object.is === 'function' ? Object.is : _objectIs;
},{}],141:[function(require,module,exports){
function _of(x) {
  return [x];
}

module.exports = _of;
},{}],142:[function(require,module,exports){
function _pipe(f, g) {
  return function () {
    return g.call(this, f.apply(this, arguments));
  };
}

module.exports = _pipe;
},{}],143:[function(require,module,exports){
function _pipeP(f, g) {
  return function () {
    var ctx = this;
    return f.apply(ctx, arguments).then(function (x) {
      return g.call(ctx, x);
    });
  };
}

module.exports = _pipeP;
},{}],144:[function(require,module,exports){
function _quote(s) {
  var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b') // \b matches word boundary; [\b] matches backspace
  .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
  return '"' + escaped.replace(/"/g, '\\"') + '"';
}

module.exports = _quote;
},{}],145:[function(require,module,exports){
var _isArrayLike =
/*#__PURE__*/
require("./_isArrayLike");

var _xwrap =
/*#__PURE__*/
require("./_xwrap");

var bind =
/*#__PURE__*/
require("../bind");

function _arrayReduce(xf, acc, list) {
  var idx = 0;
  var len = list.length;

  while (idx < len) {
    acc = xf['@@transducer/step'](acc, list[idx]);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    idx += 1;
  }

  return xf['@@transducer/result'](acc);
}

function _iterableReduce(xf, acc, iter) {
  var step = iter.next();

  while (!step.done) {
    acc = xf['@@transducer/step'](acc, step.value);

    if (acc && acc['@@transducer/reduced']) {
      acc = acc['@@transducer/value'];
      break;
    }

    step = iter.next();
  }

  return xf['@@transducer/result'](acc);
}

function _methodReduce(xf, acc, obj, methodName) {
  return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
}

var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

function _reduce(fn, acc, list) {
  if (typeof fn === 'function') {
    fn = _xwrap(fn);
  }

  if (_isArrayLike(list)) {
    return _arrayReduce(fn, acc, list);
  }

  if (typeof list['fantasy-land/reduce'] === 'function') {
    return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
  }

  if (list[symIterator] != null) {
    return _iterableReduce(fn, acc, list[symIterator]());
  }

  if (typeof list.next === 'function') {
    return _iterableReduce(fn, acc, list);
  }

  if (typeof list.reduce === 'function') {
    return _methodReduce(fn, acc, list, 'reduce');
  }

  throw new TypeError('reduce: list must be array or iterable');
}

module.exports = _reduce;
},{"../bind":26,"./_isArrayLike":128,"./_xwrap":170}],146:[function(require,module,exports){
function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x : {
    '@@transducer/value': x,
    '@@transducer/reduced': true
  };
}

module.exports = _reduced;
},{}],147:[function(require,module,exports){
var _objectAssign =
/*#__PURE__*/
require("./_objectAssign");

var _identity =
/*#__PURE__*/
require("./_identity");

var _isArrayLike =
/*#__PURE__*/
require("./_isArrayLike");

var _isTransformer =
/*#__PURE__*/
require("./_isTransformer");

var objOf =
/*#__PURE__*/
require("../objOf");

var _stepCatArray = {
  '@@transducer/init': Array,
  '@@transducer/step': function (xs, x) {
    xs.push(x);
    return xs;
  },
  '@@transducer/result': _identity
};
var _stepCatString = {
  '@@transducer/init': String,
  '@@transducer/step': function (a, b) {
    return a + b;
  },
  '@@transducer/result': _identity
};
var _stepCatObject = {
  '@@transducer/init': Object,
  '@@transducer/step': function (result, input) {
    return _objectAssign(result, _isArrayLike(input) ? objOf(input[0], input[1]) : input);
  },
  '@@transducer/result': _identity
};

function _stepCat(obj) {
  if (_isTransformer(obj)) {
    return obj;
  }

  if (_isArrayLike(obj)) {
    return _stepCatArray;
  }

  if (typeof obj === 'string') {
    return _stepCatString;
  }

  if (typeof obj === 'object') {
    return _stepCatObject;
  }

  throw new Error('Cannot create transformer for ' + obj);
}

module.exports = _stepCat;
},{"../objOf":228,"./_identity":122,"./_isArrayLike":128,"./_isTransformer":136,"./_objectAssign":139}],148:[function(require,module,exports){
/**
 * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
 */
var pad = function pad(n) {
  return (n < 10 ? '0' : '') + n;
};

var _toISOString = typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
  return d.toISOString();
} : function _toISOString(d) {
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
};

module.exports = _toISOString;
},{}],149:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./_includes");

var _map =
/*#__PURE__*/
require("./_map");

var _quote =
/*#__PURE__*/
require("./_quote");

var _toISOString =
/*#__PURE__*/
require("./_toISOString");

var keys =
/*#__PURE__*/
require("../keys");

var reject =
/*#__PURE__*/
require("../reject");

function _toString(x, seen) {
  var recur = function recur(y) {
    var xs = seen.concat([x]);
    return _includes(y, xs) ? '<Circular>' : _toString(y, xs);
  }; //  mapPairs :: (Object, [String]) -> [String]


  var mapPairs = function (obj, keys) {
    return _map(function (k) {
      return _quote(k) + ': ' + recur(obj[k]);
    }, keys.slice().sort());
  };

  switch (Object.prototype.toString.call(x)) {
    case '[object Arguments]':
      return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';

    case '[object Array]':
      return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
        return /^\d+$/.test(k);
      }, keys(x)))).join(', ') + ']';

    case '[object Boolean]':
      return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();

    case '[object Date]':
      return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';

    case '[object Null]':
      return 'null';

    case '[object Number]':
      return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);

    case '[object String]':
      return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);

    case '[object Undefined]':
      return 'undefined';

    default:
      if (typeof x.toString === 'function') {
        var repr = x.toString();

        if (repr !== '[object Object]') {
          return repr;
        }
      }

      return '{' + mapPairs(x, keys(x)).join(', ') + '}';
  }
}

module.exports = _toString;
},{"../keys":182,"../reject":267,"./_includes":123,"./_map":138,"./_quote":144,"./_toISOString":148}],150:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XAll =
/*#__PURE__*/
function () {
  function XAll(f, xf) {
    this.xf = xf;
    this.f = f;
    this.all = true;
  }

  XAll.prototype['@@transducer/init'] = _xfBase.init;

  XAll.prototype['@@transducer/result'] = function (result) {
    if (this.all) {
      result = this.xf['@@transducer/step'](result, true);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAll.prototype['@@transducer/step'] = function (result, input) {
    if (!this.f(input)) {
      this.all = false;
      result = _reduced(this.xf['@@transducer/step'](result, false));
    }

    return result;
  };

  return XAll;
}();

var _xall =
/*#__PURE__*/
_curry2(function _xall(f, xf) {
  return new XAll(f, xf);
});

module.exports = _xall;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],151:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XAny =
/*#__PURE__*/
function () {
  function XAny(f, xf) {
    this.xf = xf;
    this.f = f;
    this.any = false;
  }

  XAny.prototype['@@transducer/init'] = _xfBase.init;

  XAny.prototype['@@transducer/result'] = function (result) {
    if (!this.any) {
      result = this.xf['@@transducer/step'](result, false);
    }

    return this.xf['@@transducer/result'](result);
  };

  XAny.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.any = true;
      result = _reduced(this.xf['@@transducer/step'](result, true));
    }

    return result;
  };

  return XAny;
}();

var _xany =
/*#__PURE__*/
_curry2(function _xany(f, xf) {
  return new XAny(f, xf);
});

module.exports = _xany;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],152:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./_concat");

var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XAperture =
/*#__PURE__*/
function () {
  function XAperture(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XAperture.prototype['@@transducer/init'] = _xfBase.init;

  XAperture.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XAperture.prototype['@@transducer/step'] = function (result, input) {
    this.store(input);
    return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
  };

  XAperture.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  XAperture.prototype.getCopy = function () {
    return _concat(Array.prototype.slice.call(this.acc, this.pos), Array.prototype.slice.call(this.acc, 0, this.pos));
  };

  return XAperture;
}();

var _xaperture =
/*#__PURE__*/
_curry2(function _xaperture(n, xf) {
  return new XAperture(n, xf);
});

module.exports = _xaperture;
},{"./_concat":107,"./_curry2":110,"./_xfBase":159}],153:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _flatCat =
/*#__PURE__*/
require("./_flatCat");

var map =
/*#__PURE__*/
require("../map");

var _xchain =
/*#__PURE__*/
_curry2(function _xchain(f, xf) {
  return map(f, _flatCat(xf));
});

module.exports = _xchain;
},{"../map":195,"./_curry2":110,"./_flatCat":118}],154:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XDrop =
/*#__PURE__*/
function () {
  function XDrop(n, xf) {
    this.xf = xf;
    this.n = n;
  }

  XDrop.prototype['@@transducer/init'] = _xfBase.init;
  XDrop.prototype['@@transducer/result'] = _xfBase.result;

  XDrop.prototype['@@transducer/step'] = function (result, input) {
    if (this.n > 0) {
      this.n -= 1;
      return result;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDrop;
}();

var _xdrop =
/*#__PURE__*/
_curry2(function _xdrop(n, xf) {
  return new XDrop(n, xf);
});

module.exports = _xdrop;
},{"./_curry2":110,"./_xfBase":159}],155:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XDropLast =
/*#__PURE__*/
function () {
  function XDropLast(n, xf) {
    this.xf = xf;
    this.pos = 0;
    this.full = false;
    this.acc = new Array(n);
  }

  XDropLast.prototype['@@transducer/init'] = _xfBase.init;

  XDropLast.prototype['@@transducer/result'] = function (result) {
    this.acc = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.full) {
      result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
    }

    this.store(input);
    return result;
  };

  XDropLast.prototype.store = function (input) {
    this.acc[this.pos] = input;
    this.pos += 1;

    if (this.pos === this.acc.length) {
      this.pos = 0;
      this.full = true;
    }
  };

  return XDropLast;
}();

var _xdropLast =
/*#__PURE__*/
_curry2(function _xdropLast(n, xf) {
  return new XDropLast(n, xf);
});

module.exports = _xdropLast;
},{"./_curry2":110,"./_xfBase":159}],156:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduce =
/*#__PURE__*/
require("./_reduce");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XDropLastWhile =
/*#__PURE__*/
function () {
  function XDropLastWhile(fn, xf) {
    this.f = fn;
    this.retained = [];
    this.xf = xf;
  }

  XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;

  XDropLastWhile.prototype['@@transducer/result'] = function (result) {
    this.retained = null;
    return this.xf['@@transducer/result'](result);
  };

  XDropLastWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.retain(result, input) : this.flush(result, input);
  };

  XDropLastWhile.prototype.flush = function (result, input) {
    result = _reduce(this.xf['@@transducer/step'], result, this.retained);
    this.retained = [];
    return this.xf['@@transducer/step'](result, input);
  };

  XDropLastWhile.prototype.retain = function (result, input) {
    this.retained.push(input);
    return result;
  };

  return XDropLastWhile;
}();

var _xdropLastWhile =
/*#__PURE__*/
_curry2(function _xdropLastWhile(fn, xf) {
  return new XDropLastWhile(fn, xf);
});

module.exports = _xdropLastWhile;
},{"./_curry2":110,"./_reduce":145,"./_xfBase":159}],157:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XDropRepeatsWith =
/*#__PURE__*/
function () {
  function XDropRepeatsWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.lastValue = undefined;
    this.seenFirstValue = false;
  }

  XDropRepeatsWith.prototype['@@transducer/init'] = _xfBase.init;
  XDropRepeatsWith.prototype['@@transducer/result'] = _xfBase.result;

  XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
    var sameAsLast = false;

    if (!this.seenFirstValue) {
      this.seenFirstValue = true;
    } else if (this.pred(this.lastValue, input)) {
      sameAsLast = true;
    }

    this.lastValue = input;
    return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
  };

  return XDropRepeatsWith;
}();

var _xdropRepeatsWith =
/*#__PURE__*/
_curry2(function _xdropRepeatsWith(pred, xf) {
  return new XDropRepeatsWith(pred, xf);
});

module.exports = _xdropRepeatsWith;
},{"./_curry2":110,"./_xfBase":159}],158:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XDropWhile =
/*#__PURE__*/
function () {
  function XDropWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
  XDropWhile.prototype['@@transducer/result'] = _xfBase.result;

  XDropWhile.prototype['@@transducer/step'] = function (result, input) {
    if (this.f) {
      if (this.f(input)) {
        return result;
      }

      this.f = null;
    }

    return this.xf['@@transducer/step'](result, input);
  };

  return XDropWhile;
}();

var _xdropWhile =
/*#__PURE__*/
_curry2(function _xdropWhile(f, xf) {
  return new XDropWhile(f, xf);
});

module.exports = _xdropWhile;
},{"./_curry2":110,"./_xfBase":159}],159:[function(require,module,exports){
module.exports = {
  init: function () {
    return this.xf['@@transducer/init']();
  },
  result: function (result) {
    return this.xf['@@transducer/result'](result);
  }
};
},{}],160:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XFilter =
/*#__PURE__*/
function () {
  function XFilter(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFilter.prototype['@@transducer/init'] = _xfBase.init;
  XFilter.prototype['@@transducer/result'] = _xfBase.result;

  XFilter.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XFilter;
}();

var _xfilter =
/*#__PURE__*/
_curry2(function _xfilter(f, xf) {
  return new XFilter(f, xf);
});

module.exports = _xfilter;
},{"./_curry2":110,"./_xfBase":159}],161:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XFind =
/*#__PURE__*/
function () {
  function XFind(f, xf) {
    this.xf = xf;
    this.f = f;
    this.found = false;
  }

  XFind.prototype['@@transducer/init'] = _xfBase.init;

  XFind.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, void 0);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFind.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, input));
    }

    return result;
  };

  return XFind;
}();

var _xfind =
/*#__PURE__*/
_curry2(function _xfind(f, xf) {
  return new XFind(f, xf);
});

module.exports = _xfind;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],162:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XFindIndex =
/*#__PURE__*/
function () {
  function XFindIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.found = false;
  }

  XFindIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindIndex.prototype['@@transducer/result'] = function (result) {
    if (!this.found) {
      result = this.xf['@@transducer/step'](result, -1);
    }

    return this.xf['@@transducer/result'](result);
  };

  XFindIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.found = true;
      result = _reduced(this.xf['@@transducer/step'](result, this.idx));
    }

    return result;
  };

  return XFindIndex;
}();

var _xfindIndex =
/*#__PURE__*/
_curry2(function _xfindIndex(f, xf) {
  return new XFindIndex(f, xf);
});

module.exports = _xfindIndex;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],163:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XFindLast =
/*#__PURE__*/
function () {
  function XFindLast(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XFindLast.prototype['@@transducer/init'] = _xfBase.init;

  XFindLast.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
  };

  XFindLast.prototype['@@transducer/step'] = function (result, input) {
    if (this.f(input)) {
      this.last = input;
    }

    return result;
  };

  return XFindLast;
}();

var _xfindLast =
/*#__PURE__*/
_curry2(function _xfindLast(f, xf) {
  return new XFindLast(f, xf);
});

module.exports = _xfindLast;
},{"./_curry2":110,"./_xfBase":159}],164:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XFindLastIndex =
/*#__PURE__*/
function () {
  function XFindLastIndex(f, xf) {
    this.xf = xf;
    this.f = f;
    this.idx = -1;
    this.lastIdx = -1;
  }

  XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;

  XFindLastIndex.prototype['@@transducer/result'] = function (result) {
    return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
  };

  XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
    this.idx += 1;

    if (this.f(input)) {
      this.lastIdx = this.idx;
    }

    return result;
  };

  return XFindLastIndex;
}();

var _xfindLastIndex =
/*#__PURE__*/
_curry2(function _xfindLastIndex(f, xf) {
  return new XFindLastIndex(f, xf);
});

module.exports = _xfindLastIndex;
},{"./_curry2":110,"./_xfBase":159}],165:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XMap =
/*#__PURE__*/
function () {
  function XMap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XMap.prototype['@@transducer/init'] = _xfBase.init;
  XMap.prototype['@@transducer/result'] = _xfBase.result;

  XMap.prototype['@@transducer/step'] = function (result, input) {
    return this.xf['@@transducer/step'](result, this.f(input));
  };

  return XMap;
}();

var _xmap =
/*#__PURE__*/
_curry2(function _xmap(f, xf) {
  return new XMap(f, xf);
});

module.exports = _xmap;
},{"./_curry2":110,"./_xfBase":159}],166:[function(require,module,exports){
var _curryN =
/*#__PURE__*/
require("./_curryN");

var _has =
/*#__PURE__*/
require("./_has");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XReduceBy =
/*#__PURE__*/
function () {
  function XReduceBy(valueFn, valueAcc, keyFn, xf) {
    this.valueFn = valueFn;
    this.valueAcc = valueAcc;
    this.keyFn = keyFn;
    this.xf = xf;
    this.inputs = {};
  }

  XReduceBy.prototype['@@transducer/init'] = _xfBase.init;

  XReduceBy.prototype['@@transducer/result'] = function (result) {
    var key;

    for (key in this.inputs) {
      if (_has(key, this.inputs)) {
        result = this.xf['@@transducer/step'](result, this.inputs[key]);

        if (result['@@transducer/reduced']) {
          result = result['@@transducer/value'];
          break;
        }
      }
    }

    this.inputs = null;
    return this.xf['@@transducer/result'](result);
  };

  XReduceBy.prototype['@@transducer/step'] = function (result, input) {
    var key = this.keyFn(input);
    this.inputs[key] = this.inputs[key] || [key, this.valueAcc];
    this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
    return result;
  };

  return XReduceBy;
}();

var _xreduceBy =
/*#__PURE__*/
_curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
  return new XReduceBy(valueFn, valueAcc, keyFn, xf);
});

module.exports = _xreduceBy;
},{"./_curryN":112,"./_has":121,"./_xfBase":159}],167:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XTake =
/*#__PURE__*/
function () {
  function XTake(n, xf) {
    this.xf = xf;
    this.n = n;
    this.i = 0;
  }

  XTake.prototype['@@transducer/init'] = _xfBase.init;
  XTake.prototype['@@transducer/result'] = _xfBase.result;

  XTake.prototype['@@transducer/step'] = function (result, input) {
    this.i += 1;
    var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
    return this.n >= 0 && this.i >= this.n ? _reduced(ret) : ret;
  };

  return XTake;
}();

var _xtake =
/*#__PURE__*/
_curry2(function _xtake(n, xf) {
  return new XTake(n, xf);
});

module.exports = _xtake;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],168:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _reduced =
/*#__PURE__*/
require("./_reduced");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XTakeWhile =
/*#__PURE__*/
function () {
  function XTakeWhile(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
  XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;

  XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
    return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
  };

  return XTakeWhile;
}();

var _xtakeWhile =
/*#__PURE__*/
_curry2(function _xtakeWhile(f, xf) {
  return new XTakeWhile(f, xf);
});

module.exports = _xtakeWhile;
},{"./_curry2":110,"./_reduced":146,"./_xfBase":159}],169:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./_curry2");

var _xfBase =
/*#__PURE__*/
require("./_xfBase");

var XTap =
/*#__PURE__*/
function () {
  function XTap(f, xf) {
    this.xf = xf;
    this.f = f;
  }

  XTap.prototype['@@transducer/init'] = _xfBase.init;
  XTap.prototype['@@transducer/result'] = _xfBase.result;

  XTap.prototype['@@transducer/step'] = function (result, input) {
    this.f(input);
    return this.xf['@@transducer/step'](result, input);
  };

  return XTap;
}();

var _xtap =
/*#__PURE__*/
_curry2(function _xtap(f, xf) {
  return new XTap(f, xf);
});

module.exports = _xtap;
},{"./_curry2":110,"./_xfBase":159}],170:[function(require,module,exports){
var XWrap =
/*#__PURE__*/
function () {
  function XWrap(fn) {
    this.f = fn;
  }

  XWrap.prototype['@@transducer/init'] = function () {
    throw new Error('init not implemented on XWrap');
  };

  XWrap.prototype['@@transducer/result'] = function (acc) {
    return acc;
  };

  XWrap.prototype['@@transducer/step'] = function (acc, x) {
    return this.f(acc, x);
  };

  return XWrap;
}();

function _xwrap(fn) {
  return new XWrap(fn);
}

module.exports = _xwrap;
},{}],171:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./internal/_includes");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _filter =
/*#__PURE__*/
require("./internal/_filter");

var flip =
/*#__PURE__*/
require("./flip");

var uniq =
/*#__PURE__*/
require("./uniq");
/**
 * Combines two lists into a set (i.e. no duplicates) composed of those
 * elements common to both lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The list of elements found in both `list1` and `list2`.
 * @see R.innerJoin
 * @example
 *
 *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
 */


var intersection =
/*#__PURE__*/
_curry2(function intersection(list1, list2) {
  var lookupList, filteredList;

  if (list1.length > list2.length) {
    lookupList = list1;
    filteredList = list2;
  } else {
    lookupList = list2;
    filteredList = list1;
  }

  return uniq(_filter(flip(_includes)(lookupList), filteredList));
});

module.exports = intersection;
},{"./flip":74,"./internal/_curry2":110,"./internal/_filter":117,"./internal/_includes":123,"./uniq":314}],172:[function(require,module,exports){
var _checkForMethod =
/*#__PURE__*/
require("./internal/_checkForMethod");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a new list with the separator interposed between elements.
 *
 * Dispatches to the `intersperse` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} separator The element to add to the list.
 * @param {Array} list The list to be interposed.
 * @return {Array} The new list.
 * @example
 *
 *      R.intersperse('a', ['b', 'n', 'n', 's']); //=> ['b', 'a', 'n', 'a', 'n', 'a', 's']
 */


var intersperse =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_checkForMethod('intersperse', function intersperse(separator, list) {
  var out = [];
  var idx = 0;
  var length = list.length;

  while (idx < length) {
    if (idx === length - 1) {
      out.push(list[idx]);
    } else {
      out.push(list[idx], separator);
    }

    idx += 1;
  }

  return out;
}));

module.exports = intersperse;
},{"./internal/_checkForMethod":103,"./internal/_curry2":110}],173:[function(require,module,exports){
var _clone =
/*#__PURE__*/
require("./internal/_clone");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _isTransformer =
/*#__PURE__*/
require("./internal/_isTransformer");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _stepCat =
/*#__PURE__*/
require("./internal/_stepCat");
/**
 * Transforms the items of the list with the transducer and appends the
 * transformed items to the accumulator using an appropriate iterator function
 * based on the accumulator type.
 *
 * The accumulator can be an array, string, object or a transformer. Iterated
 * items will be appended to arrays and concatenated to strings. Objects will
 * be merged directly or 2-item arrays will be merged as key, value pairs.
 *
 * The accumulator can also be a transformer object that provides a 2-arity
 * reducing iterator function, step, 0-arity initial value function, init, and
 * 1-arity result extraction function result. The step function is used as the
 * iterator function in reduce. The result function is used to convert the
 * final accumulator into the return type and in most cases is R.identity. The
 * init function is used to provide the initial accumulator.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the
 * transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig a -> (b -> b) -> [c] -> a
 * @param {*} acc The initial accumulator value.
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.transduce
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *
 *      R.into([], transducer, numbers); //=> [2, 3]
 *
 *      const intoArray = R.into([]);
 *      intoArray(transducer, numbers); //=> [2, 3]
 */


var into =
/*#__PURE__*/
_curry3(function into(acc, xf, list) {
  return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
});

module.exports = into;
},{"./internal/_clone":104,"./internal/_curry3":111,"./internal/_isTransformer":136,"./internal/_reduce":145,"./internal/_stepCat":147}],174:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _has =
/*#__PURE__*/
require("./internal/_has");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Same as [`R.invertObj`](#invertObj), however this accounts for objects with
 * duplicate values by putting the values into an array.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: [ s, ... ]}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object with keys in an array.
 * @see R.invertObj
 * @example
 *
 *      const raceResultsByFirstName = {
 *        first: 'alice',
 *        second: 'jake',
 *        third: 'alice',
 *      };
 *      R.invert(raceResultsByFirstName);
 *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
 */


var invert =
/*#__PURE__*/
_curry1(function invert(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    var val = obj[key];
    var list = _has(val, out) ? out[val] : out[val] = [];
    list[list.length] = key;
    idx += 1;
  }

  return out;
});

module.exports = invert;
},{"./internal/_curry1":109,"./internal/_has":121,"./keys":182}],175:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Returns a new object with the keys of the given object as values, and the
 * values of the given object, which are coerced to strings, as keys. Note
 * that the last key found is preferred when handling the same value.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig {s: x} -> {x: s}
 * @param {Object} obj The object or array to invert
 * @return {Object} out A new object
 * @see R.invert
 * @example
 *
 *      const raceResults = {
 *        first: 'alice',
 *        second: 'jake'
 *      };
 *      R.invertObj(raceResults);
 *      //=> { 'alice': 'first', 'jake':'second' }
 *
 *      // Alternatively:
 *      const raceResults = ['alice', 'jake'];
 *      R.invertObj(raceResults);
 *      //=> { 'alice': '0', 'jake':'1' }
 */


var invertObj =
/*#__PURE__*/
_curry1(function invertObj(obj) {
  var props = keys(obj);
  var len = props.length;
  var idx = 0;
  var out = {};

  while (idx < len) {
    var key = props[idx];
    out[obj[key]] = key;
    idx += 1;
  }

  return out;
});

module.exports = invertObj;
},{"./internal/_curry1":109,"./keys":182}],176:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isFunction =
/*#__PURE__*/
require("./internal/_isFunction");

var curryN =
/*#__PURE__*/
require("./curryN");

var toString =
/*#__PURE__*/
require("./toString");
/**
 * Turns a named method with a specified arity into a function that can be
 * called directly supplied with arguments and a target object.
 *
 * The returned function is curried and accepts `arity + 1` parameters where
 * the final parameter is the target object.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
 * @param {Number} arity Number of arguments the returned function should take
 *        before the target object.
 * @param {String} method Name of any of the target object's methods to call.
 * @return {Function} A new curried function.
 * @see R.construct
 * @example
 *
 *      const sliceFrom = R.invoker(1, 'slice');
 *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
 *      const sliceFrom6 = R.invoker(2, 'slice')(6);
 *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
 *
 *      const dog = {
 *        speak: async () => 'Woof!'
 *      };
 *      const speak = R.invoker(0, 'speak');
 *      speak(dog).then(console.log) //~> 'Woof!'
 *
 * @symb R.invoker(0, 'method')(o) = o['method']()
 * @symb R.invoker(1, 'method')(a, o) = o['method'](a)
 * @symb R.invoker(2, 'method')(a, b, o) = o['method'](a, b)
 */


var invoker =
/*#__PURE__*/
_curry2(function invoker(arity, method) {
  return curryN(arity + 1, function () {
    var target = arguments[arity];

    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }

    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
  });
});

module.exports = invoker;
},{"./curryN":46,"./internal/_curry2":110,"./internal/_isFunction":129,"./toString":300}],177:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * See if an object (`val`) is an instance of the supplied constructor. This
 * function will check up the inheritance chain, if any.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Type
 * @sig (* -> {*}) -> a -> Boolean
 * @param {Object} ctor A constructor
 * @param {*} val The value to test
 * @return {Boolean}
 * @example
 *
 *      R.is(Object, {}); //=> true
 *      R.is(Number, 1); //=> true
 *      R.is(Object, 1); //=> false
 *      R.is(String, 's'); //=> true
 *      R.is(String, new String('')); //=> true
 *      R.is(Object, new String('')); //=> true
 *      R.is(Object, 's'); //=> false
 *      R.is(Number, {}); //=> false
 */


var is =
/*#__PURE__*/
_curry2(function is(Ctor, val) {
  return val != null && val.constructor === Ctor || val instanceof Ctor;
});

module.exports = is;
},{"./internal/_curry2":110}],178:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var empty =
/*#__PURE__*/
require("./empty");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Returns `true` if the given value is its type's empty value; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> Boolean
 * @param {*} x
 * @return {Boolean}
 * @see R.empty
 * @example
 *
 *      R.isEmpty([1, 2, 3]);   //=> false
 *      R.isEmpty([]);          //=> true
 *      R.isEmpty('');          //=> true
 *      R.isEmpty(null);        //=> false
 *      R.isEmpty({});          //=> true
 *      R.isEmpty({length: 0}); //=> false
 */


var isEmpty =
/*#__PURE__*/
_curry1(function isEmpty(x) {
  return x != null && equals(x, empty(x));
});

module.exports = isEmpty;
},{"./empty":62,"./equals":66,"./internal/_curry1":109}],179:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */


var isNil =
/*#__PURE__*/
_curry1(function isNil(x) {
  return x == null;
});

module.exports = isNil;
},{"./internal/_curry1":109}],180:[function(require,module,exports){
var invoker =
/*#__PURE__*/
require("./invoker");
/**
 * Returns a string made by inserting the `separator` between each element and
 * concatenating all the elements into a single string.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig String -> [a] -> String
 * @param {Number|String} separator The string used to separate the elements.
 * @param {Array} xs The elements to join into a string.
 * @return {String} str The string made by concatenating `xs` with `separator`.
 * @see R.split
 * @example
 *
 *      const spacer = R.join(' ');
 *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
 *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
 */


var join =
/*#__PURE__*/
invoker(1, 'join');
module.exports = join;
},{"./invoker":176}],181:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var converge =
/*#__PURE__*/
require("./converge");
/**
 * juxt applies a list of functions to a list of values.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Function
 * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
 * @param {Array} fns An array of functions
 * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
 * @see R.applySpec
 * @example
 *
 *      const getRange = R.juxt([Math.min, Math.max]);
 *      getRange(3, 4, 9, -3); //=> [-3, 9]
 * @symb R.juxt([f, g, h])(a, b) = [f(a, b), g(a, b), h(a, b)]
 */


var juxt =
/*#__PURE__*/
_curry1(function juxt(fns) {
  return converge(function () {
    return Array.prototype.slice.call(arguments, 0);
  }, fns);
});

module.exports = juxt;
},{"./converge":43,"./internal/_curry1":109}],182:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _has =
/*#__PURE__*/
require("./internal/_has");

var _isArguments =
/*#__PURE__*/
require("./internal/_isArguments"); // cover IE < 9 keys issues


var hasEnumBug = !
/*#__PURE__*/
{
  toString: null
}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

var hasArgsEnumBug =
/*#__PURE__*/
function () {
  'use strict';

  return arguments.propertyIsEnumerable('length');
}();

var contains = function contains(list, item) {
  var idx = 0;

  while (idx < list.length) {
    if (list[idx] === item) {
      return true;
    }

    idx += 1;
  }

  return false;
};
/**
 * Returns a list containing the names of all the enumerable own properties of
 * the supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own properties.
 * @see R.keysIn, R.values
 * @example
 *
 *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
 */


var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
/*#__PURE__*/
_curry1(function keys(obj) {
  return Object(obj) !== obj ? [] : Object.keys(obj);
}) :
/*#__PURE__*/
_curry1(function keys(obj) {
  if (Object(obj) !== obj) {
    return [];
  }

  var prop, nIdx;
  var ks = [];

  var checkArgsLength = hasArgsEnumBug && _isArguments(obj);

  for (prop in obj) {
    if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
      ks[ks.length] = prop;
    }
  }

  if (hasEnumBug) {
    nIdx = nonEnumerableProps.length - 1;

    while (nIdx >= 0) {
      prop = nonEnumerableProps[nIdx];

      if (_has(prop, obj) && !contains(ks, prop)) {
        ks[ks.length] = prop;
      }

      nIdx -= 1;
    }
  }

  return ks;
});
module.exports = keys;
},{"./internal/_curry1":109,"./internal/_has":121,"./internal/_isArguments":126}],183:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Returns a list containing the names of all the properties of the supplied
 * object, including prototype properties.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [k]
 * @param {Object} obj The object to extract properties from
 * @return {Array} An array of the object's own and prototype properties.
 * @see R.keys, R.valuesIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.keysIn(f); //=> ['x', 'y']
 */


var keysIn =
/*#__PURE__*/
_curry1(function keysIn(obj) {
  var prop;
  var ks = [];

  for (prop in obj) {
    ks[ks.length] = prop;
  }

  return ks;
});

module.exports = keysIn;
},{"./internal/_curry1":109}],184:[function(require,module,exports){
var nth =
/*#__PURE__*/
require("./nth");
/**
 * Returns the last element of the given list or string.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig [a] -> a | Undefined
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.init, R.head, R.tail
 * @example
 *
 *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
 *      R.last([]); //=> undefined
 *
 *      R.last('abc'); //=> 'c'
 *      R.last(''); //=> ''
 */


var last =
/*#__PURE__*/
nth(-1);
module.exports = last;
},{"./nth":225}],185:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Returns the position of the last occurrence of an item in an array, or -1 if
 * the item is not included in the array. [`R.equals`](#equals) is used to
 * determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> Number
 * @param {*} target The item to find.
 * @param {Array} xs The array to search in.
 * @return {Number} the index of the target, or -1 if the target is not found.
 * @see R.indexOf
 * @example
 *
 *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
 *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
 */


var lastIndexOf =
/*#__PURE__*/
_curry2(function lastIndexOf(target, xs) {
  if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
    return xs.lastIndexOf(target);
  } else {
    var idx = xs.length - 1;

    while (idx >= 0) {
      if (equals(xs[idx], target)) {
        return idx;
      }

      idx -= 1;
    }

    return -1;
  }
});

module.exports = lastIndexOf;
},{"./equals":66,"./internal/_curry2":110,"./internal/_isArray":127}],186:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _isNumber =
/*#__PURE__*/
require("./internal/_isNumber");
/**
 * Returns the number of elements in the array by returning `list.length`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [a] -> Number
 * @param {Array} list The array to inspect.
 * @return {Number} The length of the array.
 * @example
 *
 *      R.length([]); //=> 0
 *      R.length([1, 2, 3]); //=> 3
 */


var length =
/*#__PURE__*/
_curry1(function length(list) {
  return list != null && _isNumber(list.length) ? list.length : NaN;
});

module.exports = length;
},{"./internal/_curry1":109,"./internal/_isNumber":131}],187:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var map =
/*#__PURE__*/
require("./map");
/**
 * Returns a lens for the given getter and setter functions. The getter "gets"
 * the value of the focus; the setter "sets" the value of the focus. The setter
 * should not mutate the data structure.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
 * @param {Function} getter
 * @param {Function} setter
 * @return {Lens}
 * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
 * @example
 *
 *      const xLens = R.lens(R.prop('x'), R.assoc('x'));
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */


var lens =
/*#__PURE__*/
_curry2(function lens(getter, setter) {
  return function (toFunctorFn) {
    return function (target) {
      return map(function (focus) {
        return setter(focus, target);
      }, toFunctorFn(getter(target)));
    };
  };
});

module.exports = lens;
},{"./internal/_curry2":110,"./map":195}],188:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var lens =
/*#__PURE__*/
require("./lens");

var nth =
/*#__PURE__*/
require("./nth");

var update =
/*#__PURE__*/
require("./update");
/**
 * Returns a lens whose focus is the specified index.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Number -> Lens s a
 * @param {Number} n
 * @return {Lens}
 * @see R.view, R.set, R.over, R.nth
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
 *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
 *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
 */


var lensIndex =
/*#__PURE__*/
_curry1(function lensIndex(n) {
  return lens(nth(n), update(n));
});

module.exports = lensIndex;
},{"./internal/_curry1":109,"./lens":187,"./nth":225,"./update":320}],189:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var assocPath =
/*#__PURE__*/
require("./assocPath");

var lens =
/*#__PURE__*/
require("./lens");

var path =
/*#__PURE__*/
require("./path");
/**
 * Returns a lens whose focus is the specified path.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @typedefn Idx = String | Int
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig [Idx] -> Lens s a
 * @param {Array} path The path to use.
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xHeadYLens = R.lensPath(['x', 0, 'y']);
 *
 *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> 2
 *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
 *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
 *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
 */


var lensPath =
/*#__PURE__*/
_curry1(function lensPath(p) {
  return lens(path(p), assocPath(p));
});

module.exports = lensPath;
},{"./assocPath":24,"./internal/_curry1":109,"./lens":187,"./path":239}],190:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var assoc =
/*#__PURE__*/
require("./assoc");

var lens =
/*#__PURE__*/
require("./lens");

var prop =
/*#__PURE__*/
require("./prop");
/**
 * Returns a lens whose focus is the specified property.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig String -> Lens s a
 * @param {String} k
 * @return {Lens}
 * @see R.view, R.set, R.over
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});            //=> 1
 *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
 *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
 */


var lensProp =
/*#__PURE__*/
_curry1(function lensProp(k) {
  return lens(prop(k), assoc(k));
});

module.exports = lensProp;
},{"./assoc":23,"./internal/_curry1":109,"./lens":187,"./prop":255}],191:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var liftN =
/*#__PURE__*/
require("./liftN");
/**
 * "lifts" a function of arity > 1 so that it may "map over" a list, Function or other
 * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.liftN
 * @example
 *
 *      const madd3 = R.lift((a, b, c) => a + b + c);
 *
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 *
 *      const madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);
 *
 *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
 */


var lift =
/*#__PURE__*/
_curry1(function lift(fn) {
  return liftN(fn.length, fn);
});

module.exports = lift;
},{"./internal/_curry1":109,"./liftN":192}],192:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var ap =
/*#__PURE__*/
require("./ap");

var curryN =
/*#__PURE__*/
require("./curryN");

var map =
/*#__PURE__*/
require("./map");
/**
 * "lifts" a function to be the specified arity, so that it may "map over" that
 * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Function
 * @sig Number -> (*... -> *) -> ([*]... -> [*])
 * @param {Function} fn The function to lift into higher context
 * @return {Function} The lifted function.
 * @see R.lift, R.ap
 * @example
 *
 *      const madd3 = R.liftN(3, (...args) => R.sum(args));
 *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
 */


var liftN =
/*#__PURE__*/
_curry2(function liftN(arity, fn) {
  var lifted = curryN(arity, fn);
  return curryN(arity, function () {
    return _reduce(ap, map(lifted, arguments[0]), Array.prototype.slice.call(arguments, 1));
  });
});

module.exports = liftN;
},{"./ap":16,"./curryN":46,"./internal/_curry2":110,"./internal/_reduce":145,"./map":195}],193:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the first argument is less than the second; `false`
 * otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {*} a
 * @param {*} b
 * @return {Boolean}
 * @see R.gt
 * @example
 *
 *      R.lt(2, 1); //=> false
 *      R.lt(2, 2); //=> false
 *      R.lt(2, 3); //=> true
 *      R.lt('a', 'z'); //=> true
 *      R.lt('z', 'a'); //=> false
 */


var lt =
/*#__PURE__*/
_curry2(function lt(a, b) {
  return a < b;
});

module.exports = lt;
},{"./internal/_curry2":110}],194:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if the first argument is less than or equal to the second;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> Boolean
 * @param {Number} a
 * @param {Number} b
 * @return {Boolean}
 * @see R.gte
 * @example
 *
 *      R.lte(2, 1); //=> false
 *      R.lte(2, 2); //=> true
 *      R.lte(2, 3); //=> true
 *      R.lte('a', 'z'); //=> true
 *      R.lte('z', 'a'); //=> false
 */


var lte =
/*#__PURE__*/
_curry2(function lte(a, b) {
  return a <= b;
});

module.exports = lte;
},{"./internal/_curry2":110}],195:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _map =
/*#__PURE__*/
require("./internal/_map");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _xmap =
/*#__PURE__*/
require("./internal/_xmap");

var curryN =
/*#__PURE__*/
require("./curryN");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Takes a function and
 * a [functor](https://github.com/fantasyland/fantasy-land#functor),
 * applies the function to each of the functor's values, and returns
 * a functor of the same shape.
 *
 * Ramda provides suitable `map` implementations for `Array` and `Object`,
 * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
 *
 * Dispatches to the `map` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * Also treats functions as functors and will compose them together.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => (a -> b) -> f a -> f b
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {Array} list The list to be iterated over.
 * @return {Array} The new list.
 * @see R.transduce, R.addIndex
 * @example
 *
 *      const double = x => x * 2;
 *
 *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
 *
 *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
 * @symb R.map(f, [a, b]) = [f(a), f(b)]
 * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
 * @symb R.map(f, functor_o) = functor_o.map(f)
 */


var map =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
  switch (Object.prototype.toString.call(functor)) {
    case '[object Function]':
      return curryN(functor.length, function () {
        return fn.call(this, functor.apply(this, arguments));
      });

    case '[object Object]':
      return _reduce(function (acc, key) {
        acc[key] = fn(functor[key]);
        return acc;
      }, {}, keys(functor));

    default:
      return _map(fn, functor);
  }
}));

module.exports = map;
},{"./curryN":46,"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_map":138,"./internal/_reduce":145,"./internal/_xmap":165,"./keys":182}],196:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * The `mapAccum` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from left to right, and returning a final value of this
 * accumulator together with the new list.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.scan, R.addIndex, R.mapAccumRight
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [a + b, a + b];
 *
 *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
 * @symb R.mapAccum(f, a, [b, c, d]) = [
 *   f(f(f(a, b)[0], c)[0], d)[0],
 *   [
 *     f(a, b)[1],
 *     f(f(a, b)[0], c)[1],
 *     f(f(f(a, b)[0], c)[0], d)[1]
 *   ]
 * ]
 */


var mapAccum =
/*#__PURE__*/
_curry3(function mapAccum(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var tuple = [acc];

  while (idx < len) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx += 1;
  }

  return [tuple[0], result];
});

module.exports = mapAccum;
},{"./internal/_curry3":111}],197:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * The `mapAccumRight` function behaves like a combination of map and reduce; it
 * applies a function to each element of a list, passing an accumulating
 * parameter from right to left, and returning a final value of this
 * accumulator together with the new list.
 *
 * Similar to [`mapAccum`](#mapAccum), except moves through the input list from
 * the right to the left.
 *
 * The iterator function receives two arguments, *acc* and *value*, and should
 * return a tuple *[acc, value]*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((acc, x) -> (acc, y)) -> acc -> [x] -> (acc, [y])
 * @param {Function} fn The function to be called on every element of the input `list`.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.addIndex, R.mapAccum
 * @example
 *
 *      const digits = ['1', '2', '3', '4'];
 *      const appender = (a, b) => [b + a, b + a];
 *
 *      R.mapAccumRight(appender, 5, digits); //=> ['12345', ['12345', '2345', '345', '45']]
 * @symb R.mapAccumRight(f, a, [b, c, d]) = [
 *   f(f(f(a, d)[0], c)[0], b)[0],
 *   [
 *     f(a, d)[1],
 *     f(f(a, d)[0], c)[1],
 *     f(f(f(a, d)[0], c)[0], b)[1]
 *   ]
 * ]
 */


var mapAccumRight =
/*#__PURE__*/
_curry3(function mapAccumRight(fn, acc, list) {
  var idx = list.length - 1;
  var result = [];
  var tuple = [acc];

  while (idx >= 0) {
    tuple = fn(tuple[0], list[idx]);
    result[idx] = tuple[1];
    idx -= 1;
  }

  return [tuple[0], result];
});

module.exports = mapAccumRight;
},{"./internal/_curry3":111}],198:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * An Object-specific version of [`map`](#map). The function is applied to three
 * arguments: *(value, key, obj)*. If only the value is significant, use
 * [`map`](#map) instead.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Object
 * @sig ((*, String, Object) -> *) -> Object -> Object
 * @param {Function} fn
 * @param {Object} obj
 * @return {Object}
 * @see R.map
 * @example
 *
 *      const xyz = { x: 1, y: 2, z: 3 };
 *      const prependKeyAndDouble = (num, key, obj) => key + (num * 2);
 *
 *      R.mapObjIndexed(prependKeyAndDouble, xyz); //=> { x: 'x2', y: 'y4', z: 'z6' }
 */


var mapObjIndexed =
/*#__PURE__*/
_curry2(function mapObjIndexed(fn, obj) {
  return _reduce(function (acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, keys(obj));
});

module.exports = mapObjIndexed;
},{"./internal/_curry2":110,"./internal/_reduce":145,"./keys":182}],199:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Tests a regular expression against a String. Note that this function will
 * return an empty array when there are no matches. This differs from
 * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
 * which returns `null` when there are no matches.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig RegExp -> String -> [String | Undefined]
 * @param {RegExp} rx A regular expression.
 * @param {String} str The string to match against
 * @return {Array} The list of matches or empty array.
 * @see R.test
 * @example
 *
 *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
 *      R.match(/a/, 'b'); //=> []
 *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
 */


var match =
/*#__PURE__*/
_curry2(function match(rx, str) {
  return str.match(rx) || [];
});

module.exports = match;
},{"./internal/_curry2":110}],200:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isInteger =
/*#__PURE__*/
require("./internal/_isInteger");
/**
 * `mathMod` behaves like the modulo operator should mathematically, unlike the
 * `%` operator (and by extension, [`R.modulo`](#modulo)). So while
 * `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer
 * arguments, and returns NaN when the modulus is zero or negative.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} m The dividend.
 * @param {Number} p the modulus.
 * @return {Number} The result of `b mod a`.
 * @see R.modulo
 * @example
 *
 *      R.mathMod(-17, 5);  //=> 3
 *      R.mathMod(17, 5);   //=> 2
 *      R.mathMod(17, -5);  //=> NaN
 *      R.mathMod(17, 0);   //=> NaN
 *      R.mathMod(17.2, 5); //=> NaN
 *      R.mathMod(17, 5.3); //=> NaN
 *
 *      const clock = R.mathMod(R.__, 12);
 *      clock(15); //=> 3
 *      clock(24); //=> 0
 *
 *      const seventeenMod = R.mathMod(17);
 *      seventeenMod(3);  //=> 2
 *      seventeenMod(4);  //=> 1
 *      seventeenMod(10); //=> 7
 */


var mathMod =
/*#__PURE__*/
_curry2(function mathMod(m, p) {
  if (!_isInteger(m)) {
    return NaN;
  }

  if (!_isInteger(p) || p < 1) {
    return NaN;
  }

  return (m % p + p) % p;
});

module.exports = mathMod;
},{"./internal/_curry2":110,"./internal/_isInteger":130}],201:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns the larger of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.maxBy, R.min
 * @example
 *
 *      R.max(789, 123); //=> 789
 *      R.max('a', 'b'); //=> 'b'
 */


var max =
/*#__PURE__*/
_curry2(function max(a, b) {
  return b > a ? b : a;
});

module.exports = max;
},{"./internal/_curry2":110}],202:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Takes a function and two values, and returns whichever value produces the
 * larger result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.max, R.minBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.maxBy(square, -3, 2); //=> -3
 *
 *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
 *      R.reduce(R.maxBy(square), 0, []); //=> 0
 */


var maxBy =
/*#__PURE__*/
_curry3(function maxBy(f, a, b) {
  return f(b) > f(a) ? b : a;
});

module.exports = maxBy;
},{"./internal/_curry3":111}],203:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var sum =
/*#__PURE__*/
require("./sum");
/**
 * Returns the mean of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.median
 * @example
 *
 *      R.mean([2, 7, 9]); //=> 6
 *      R.mean([]); //=> NaN
 */


var mean =
/*#__PURE__*/
_curry1(function mean(list) {
  return sum(list) / list.length;
});

module.exports = mean;
},{"./internal/_curry1":109,"./sum":285}],204:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var mean =
/*#__PURE__*/
require("./mean");
/**
 * Returns the median of the given list of numbers.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list
 * @return {Number}
 * @see R.mean
 * @example
 *
 *      R.median([2, 9, 7]); //=> 7
 *      R.median([7, 2, 10, 9]); //=> 8
 *      R.median([]); //=> NaN
 */


var median =
/*#__PURE__*/
_curry1(function median(list) {
  var len = list.length;

  if (len === 0) {
    return NaN;
  }

  var width = 2 - len % 2;
  var idx = (len - width) / 2;
  return mean(Array.prototype.slice.call(list, 0).sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }).slice(idx, idx + width));
});

module.exports = median;
},{"./internal/_curry1":109,"./mean":203}],205:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _has =
/*#__PURE__*/
require("./internal/_has");
/**
 * Creates a new function that, when invoked, caches the result of calling `fn`
 * for a given argument set and returns the result. Subsequent calls to the
 * memoized `fn` with the same argument set will not result in an additional
 * call to `fn`; instead, the cached result for that set of arguments will be
 * returned.
 *
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (*... -> String) -> (*... -> a) -> (*... -> a)
 * @param {Function} fn The function to generate the cache key.
 * @param {Function} fn The function to memoize.
 * @return {Function} Memoized version of `fn`.
 * @example
 *
 *      let count = 0;
 *      const factorial = R.memoizeWith(R.identity, n => {
 *        count += 1;
 *        return R.product(R.range(1, n + 1));
 *      });
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      factorial(5); //=> 120
 *      count; //=> 1
 */


var memoizeWith =
/*#__PURE__*/
_curry2(function memoizeWith(mFn, fn) {
  var cache = {};
  return _arity(fn.length, function () {
    var key = mFn.apply(this, arguments);

    if (!_has(key, cache)) {
      cache[key] = fn.apply(this, arguments);
    }

    return cache[key];
  });
});

module.exports = memoizeWith;
},{"./internal/_arity":100,"./internal/_curry2":110,"./internal/_has":121}],206:[function(require,module,exports){
var _objectAssign =
/*#__PURE__*/
require("./internal/_objectAssign");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeRight, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
 * @deprecated since v0.26.0
 * @example
 *
 *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const withDefaults = R.merge({x: 0, y: 0});
 *      withDefaults({y: 2}); //=> {x: 0, y: 2}
 * @symb R.merge(a, b) = {...a, ...b}
 */


var merge =
/*#__PURE__*/
_curry2(function merge(l, r) {
  return _objectAssign({}, l, r);
});

module.exports = merge;
},{"./internal/_curry2":110,"./internal/_objectAssign":139}],207:[function(require,module,exports){
var _objectAssign =
/*#__PURE__*/
require("./internal/_objectAssign");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Merges a list of objects together into one object.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig [{k: v}] -> {k: v}
 * @param {Array} list An array of objects
 * @return {Object} A merged object.
 * @see R.reduce
 * @example
 *
 *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
 *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
 * @symb R.mergeAll([{ x: 1 }, { y: 2 }, { z: 3 }]) = { x: 1, y: 2, z: 3 }
 */


var mergeAll =
/*#__PURE__*/
_curry1(function mergeAll(list) {
  return _objectAssign.apply(null, [{}].concat(list));
});

module.exports = mergeAll;
},{"./internal/_curry1":109,"./internal/_objectAssign":139}],208:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var mergeDeepWithKey =
/*#__PURE__*/
require("./mergeDeepWithKey");
/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepRight, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                      { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}
 */


var mergeDeepLeft =
/*#__PURE__*/
_curry2(function mergeDeepLeft(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return lVal;
  }, lObj, rObj);
});

module.exports = mergeDeepLeft;
},{"./internal/_curry2":110,"./mergeDeepWithKey":211}],209:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var mergeDeepWithKey =
/*#__PURE__*/
require("./mergeDeepWithKey");
/**
 * Creates a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects:
 * - and both values are objects, the two values will be recursively merged
 * - otherwise the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig {a} -> {a} -> {a}
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.merge, R.mergeDeepLeft, R.mergeDeepWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},
 *                       { age: 40, contact: { email: 'baa@example.com' }});
 *      //=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}
 */


var mergeDeepRight =
/*#__PURE__*/
_curry2(function mergeDeepRight(lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return rVal;
  }, lObj, rObj);
});

module.exports = mergeDeepRight;
},{"./internal/_curry2":110,"./mergeDeepWithKey":211}],210:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var mergeDeepWithKey =
/*#__PURE__*/
require("./mergeDeepWithKey");
/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to associated values using the
 *   resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWith, R.mergeDeepWithKey
 * @example
 *
 *      R.mergeDeepWith(R.concat,
 *                      { a: true, c: { values: [10, 20] }},
 *                      { b: true, c: { values: [15, 35] }});
 *      //=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}
 */


var mergeDeepWith =
/*#__PURE__*/
_curry3(function mergeDeepWith(fn, lObj, rObj) {
  return mergeDeepWithKey(function (k, lVal, rVal) {
    return fn(lVal, rVal);
  }, lObj, rObj);
});

module.exports = mergeDeepWith;
},{"./internal/_curry3":111,"./mergeDeepWithKey":211}],211:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _isObject =
/*#__PURE__*/
require("./internal/_isObject");

var mergeWithKey =
/*#__PURE__*/
require("./mergeWithKey");
/**
 * Creates a new object with the own properties of the two provided objects.
 * If a key exists in both objects:
 * - and both associated values are also objects then the values will be
 *   recursively merged.
 * - otherwise the provided function is applied to the key and associated values
 *   using the resulting value as the new value associated with the key.
 * If a key only exists in one object, the value will be associated with the key
 * of the resulting object.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} lObj
 * @param {Object} rObj
 * @return {Object}
 * @see R.mergeWithKey, R.mergeDeepWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeDeepWithKey(concatValues,
 *                         { a: true, c: { thing: 'foo', values: [10, 20] }},
 *                         { b: true, c: { thing: 'bar', values: [15, 35] }});
 *      //=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}
 */


var mergeDeepWithKey =
/*#__PURE__*/
_curry3(function mergeDeepWithKey(fn, lObj, rObj) {
  return mergeWithKey(function (k, lVal, rVal) {
    if (_isObject(lVal) && _isObject(rVal)) {
      return mergeDeepWithKey(fn, lVal, rVal);
    } else {
      return fn(k, lVal, rVal);
    }
  }, lObj, rObj);
});

module.exports = mergeDeepWithKey;
},{"./internal/_curry3":111,"./internal/_isObject":132,"./mergeWithKey":215}],212:[function(require,module,exports){
var _objectAssign =
/*#__PURE__*/
require("./internal/_objectAssign");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the first object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeRight, R.mergeDeepLeft, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeLeft({ 'age': 40 }, { 'name': 'fred', 'age': 10 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const resetToDefault = R.mergeLeft({x: 0});
 *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeLeft(a, b) = {...b, ...a}
 */


var mergeLeft =
/*#__PURE__*/
_curry2(function mergeLeft(l, r) {
  return _objectAssign({}, r, l);
});

module.exports = mergeLeft;
},{"./internal/_curry2":110,"./internal/_objectAssign":139}],213:[function(require,module,exports){
var _objectAssign =
/*#__PURE__*/
require("./internal/_objectAssign");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Create a new object with the own properties of the first object merged with
 * the own properties of the second object. If a key exists in both objects,
 * the value from the second object will be used.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Object
 * @sig {k: v} -> {k: v} -> {k: v}
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeLeft, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
 * @example
 *
 *      R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
 *      //=> { 'name': 'fred', 'age': 40 }
 *
 *      const withDefaults = R.mergeRight({x: 0, y: 0});
 *      withDefaults({y: 2}); //=> {x: 0, y: 2}
 * @symb R.mergeRight(a, b) = {...a, ...b}
 */


var mergeRight =
/*#__PURE__*/
_curry2(function mergeRight(l, r) {
  return _objectAssign({}, l, r);
});

module.exports = mergeRight;
},{"./internal/_curry2":110,"./internal/_objectAssign":139}],214:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var mergeWithKey =
/*#__PURE__*/
require("./mergeWithKey");
/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the values
 * associated with the key in each object, with the result being used as the
 * value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWith, R.merge, R.mergeWithKey
 * @example
 *
 *      R.mergeWith(R.concat,
 *                  { a: true, values: [10, 20] },
 *                  { b: true, values: [15, 35] });
 *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
 */


var mergeWith =
/*#__PURE__*/
_curry3(function mergeWith(fn, l, r) {
  return mergeWithKey(function (_, _l, _r) {
    return fn(_l, _r);
  }, l, r);
});

module.exports = mergeWith;
},{"./internal/_curry3":111,"./mergeWithKey":215}],215:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _has =
/*#__PURE__*/
require("./internal/_has");
/**
 * Creates a new object with the own properties of the two provided objects. If
 * a key exists in both objects, the provided function is applied to the key
 * and the values associated with the key in each object, with the result being
 * used as the value associated with the key in the returned object.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Object
 * @sig ((String, a, a) -> a) -> {a} -> {a} -> {a}
 * @param {Function} fn
 * @param {Object} l
 * @param {Object} r
 * @return {Object}
 * @see R.mergeDeepWithKey, R.merge, R.mergeWith
 * @example
 *
 *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
 *      R.mergeWithKey(concatValues,
 *                     { a: true, thing: 'foo', values: [10, 20] },
 *                     { b: true, thing: 'bar', values: [15, 35] });
 *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
 * @symb R.mergeWithKey(f, { x: 1, y: 2 }, { y: 5, z: 3 }) = { x: 1, y: f('y', 2, 5), z: 3 }
 */


var mergeWithKey =
/*#__PURE__*/
_curry3(function mergeWithKey(fn, l, r) {
  var result = {};
  var k;

  for (k in l) {
    if (_has(k, l)) {
      result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
    }
  }

  for (k in r) {
    if (_has(k, r) && !_has(k, result)) {
      result[k] = r[k];
    }
  }

  return result;
});

module.exports = mergeWithKey;
},{"./internal/_curry3":111,"./internal/_has":121}],216:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns the smaller of its two arguments.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord a => a -> a -> a
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.minBy, R.max
 * @example
 *
 *      R.min(789, 123); //=> 123
 *      R.min('a', 'b'); //=> 'a'
 */


var min =
/*#__PURE__*/
_curry2(function min(a, b) {
  return b < a ? b : a;
});

module.exports = min;
},{"./internal/_curry2":110}],217:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Takes a function and two values, and returns whichever value produces the
 * smaller result when passed to the provided function.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Relation
 * @sig Ord b => (a -> b) -> a -> a -> a
 * @param {Function} f
 * @param {*} a
 * @param {*} b
 * @return {*}
 * @see R.min, R.maxBy
 * @example
 *
 *      //  square :: Number -> Number
 *      const square = n => n * n;
 *
 *      R.minBy(square, -3, 2); //=> 2
 *
 *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
 *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
 */


var minBy =
/*#__PURE__*/
_curry3(function minBy(f, a, b) {
  return f(b) < f(a) ? b : a;
});

module.exports = minBy;
},{"./internal/_curry3":111}],218:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Divides the first parameter by the second and returns the remainder. Note
 * that this function preserves the JavaScript-style behavior for modulo. For
 * mathematical modulo see [`mathMod`](#mathMod).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The value to the divide.
 * @param {Number} b The pseudo-modulus
 * @return {Number} The result of `b % a`.
 * @see R.mathMod
 * @example
 *
 *      R.modulo(17, 3); //=> 2
 *      // JS behavior:
 *      R.modulo(-17, 3); //=> -2
 *      R.modulo(17, -3); //=> 2
 *
 *      const isOdd = R.modulo(R.__, 2);
 *      isOdd(42); //=> 0
 *      isOdd(21); //=> 1
 */


var modulo =
/*#__PURE__*/
_curry2(function modulo(a, b) {
  return a % b;
});

module.exports = modulo;
},{"./internal/_curry2":110}],219:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Move an item, at index `from`, to index `to`, in a list of elements.
 * A new list will be created containing the new elements order.
 *
 * @func
 * @memberOf R
 * @since v0.27.0
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} from The source index
 * @param {Number} to The destination index
 * @param {Array} list The list which will serve to realise the move
 * @return {Array} The new list reordered
 * @example
 *
 *      R.move(0, 2, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['b', 'c', 'a', 'd', 'e', 'f']
 *      R.move(-1, 0, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['f', 'a', 'b', 'c', 'd', 'e'] list rotation
 */


var move =
/*#__PURE__*/
_curry3(function (from, to, list) {
  var length = list.length;
  var result = list.slice();
  var positiveFrom = from < 0 ? length + from : from;
  var positiveTo = to < 0 ? length + to : to;
  var item = result.splice(positiveFrom, 1);
  return positiveFrom < 0 || positiveFrom >= list.length || positiveTo < 0 || positiveTo >= list.length ? list : [].concat(result.slice(0, positiveTo)).concat(item).concat(result.slice(positiveTo, list.length));
});

module.exports = move;
},{"./internal/_curry3":111}],220:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Multiplies two numbers. Equivalent to `a * b` but curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a * b`.
 * @see R.divide
 * @example
 *
 *      const double = R.multiply(2);
 *      const triple = R.multiply(3);
 *      double(3);       //=>  6
 *      triple(4);       //=> 12
 *      R.multiply(2, 5);  //=> 10
 */


var multiply =
/*#__PURE__*/
_curry2(function multiply(a, b) {
  return a * b;
});

module.exports = multiply;
},{"./internal/_curry2":110}],221:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly `n` parameters. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} n The desired arity of the new function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity `n`.
 * @see R.binary, R.unary
 * @example
 *
 *      const takesTwoArgs = (a, b) => [a, b];
 *
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.nAry(1, takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only `n` arguments are passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.nAry(0, f)(a, b) = f()
 * @symb R.nAry(1, f)(a, b) = f(a)
 * @symb R.nAry(2, f)(a, b) = f(a, b)
 */


var nAry =
/*#__PURE__*/
_curry2(function nAry(n, fn) {
  switch (n) {
    case 0:
      return function () {
        return fn.call(this);
      };

    case 1:
      return function (a0) {
        return fn.call(this, a0);
      };

    case 2:
      return function (a0, a1) {
        return fn.call(this, a0, a1);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.call(this, a0, a1, a2);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.call(this, a0, a1, a2, a3);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.call(this, a0, a1, a2, a3, a4);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.call(this, a0, a1, a2, a3, a4, a5);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
      };

    default:
      throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
  }
});

module.exports = nAry;
},{"./internal/_curry2":110}],222:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Negates its argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Math
 * @sig Number -> Number
 * @param {Number} n
 * @return {Number}
 * @example
 *
 *      R.negate(42); //=> -42
 */


var negate =
/*#__PURE__*/
_curry1(function negate(n) {
  return -n;
});

module.exports = negate;
},{"./internal/_curry1":109}],223:[function(require,module,exports){
var _complement =
/*#__PURE__*/
require("./internal/_complement");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var all =
/*#__PURE__*/
require("./all");
/**
 * Returns `true` if no elements of the list match the predicate, `false`
 * otherwise.
 *
 * Dispatches to the `all` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> Boolean
 * @param {Function} fn The predicate function.
 * @param {Array} list The array to consider.
 * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
 * @see R.all, R.any
 * @example
 *
 *      const isEven = n => n % 2 === 0;
 *      const isOdd = n => n % 2 === 1;
 *
 *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
 *      R.none(isOdd, [1, 3, 5, 7, 8, 11]); //=> false
 */


var none =
/*#__PURE__*/
_curry2(function none(fn, input) {
  return all(_complement(fn), input);
});

module.exports = none;
},{"./all":9,"./internal/_complement":106,"./internal/_curry2":110}],224:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * A function that returns the `!` of its argument. It will return `true` when
 * passed false-y value, and `false` when passed a truth-y one.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig * -> Boolean
 * @param {*} a any value
 * @return {Boolean} the logical inverse of passed argument.
 * @see R.complement
 * @example
 *
 *      R.not(true); //=> false
 *      R.not(false); //=> true
 *      R.not(0); //=> true
 *      R.not(1); //=> false
 */


var not =
/*#__PURE__*/
_curry1(function not(a) {
  return !a;
});

module.exports = not;
},{"./internal/_curry1":109}],225:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isString =
/*#__PURE__*/
require("./internal/_isString");
/**
 * Returns the nth element of the given list or string. If n is negative the
 * element at index length + n is returned.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> a | Undefined
 * @sig Number -> String -> String
 * @param {Number} offset
 * @param {*} list
 * @return {*}
 * @example
 *
 *      const list = ['foo', 'bar', 'baz', 'quux'];
 *      R.nth(1, list); //=> 'bar'
 *      R.nth(-1, list); //=> 'quux'
 *      R.nth(-99, list); //=> undefined
 *
 *      R.nth(2, 'abc'); //=> 'c'
 *      R.nth(3, 'abc'); //=> ''
 * @symb R.nth(-1, [a, b, c]) = c
 * @symb R.nth(0, [a, b, c]) = a
 * @symb R.nth(1, [a, b, c]) = b
 */


var nth =
/*#__PURE__*/
_curry2(function nth(offset, list) {
  var idx = offset < 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});

module.exports = nth;
},{"./internal/_curry2":110,"./internal/_isString":135}],226:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var curryN =
/*#__PURE__*/
require("./curryN");

var nth =
/*#__PURE__*/
require("./nth");
/**
 * Returns a function which returns its nth argument.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Function
 * @sig Number -> *... -> *
 * @param {Number} n
 * @return {Function}
 * @example
 *
 *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
 *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
 * @symb R.nthArg(-1)(a, b, c) = c
 * @symb R.nthArg(0)(a, b, c) = a
 * @symb R.nthArg(1)(a, b, c) = b
 */


var nthArg =
/*#__PURE__*/
_curry1(function nthArg(n) {
  var arity = n < 0 ? 1 : n + 1;
  return curryN(arity, function () {
    return nth(n, arguments);
  });
});

module.exports = nthArg;
},{"./curryN":46,"./internal/_curry1":109,"./nth":225}],227:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * `o` is a curried composition function that returns a unary function.
 * Like [`compose`](#compose), `o` performs right-to-left function composition.
 * Unlike [`compose`](#compose), the rightmost function passed to `o` will be
 * invoked with only one argument. Also, unlike [`compose`](#compose), `o` is
 * limited to accepting only 2 unary functions. The name o was chosen because
 * of its similarity to the mathematical composition operator ∘.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category Function
 * @sig (b -> c) -> (a -> b) -> a -> c
 * @param {Function} f
 * @param {Function} g
 * @return {Function}
 * @see R.compose, R.pipe
 * @example
 *
 *      const classyGreeting = name => "The name's " + name.last + ", " + name.first + " " + name.last
 *      const yellGreeting = R.o(R.toUpper, classyGreeting);
 *      yellGreeting({first: 'James', last: 'Bond'}); //=> "THE NAME'S BOND, JAMES BOND"
 *
 *      R.o(R.multiply(10), R.add(10))(-4) //=> 60
 *
 * @symb R.o(f, g, x) = f(g(x))
 */


var o =
/*#__PURE__*/
_curry3(function o(f, g, x) {
  return f(g(x));
});

module.exports = o;
},{"./internal/_curry3":111}],228:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates an object containing a single key:value pair.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @sig String -> a -> {String:a}
 * @param {String} key
 * @param {*} val
 * @return {Object}
 * @see R.pair
 * @example
 *
 *      const matchPhrases = R.compose(
 *        R.objOf('must'),
 *        R.map(R.objOf('match_phrase'))
 *      );
 *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
 */


var objOf =
/*#__PURE__*/
_curry2(function objOf(key, val) {
  var obj = {};
  obj[key] = val;
  return obj;
});

module.exports = objOf;
},{"./internal/_curry2":110}],229:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _of =
/*#__PURE__*/
require("./internal/_of");
/**
 * Returns a singleton array containing the value provided.
 *
 * Note this `of` is different from the ES6 `of`; See
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category Function
 * @sig a -> [a]
 * @param {*} x any value
 * @return {Array} An array wrapping `x`.
 * @example
 *
 *      R.of(null); //=> [null]
 *      R.of([42]); //=> [[42]]
 */


var of =
/*#__PURE__*/
_curry1(_of);

module.exports = of;
},{"./internal/_curry1":109,"./internal/_of":141}],230:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a partial copy of an object omitting the keys specified.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [String] -> {String: *} -> {String: *}
 * @param {Array} names an array of String property names to omit from the new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with properties from `names` not on it.
 * @see R.pick
 * @example
 *
 *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
 */


var omit =
/*#__PURE__*/
_curry2(function omit(names, obj) {
  var result = {};
  var index = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  for (var prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

module.exports = omit;
},{"./internal/_curry2":110}],231:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Accepts a function `fn` and returns a function that guards invocation of
 * `fn` such that `fn` can only ever be called once, no matter how many times
 * the returned function is invoked. The first value calculated is returned in
 * subsequent invocations.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a... -> b) -> (a... -> b)
 * @param {Function} fn The function to wrap in a call-only-once wrapper.
 * @return {Function} The wrapped function.
 * @example
 *
 *      const addOneOnce = R.once(x => x + 1);
 *      addOneOnce(10); //=> 11
 *      addOneOnce(addOneOnce(50)); //=> 11
 */


var once =
/*#__PURE__*/
_curry1(function once(fn) {
  var called = false;
  var result;
  return _arity(fn.length, function () {
    if (called) {
      return result;
    }

    called = true;
    result = fn.apply(this, arguments);
    return result;
  });
});

module.exports = once;
},{"./internal/_arity":100,"./internal/_curry1":109}],232:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns `true` if one or both of its arguments are `true`. Returns `false`
 * if both arguments are `false`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Logic
 * @sig a -> b -> a | b
 * @param {Any} a
 * @param {Any} b
 * @return {Any} the first argument if truthy, otherwise the second argument.
 * @see R.either, R.xor
 * @example
 *
 *      R.or(true, true); //=> true
 *      R.or(true, false); //=> true
 *      R.or(false, true); //=> true
 *      R.or(false, false); //=> false
 */


var or =
/*#__PURE__*/
_curry2(function or(a, b) {
  return a || b;
});

module.exports = or;
},{"./internal/_curry2":110}],233:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _assertPromise =
/*#__PURE__*/
require("./internal/_assertPromise");
/**
 * Returns the result of applying the onFailure function to the value inside
 * a failed promise. This is useful for handling rejected promises
 * inside function compositions.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig (e -> b) -> (Promise e a) -> (Promise e b)
 * @sig (e -> (Promise f b)) -> (Promise e a) -> (Promise f b)
 * @param {Function} onFailure The function to apply. Can return a value or a promise of a value.
 * @param {Promise} p
 * @return {Promise} The result of calling `p.then(null, onFailure)`
 * @see R.then
 * @example
 *
 *      var failedFetch = (id) => Promise.reject('bad ID');
 *      var useDefault = () => ({ firstName: 'Bob', lastName: 'Loblaw' })
 *
 *      //recoverFromFailure :: String -> Promise ({firstName, lastName})
 *      var recoverFromFailure = R.pipe(
 *        failedFetch,
 *        R.otherwise(useDefault),
 *        R.then(R.pick(['firstName', 'lastName'])),
 *      );
 *      recoverFromFailure(12345).then(console.log)
 */


var otherwise =
/*#__PURE__*/
_curry2(function otherwise(f, p) {
  _assertPromise('otherwise', p);

  return p.then(null, f);
});

module.exports = otherwise;
},{"./internal/_assertPromise":102,"./internal/_curry2":110}],234:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3"); // `Identity` is a functor that holds a single value, where `map` simply
// transforms the held value with the provided function.


var Identity = function (x) {
  return {
    value: x,
    map: function (f) {
      return Identity(f(x));
    }
  };
};
/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the result of applying the given function to
 * the focused value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> (a -> a) -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      const headLens = R.lensIndex(0);
 *
 *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
 */


var over =
/*#__PURE__*/
_curry3(function over(lens, f, x) {
  // The value returned by the getter function is first transformed with `f`,
  // then set as the value of an `Identity`. This is then mapped over with the
  // setter function of the lens.
  return lens(function (y) {
    return Identity(f(y));
  })(x).value;
});

module.exports = over;
},{"./internal/_curry3":111}],235:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category List
 * @sig a -> b -> (a,b)
 * @param {*} fst
 * @param {*} snd
 * @return {Array}
 * @see R.objOf, R.of
 * @example
 *
 *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
 */


var pair =
/*#__PURE__*/
_curry2(function pair(fst, snd) {
  return [fst, snd];
});

module.exports = pair;
},{"./internal/_curry2":110}],236:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _createPartialApplicator =
/*#__PURE__*/
require("./internal/_createPartialApplicator");
/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided initially followed by the arguments provided to `g`.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partialRight, R.curry
 * @example
 *
 *      const multiply2 = (a, b) => a * b;
 *      const double = R.partial(multiply2, [2]);
 *      double(2); //=> 4
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const sayHello = R.partial(greet, ['Hello']);
 *      const sayHelloToMs = R.partial(sayHello, ['Ms.']);
 *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partial(f, [a, b])(c, d) = f(a, b, c, d)
 */


var partial =
/*#__PURE__*/
_createPartialApplicator(_concat);

module.exports = partial;
},{"./internal/_concat":107,"./internal/_createPartialApplicator":108}],237:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _createPartialApplicator =
/*#__PURE__*/
require("./internal/_createPartialApplicator");

var flip =
/*#__PURE__*/
require("./flip");
/**
 * Takes a function `f` and a list of arguments, and returns a function `g`.
 * When applied, `g` returns the result of applying `f` to the arguments
 * provided to `g` followed by the arguments provided initially.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
 * @param {Function} f
 * @param {Array} args
 * @return {Function}
 * @see R.partial
 * @example
 *
 *      const greet = (salutation, title, firstName, lastName) =>
 *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
 *
 *      const greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
 *
 *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
 * @symb R.partialRight(f, [a, b])(c, d) = f(c, d, a, b)
 */


var partialRight =
/*#__PURE__*/
_createPartialApplicator(
/*#__PURE__*/
flip(_concat));

module.exports = partialRight;
},{"./flip":74,"./internal/_concat":107,"./internal/_createPartialApplicator":108}],238:[function(require,module,exports){
var filter =
/*#__PURE__*/
require("./filter");

var juxt =
/*#__PURE__*/
require("./juxt");

var reject =
/*#__PURE__*/
require("./reject");
/**
 * Takes a predicate and a list or other `Filterable` object and returns the
 * pair of filterable objects of the same type of elements which do and do not
 * satisfy, the predicate, respectively. Filterable objects include plain objects or any object
 * that has a filter method such as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
 * @param {Function} pred A predicate to determine which side the element belongs to.
 * @param {Array} filterable the list (or other filterable) to partition.
 * @return {Array} An array, containing first the subset of elements that satisfy the
 *         predicate, and second the subset of elements that do not satisfy.
 * @see R.filter, R.reject
 * @example
 *
 *      R.partition(R.includes('s'), ['sss', 'ttt', 'foo', 'bars']);
 *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
 *
 *      R.partition(R.includes('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
 *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
 */


var partition =
/*#__PURE__*/
juxt([filter, reject]);
module.exports = partition;
},{"./filter":68,"./juxt":181,"./reject":267}],239:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var paths =
/*#__PURE__*/
require("./paths");
/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop, R.nth
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
 *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
 */


var path =
/*#__PURE__*/
_curry2(function path(pathAr, obj) {
  return paths([pathAr], obj)[0];
});

module.exports = path;
},{"./internal/_curry2":110,"./paths":243}],240:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var equals =
/*#__PURE__*/
require("./equals");

var path =
/*#__PURE__*/
require("./path");
/**
 * Determines whether a nested path on an object has a specific value, in
 * [`R.equals`](#equals) terms. Most likely used to filter a list.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category Relation
 * @typedefn Idx = String | Int
 * @sig [Idx] -> a -> {a} -> Boolean
 * @param {Array} path The path of the nested property to use
 * @param {*} val The value to compare the nested property with
 * @param {Object} obj The object to check the nested property in
 * @return {Boolean} `true` if the value equals the nested object property,
 *         `false` otherwise.
 * @example
 *
 *      const user1 = { address: { zipCode: 90210 } };
 *      const user2 = { address: { zipCode: 55555 } };
 *      const user3 = { name: 'Bob' };
 *      const users = [ user1, user2, user3 ];
 *      const isFamous = R.pathEq(['address', 'zipCode'], 90210);
 *      R.filter(isFamous, users); //=> [ user1 ]
 */


var pathEq =
/*#__PURE__*/
_curry3(function pathEq(_path, val, obj) {
  return equals(path(_path, obj), val);
});

module.exports = pathEq;
},{"./equals":66,"./internal/_curry3":111,"./path":239}],241:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var defaultTo =
/*#__PURE__*/
require("./defaultTo");

var path =
/*#__PURE__*/
require("./path");
/**
 * If the given, non-null object has a value at the given path, returns the
 * value at that path. Otherwise returns the provided default value.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig a -> [Idx] -> {a} -> a
 * @param {*} d The default value.
 * @param {Array} p The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path` of the supplied object or the default value.
 * @example
 *
 *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
 */


var pathOr =
/*#__PURE__*/
_curry3(function pathOr(d, p, obj) {
  return defaultTo(d, path(p, obj));
});

module.exports = pathOr;
},{"./defaultTo":48,"./internal/_curry3":111,"./path":239}],242:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var path =
/*#__PURE__*/
require("./path");
/**
 * Returns `true` if the specified object property at given path satisfies the
 * given predicate; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Logic
 * @typedefn Idx = String | Int
 * @sig (a -> Boolean) -> [Idx] -> {a} -> Boolean
 * @param {Function} pred
 * @param {Array} propPath
 * @param {*} obj
 * @return {Boolean}
 * @see R.propSatisfies, R.path
 * @example
 *
 *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
 *      R.pathSatisfies(R.is(Object), [], {x: {y: 2}}); //=> true
 */


var pathSatisfies =
/*#__PURE__*/
_curry3(function pathSatisfies(pred, propPath, obj) {
  return pred(path(propPath, obj));
});

module.exports = pathSatisfies;
},{"./internal/_curry3":111,"./path":239}],243:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isInteger =
/*#__PURE__*/
require("./internal/_isInteger");

var nth =
/*#__PURE__*/
require("./nth");
/**
 * Retrieves the values at given paths of an object.
 *
 * @func
 * @memberOf R
 * @since v0.27.0
 * @category Object
 * @typedefn Idx = [String | Int]
 * @sig [Idx] -> {a} -> [a | Undefined]
 * @param {Array} pathsArray The array of paths to be fetched.
 * @param {Object} obj The object to retrieve the nested properties from.
 * @return {Array} A list consisting of values at paths specified by "pathsArray".
 * @see R.path
 * @example
 *
 *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
 *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
 */


var paths =
/*#__PURE__*/
_curry2(function paths(pathsArray, obj) {
  return pathsArray.map(function (paths) {
    var val = obj;
    var idx = 0;
    var p;

    while (idx < paths.length) {
      if (val == null) {
        return;
      }

      p = paths[idx];
      val = _isInteger(p) ? nth(p, val) : val[p];
      idx += 1;
    }

    return val;
  });
});

module.exports = paths;
},{"./internal/_curry2":110,"./internal/_isInteger":130,"./nth":225}],244:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a partial copy of an object containing only the keys specified. If
 * the key does not exist, the property is ignored.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.omit, R.props
 * @example
 *
 *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
 */


var pick =
/*#__PURE__*/
_curry2(function pick(names, obj) {
  var result = {};
  var idx = 0;

  while (idx < names.length) {
    if (names[idx] in obj) {
      result[names[idx]] = obj[names[idx]];
    }

    idx += 1;
  }

  return result;
});

module.exports = pick;
},{"./internal/_curry2":110}],245:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Similar to `pick` except that this one includes a `key: undefined` pair for
 * properties that don't exist.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> {k: v}
 * @param {Array} names an array of String property names to copy onto a new object
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties from `names` on it.
 * @see R.pick
 * @example
 *
 *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
 *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
 */


var pickAll =
/*#__PURE__*/
_curry2(function pickAll(names, obj) {
  var result = {};
  var idx = 0;
  var len = names.length;

  while (idx < len) {
    var name = names[idx];
    result[name] = obj[name];
    idx += 1;
  }

  return result;
});

module.exports = pickAll;
},{"./internal/_curry2":110}],246:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a partial copy of an object containing only the keys that satisfy
 * the supplied predicate.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Object
 * @sig ((v, k) -> Boolean) -> {k: v} -> {k: v}
 * @param {Function} pred A predicate to determine whether or not a key
 *        should be included on the output object.
 * @param {Object} obj The object to copy from
 * @return {Object} A new object with only properties that satisfy `pred`
 *         on it.
 * @see R.pick, R.filter
 * @example
 *
 *      const isUpperCase = (val, key) => key.toUpperCase() === key;
 *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
 */


var pickBy =
/*#__PURE__*/
_curry2(function pickBy(test, obj) {
  var result = {};

  for (var prop in obj) {
    if (test(obj[prop], prop, obj)) {
      result[prop] = obj[prop];
    }
  }

  return result;
});

module.exports = pickBy;
},{"./internal/_curry2":110}],247:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _pipe =
/*#__PURE__*/
require("./internal/_pipe");

var reduce =
/*#__PURE__*/
require("./reduce");

var tail =
/*#__PURE__*/
require("./tail");
/**
 * Performs left-to-right function composition. The first argument may have
 * any arity; the remaining arguments must be unary.
 *
 * In some libraries this function is named `sequence`.
 *
 * **Note:** The result of pipe is not automatically curried.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.compose
 * @example
 *
 *      const f = R.pipe(Math.pow, R.negate, R.inc);
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipe(f, g, h)(a, b) = h(g(f(a, b)))
 */


function pipe() {
  if (arguments.length === 0) {
    throw new Error('pipe requires at least one argument');
  }

  return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
}

module.exports = pipe;
},{"./internal/_arity":100,"./internal/_pipe":142,"./reduce":262,"./tail":288}],248:[function(require,module,exports){
var composeK =
/*#__PURE__*/
require("./composeK");

var reverse =
/*#__PURE__*/
require("./reverse");
/**
 * Returns the left-to-right Kleisli composition of the provided functions,
 * each of which must return a value of a type supported by [`chain`](#chain).
 *
 * `R.pipeK(f, g, h)` is equivalent to `R.pipe(f, R.chain(g), R.chain(h))`.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Function
 * @sig Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> (a -> m z)
 * @param {...Function}
 * @return {Function}
 * @see R.composeK
 * @deprecated since v0.26.0
 * @example
 *
 *      //  parseJson :: String -> Maybe *
 *      //  get :: String -> Object -> Maybe *
 *
 *      //  getStateCode :: Maybe String -> Maybe String
 *      const getStateCode = R.pipeK(
 *        parseJson,
 *        get('user'),
 *        get('address'),
 *        get('state'),
 *        R.compose(Maybe.of, R.toUpper)
 *      );
 *
 *      getStateCode('{"user":{"address":{"state":"ny"}}}');
 *      //=> Just('NY')
 *      getStateCode('[Invalid JSON]');
 *      //=> Nothing()
 * @symb R.pipeK(f, g, h)(a) = R.chain(h, R.chain(g, f(a)))
 */


function pipeK() {
  if (arguments.length === 0) {
    throw new Error('pipeK requires at least one argument');
  }

  return composeK.apply(this, reverse(arguments));
}

module.exports = pipeK;
},{"./composeK":35,"./reverse":271}],249:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _pipeP =
/*#__PURE__*/
require("./internal/_pipeP");

var reduce =
/*#__PURE__*/
require("./reduce");

var tail =
/*#__PURE__*/
require("./tail");
/**
 * Performs left-to-right composition of one or more Promise-returning
 * functions. The first argument may have any arity; the remaining arguments
 * must be unary.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category Function
 * @sig ((a -> Promise b), (b -> Promise c), ..., (y -> Promise z)) -> (a -> Promise z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.composeP
 * @deprecated since v0.26.0
 * @example
 *
 *      //  followersForUser :: String -> Promise [User]
 *      const followersForUser = R.pipeP(db.getUserById, db.getFollowers);
 */


function pipeP() {
  if (arguments.length === 0) {
    throw new Error('pipeP requires at least one argument');
  }

  return _arity(arguments[0].length, reduce(_pipeP, arguments[0], tail(arguments)));
}

module.exports = pipeP;
},{"./internal/_arity":100,"./internal/_pipeP":143,"./reduce":262,"./tail":288}],250:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var head =
/*#__PURE__*/
require("./head");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var tail =
/*#__PURE__*/
require("./tail");

var identity =
/*#__PURE__*/
require("./identity");
/**
 * Performs left-to-right function composition using transforming function. The first argument may have
 * any arity; the remaining arguments must be unary.
 *
 * **Note:** The result of pipeWith is not automatically curried. Transforming function is not used on the
 * first argument.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((* -> *), [((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)]) -> ((a, b, ..., n) -> z)
 * @param {...Function} functions
 * @return {Function}
 * @see R.composeWith, R.pipe
 * @example
 *
 *      const pipeWhileNotNil = R.pipeWith((f, res) => R.isNil(res) ? res : f(res));
 *      const f = pipeWhileNotNil([Math.pow, R.negate, R.inc])
 *
 *      f(3, 4); // -(3^4) + 1
 * @symb R.pipeWith(f)([g, h, i])(...args) = f(i, f(h, g(...args)))
 */


var pipeWith =
/*#__PURE__*/
_curry2(function pipeWith(xf, list) {
  if (list.length <= 0) {
    return identity;
  }

  var headList = head(list);
  var tailList = tail(list);
  return _arity(headList.length, function () {
    return _reduce(function (result, f) {
      return xf.call(this, f, result);
    }, headList.apply(this, arguments), tailList);
  });
});

module.exports = pipeWith;
},{"./head":85,"./identity":87,"./internal/_arity":100,"./internal/_curry2":110,"./internal/_reduce":145,"./tail":288}],251:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var map =
/*#__PURE__*/
require("./map");

var prop =
/*#__PURE__*/
require("./prop");
/**
 * Returns a new list by plucking the same named property off all objects in
 * the list supplied.
 *
 * `pluck` will work on
 * any [functor](https://github.com/fantasyland/fantasy-land#functor) in
 * addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Functor f => k -> f {k: v} -> f v
 * @param {Number|String} key The key name to pluck off of each object.
 * @param {Array} f The array or functor to consider.
 * @return {Array} The list of values for the given key.
 * @see R.props
 * @example
 *
 *      var getAges = R.pluck('age');
 *      getAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]
 *
 *      R.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]
 *      R.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}
 * @symb R.pluck('x', [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}]) = [1, 3, 5]
 * @symb R.pluck(0, [[1, 2], [3, 4], [5, 6]]) = [1, 3, 5]
 */


var pluck =
/*#__PURE__*/
_curry2(function pluck(p, list) {
  return map(prop(p), list);
});

module.exports = pluck;
},{"./internal/_curry2":110,"./map":195,"./prop":255}],252:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a new list with the given element at the front, followed by the
 * contents of the list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig a -> [a] -> [a]
 * @param {*} el The item to add to the head of the output list.
 * @param {Array} list The array to add to the tail of the output list.
 * @return {Array} A new array.
 * @see R.append
 * @example
 *
 *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
 */


var prepend =
/*#__PURE__*/
_curry2(function prepend(el, list) {
  return _concat([el], list);
});

module.exports = prepend;
},{"./internal/_concat":107,"./internal/_curry2":110}],253:[function(require,module,exports){
var multiply =
/*#__PURE__*/
require("./multiply");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Multiplies together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The product of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.product([2,4,6,8,100,1]); //=> 38400
 */


var product =
/*#__PURE__*/
reduce(multiply, 1);
module.exports = product;
},{"./multiply":220,"./reduce":262}],254:[function(require,module,exports){
var _map =
/*#__PURE__*/
require("./internal/_map");

var identity =
/*#__PURE__*/
require("./identity");

var pickAll =
/*#__PURE__*/
require("./pickAll");

var useWith =
/*#__PURE__*/
require("./useWith");
/**
 * Reasonable analog to SQL `select` statement.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @category Relation
 * @sig [k] -> [{k: v}] -> [{k: v}]
 * @param {Array} props The property names to project
 * @param {Array} objs The objects to query
 * @return {Array} An array of objects with just the `props` properties.
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
 *      const kids = [abby, fred];
 *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
 */


var project =
/*#__PURE__*/
useWith(_map, [pickAll, identity]); // passing `identity` gives correct arity

module.exports = project;
},{"./identity":87,"./internal/_map":138,"./pickAll":245,"./useWith":321}],255:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var path =
/*#__PURE__*/
require("./path");
/**
 * Returns a function that when supplied an object returns the indicated
 * property of that object, if it exists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig Idx -> {s: a} -> a | Undefined
 * @param {String|Number} p The property name or array index
 * @param {Object} obj The object to query
 * @return {*} The value at `obj.p`.
 * @see R.path, R.nth
 * @example
 *
 *      R.prop('x', {x: 100}); //=> 100
 *      R.prop('x', {}); //=> undefined
 *      R.prop(0, [100]); //=> 100
 *      R.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4
 */


var prop =
/*#__PURE__*/
_curry2(function prop(p, obj) {
  return path([p], obj);
});

module.exports = prop;
},{"./internal/_curry2":110,"./path":239}],256:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var equals =
/*#__PURE__*/
require("./equals");
/**
 * Returns `true` if the specified object property is equal, in
 * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
 * You can test multiple properties with [`R.whereEq`](#whereEq).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig String -> a -> Object -> Boolean
 * @param {String} name
 * @param {*} val
 * @param {*} obj
 * @return {Boolean}
 * @see R.whereEq, R.propSatisfies, R.equals
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond'};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown'};
 *      const rusty = {name: 'Rusty', age: 10, hair: 'brown'};
 *      const alois = {name: 'Alois', age: 15, disposition: 'surly'};
 *      const kids = [abby, fred, rusty, alois];
 *      const hasBrownHair = R.propEq('hair', 'brown');
 *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
 */


var propEq =
/*#__PURE__*/
_curry3(function propEq(name, val, obj) {
  return equals(val, obj[name]);
});

module.exports = propEq;
},{"./equals":66,"./internal/_curry3":111}],257:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var is =
/*#__PURE__*/
require("./is");
/**
 * Returns `true` if the specified object property is of the given type;
 * `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Type
 * @sig Type -> String -> Object -> Boolean
 * @param {Function} type
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.is, R.propSatisfies
 * @example
 *
 *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
 *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
 *      R.propIs(Number, 'x', {});            //=> false
 */


var propIs =
/*#__PURE__*/
_curry3(function propIs(type, name, obj) {
  return is(type, obj[name]);
});

module.exports = propIs;
},{"./internal/_curry3":111,"./is":177}],258:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var pathOr =
/*#__PURE__*/
require("./pathOr");
/**
 * If the given, non-null object has an own property with the specified name,
 * returns the value of that property. Otherwise returns the provided default
 * value.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category Object
 * @sig a -> String -> Object -> a
 * @param {*} val The default value.
 * @param {String} p The name of the property to return.
 * @param {Object} obj The object to query.
 * @return {*} The value of given property of the supplied object or the default value.
 * @example
 *
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const favorite = R.prop('favoriteLibrary');
 *      const favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
 *
 *      favorite(alice);  //=> undefined
 *      favoriteWithDefault(alice);  //=> 'Ramda'
 */


var propOr =
/*#__PURE__*/
_curry3(function propOr(val, p, obj) {
  return pathOr(val, [p], obj);
});

module.exports = propOr;
},{"./internal/_curry3":111,"./pathOr":241}],259:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Returns `true` if the specified object property satisfies the given
 * predicate; `false` otherwise. You can test multiple properties with
 * [`R.where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Logic
 * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
 * @param {Function} pred
 * @param {String} name
 * @param {*} obj
 * @return {Boolean}
 * @see R.where, R.propEq, R.propIs
 * @example
 *
 *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
 */


var propSatisfies =
/*#__PURE__*/
_curry3(function propSatisfies(pred, name, obj) {
  return pred(obj[name]);
});

module.exports = propSatisfies;
},{"./internal/_curry3":111}],260:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var path =
/*#__PURE__*/
require("./path");
/**
 * Acts as multiple `prop`: array of keys in, array of values out. Preserves
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig [k] -> {k: v} -> [v]
 * @param {Array} ps The property names to fetch
 * @param {Object} obj The object to query
 * @return {Array} The corresponding values or partially applied function.
 * @example
 *
 *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
 *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
 *
 *      const fullName = R.compose(R.join(' '), R.props(['first', 'last']));
 *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
 */


var props =
/*#__PURE__*/
_curry2(function props(ps, obj) {
  return ps.map(function (p) {
    return path([p], obj);
  });
});

module.exports = props;
},{"./internal/_curry2":110,"./path":239}],261:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isNumber =
/*#__PURE__*/
require("./internal/_isNumber");
/**
 * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> Number -> [Number]
 * @param {Number} from The first number in the list.
 * @param {Number} to One more than the last number in the list.
 * @return {Array} The list of numbers in the set `[a, b)`.
 * @example
 *
 *      R.range(1, 5);    //=> [1, 2, 3, 4]
 *      R.range(50, 53);  //=> [50, 51, 52]
 */


var range =
/*#__PURE__*/
_curry2(function range(from, to) {
  if (!(_isNumber(from) && _isNumber(to))) {
    throw new TypeError('Both arguments to range must be numbers');
  }

  var result = [];
  var n = from;

  while (n < to) {
    result.push(n);
    n += 1;
  }

  return result;
});

module.exports = range;
},{"./internal/_curry2":110,"./internal/_isNumber":131}],262:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");
/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It may use
 * [`R.reduced`](#reduced) to shortcut the iteration.
 *
 * The arguments' order of [`reduceRight`](#reduceRight)'s iterator function
 * is *(value, acc)*.
 *
 * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduce` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
 *
 * Dispatches to the `reduce` method of the third argument, if present. When
 * doing so, it is up to the user to handle the [`R.reduced`](#reduced)
 * shortcuting, as this is not implemented by `reduce`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduced, R.addIndex, R.reduceRight
 * @example
 *
 *      R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10
 *      //          -               -10
 *      //         / \              / \
 *      //        -   4           -6   4
 *      //       / \              / \
 *      //      -   3   ==>     -3   3
 *      //     / \              / \
 *      //    -   2           -1   2
 *      //   / \              / \
 *      //  0   1            0   1
 *
 * @symb R.reduce(f, a, [b, c, d]) = f(f(f(a, b), c), d)
 */


var reduce =
/*#__PURE__*/
_curry3(_reduce);

module.exports = reduce;
},{"./internal/_curry3":111,"./internal/_reduce":145}],263:[function(require,module,exports){
var _clone =
/*#__PURE__*/
require("./internal/_clone");

var _curryN =
/*#__PURE__*/
require("./internal/_curryN");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _has =
/*#__PURE__*/
require("./internal/_has");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _xreduceBy =
/*#__PURE__*/
require("./internal/_xreduceBy");
/**
 * Groups the elements of the list according to the result of calling
 * the String-returning function `keyFn` on each element and reduces the elements
 * of each group to a single value via the reducer function `valueFn`.
 *
 * This function is basically a more general [`groupBy`](#groupBy) function.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category List
 * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
 * @param {Function} valueFn The function that reduces the elements of each group to a single
 *        value. Receives two values, accumulator for a particular group and the current element.
 * @param {*} acc The (initial) accumulator value for each group.
 * @param {Function} keyFn The function that maps the list's element into a key.
 * @param {Array} list The array to group.
 * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
 *         `valueFn` for elements which produced that key when passed to `keyFn`.
 * @see R.groupBy, R.reduce
 * @example
 *
 *      const groupNames = (acc, {name}) => acc.concat(name)
 *      const toGrade = ({score}) =>
 *        score < 65 ? 'F' :
 *        score < 70 ? 'D' :
 *        score < 80 ? 'C' :
 *        score < 90 ? 'B' : 'A'
 *
 *      var students = [
 *        {name: 'Abby', score: 83},
 *        {name: 'Bart', score: 62},
 *        {name: 'Curt', score: 88},
 *        {name: 'Dora', score: 92},
 *      ]
 *
 *      reduceBy(groupNames, [], toGrade, students)
 *      //=> {"A": ["Dora"], "B": ["Abby", "Curt"], "F": ["Bart"]}
 */


var reduceBy =
/*#__PURE__*/
_curryN(4, [],
/*#__PURE__*/
_dispatchable([], _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
  return _reduce(function (acc, elt) {
    var key = keyFn(elt);
    acc[key] = valueFn(_has(key, acc) ? acc[key] : _clone(valueAcc, [], [], false), elt);
    return acc;
  }, {}, list);
}));

module.exports = reduceBy;
},{"./internal/_clone":104,"./internal/_curryN":112,"./internal/_dispatchable":113,"./internal/_has":121,"./internal/_reduce":145,"./internal/_xreduceBy":166}],264:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Returns a single item by iterating through the list, successively calling
 * the iterator function and passing it an accumulator value and the current
 * value from the array, and then passing the result to the next call.
 *
 * Similar to [`reduce`](#reduce), except moves through the input list from the
 * right to the left.
 *
 * The iterator function receives two values: *(value, acc)*, while the arguments'
 * order of `reduce`'s iterator function is *(acc, value)*.
 *
 * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
 * arrays), unlike the native `Array.prototype.reduceRight` method. For more details
 * on this behavior, see:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> b) -> b -> [a] -> b
 * @param {Function} fn The iterator function. Receives two values, the current element from the array
 *        and the accumulator.
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.addIndex
 * @example
 *
 *      R.reduceRight(R.subtract, 0, [1, 2, 3, 4]) // => (1 - (2 - (3 - (4 - 0)))) = -2
 *      //    -               -2
 *      //   / \              / \
 *      //  1   -            1   3
 *      //     / \              / \
 *      //    2   -     ==>    2  -1
 *      //       / \              / \
 *      //      3   -            3   4
 *      //         / \              / \
 *      //        4   0            4   0
 *
 * @symb R.reduceRight(f, a, [b, c, d]) = f(b, f(c, f(d, a)))
 */


var reduceRight =
/*#__PURE__*/
_curry3(function reduceRight(fn, acc, list) {
  var idx = list.length - 1;

  while (idx >= 0) {
    acc = fn(list[idx], acc);
    idx -= 1;
  }

  return acc;
});

module.exports = reduceRight;
},{"./internal/_curry3":111}],265:[function(require,module,exports){
var _curryN =
/*#__PURE__*/
require("./internal/_curryN");

var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _reduced =
/*#__PURE__*/
require("./internal/_reduced");
/**
 * Like [`reduce`](#reduce), `reduceWhile` returns a single item by iterating
 * through the list, successively calling the iterator function. `reduceWhile`
 * also takes a predicate that is evaluated before each step. If the predicate
 * returns `false`, it "short-circuits" the iteration and returns the current
 * value of the accumulator.
 *
 * @func
 * @memberOf R
 * @since v0.22.0
 * @category List
 * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} pred The predicate. It is passed the accumulator and the
 *        current element.
 * @param {Function} fn The iterator function. Receives two values, the
 *        accumulator and the current element.
 * @param {*} a The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced
 * @example
 *
 *      const isOdd = (acc, x) => x % 2 === 1;
 *      const xs = [1, 3, 5, 60, 777, 800];
 *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
 *
 *      const ys = [2, 4, 6]
 *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
 */


var reduceWhile =
/*#__PURE__*/
_curryN(4, [], function _reduceWhile(pred, fn, a, list) {
  return _reduce(function (acc, x) {
    return pred(acc, x) ? fn(acc, x) : _reduced(acc);
  }, a, list);
});

module.exports = reduceWhile;
},{"./internal/_curryN":112,"./internal/_reduce":145,"./internal/_reduced":146}],266:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _reduced =
/*#__PURE__*/
require("./internal/_reduced");
/**
 * Returns a value wrapped to indicate that it is the final value of the reduce
 * and transduce functions. The returned value should be considered a black
 * box: the internal structure is not guaranteed to be stable.
 *
 * Note: this optimization is only available to the below functions:
 * - [`reduce`](#reduce)
 * - [`reduceWhile`](#reduceWhile)
 * - [`transduce`](#transduce)
 *
 * @func
 * @memberOf R
 * @since v0.15.0
 * @category List
 * @sig a -> *
 * @param {*} x The final value of the reduce.
 * @return {*} The wrapped value.
 * @see R.reduce, R.reduceWhile, R.transduce
 * @example
 *
 *     R.reduce(
 *       (acc, item) => item > 3 ? R.reduced(acc) : acc.concat(item),
 *       [],
 *       [1, 2, 3, 4, 5]) // [1, 2, 3]
 */


var reduced =
/*#__PURE__*/
_curry1(_reduced);

module.exports = reduced;
},{"./internal/_curry1":109,"./internal/_reduced":146}],267:[function(require,module,exports){
var _complement =
/*#__PURE__*/
require("./internal/_complement");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var filter =
/*#__PURE__*/
require("./filter");
/**
 * The complement of [`filter`](#filter).
 *
 * Acts as a transducer if a transformer is given in list position. Filterable
 * objects include plain objects or any object that has a filter method such
 * as `Array`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Filterable f => (a -> Boolean) -> f a -> f a
 * @param {Function} pred
 * @param {Array} filterable
 * @return {Array}
 * @see R.filter, R.transduce, R.addIndex
 * @example
 *
 *      const isOdd = (n) => n % 2 === 1;
 *
 *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
 *
 *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
 */


var reject =
/*#__PURE__*/
_curry2(function reject(pred, filterable) {
  return filter(_complement(pred), filterable);
});

module.exports = reject;
},{"./filter":68,"./internal/_complement":106,"./internal/_curry2":110}],268:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Removes the sub-list of `list` starting at index `start` and containing
 * `count` elements. _Note that this is not destructive_: it returns a copy of
 * the list with the changes.
 * <small>No lists have been harmed in the application of this function.</small>
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @param {Number} start The position to start removing elements
 * @param {Number} count The number of elements to remove
 * @param {Array} list The list to remove from
 * @return {Array} A new Array with `count` elements from `start` removed.
 * @see R.without
 * @example
 *
 *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
 */


var remove =
/*#__PURE__*/
_curry3(function remove(start, count, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count);
  return result;
});

module.exports = remove;
},{"./internal/_curry3":111}],269:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var always =
/*#__PURE__*/
require("./always");

var times =
/*#__PURE__*/
require("./times");
/**
 * Returns a fixed list of size `n` containing a specified identical value.
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category List
 * @sig a -> n -> [a]
 * @param {*} value The value to repeat.
 * @param {Number} n The desired size of the output list.
 * @return {Array} A new array containing `n` `value`s.
 * @see R.times
 * @example
 *
 *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
 *
 *      const obj = {};
 *      const repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
 *      repeatedObjs[0] === repeatedObjs[1]; //=> true
 * @symb R.repeat(a, 0) = []
 * @symb R.repeat(a, 1) = [a]
 * @symb R.repeat(a, 2) = [a, a]
 */


var repeat =
/*#__PURE__*/
_curry2(function repeat(value, n) {
  return times(always(value), n);
});

module.exports = repeat;
},{"./always":11,"./internal/_curry2":110,"./times":296}],270:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Replace a substring or regex match in a string with a replacement.
 *
 * The first two parameters correspond to the parameters of the
 * `String.prototype.replace()` function, so the second parameter can also be a
 * function.
 *
 * @func
 * @memberOf R
 * @since v0.7.0
 * @category String
 * @sig RegExp|String -> String -> String -> String
 * @param {RegExp|String} pattern A regular expression or a substring to match.
 * @param {String} replacement The string to replace the matches with.
 * @param {String} str The String to do the search and replacement in.
 * @return {String} The result.
 * @example
 *
 *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
 *
 *      // Use the "g" (global) flag to replace all occurrences:
 *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
 */


var replace =
/*#__PURE__*/
_curry3(function replace(regex, replacement, str) {
  return str.replace(regex, replacement);
});

module.exports = replace;
},{"./internal/_curry3":111}],271:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _isString =
/*#__PURE__*/
require("./internal/_isString");
/**
 * Returns a new list or string with the elements or characters in reverse
 * order.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {Array|String} list
 * @return {Array|String}
 * @example
 *
 *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
 *      R.reverse([1, 2]);     //=> [2, 1]
 *      R.reverse([1]);        //=> [1]
 *      R.reverse([]);         //=> []
 *
 *      R.reverse('abc');      //=> 'cba'
 *      R.reverse('ab');       //=> 'ba'
 *      R.reverse('a');        //=> 'a'
 *      R.reverse('');         //=> ''
 */


var reverse =
/*#__PURE__*/
_curry1(function reverse(list) {
  return _isString(list) ? list.split('').reverse().join('') : Array.prototype.slice.call(list, 0).reverse();
});

module.exports = reverse;
},{"./internal/_curry1":109,"./internal/_isString":135}],272:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Scan is similar to [`reduce`](#reduce), but returns a list of successively
 * reduced values from the left
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig ((a, b) -> a) -> a -> [b] -> [a]
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array
 * @param {*} acc The accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {Array} A list of all intermediately reduced values.
 * @see R.reduce, R.mapAccum
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
 * @symb R.scan(f, a, [b, c]) = [a, f(a, b), f(f(a, b), c)]
 */


var scan =
/*#__PURE__*/
_curry3(function scan(fn, acc, list) {
  var idx = 0;
  var len = list.length;
  var result = [acc];

  while (idx < len) {
    acc = fn(acc, list[idx]);
    result[idx + 1] = acc;
    idx += 1;
  }

  return result;
});

module.exports = scan;
},{"./internal/_curry3":111}],273:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var ap =
/*#__PURE__*/
require("./ap");

var map =
/*#__PURE__*/
require("./map");

var prepend =
/*#__PURE__*/
require("./prepend");

var reduceRight =
/*#__PURE__*/
require("./reduceRight");
/**
 * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
 * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
 * Applicative of Traversable.
 *
 * Dispatches to the `sequence` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
 * @param {Function} of
 * @param {*} traversable
 * @return {*}
 * @see R.traverse
 * @example
 *
 *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
 *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
 *
 *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
 *      R.sequence(R.of, Nothing());       //=> [Nothing()]
 */


var sequence =
/*#__PURE__*/
_curry2(function sequence(of, traversable) {
  return typeof traversable.sequence === 'function' ? traversable.sequence(of) : reduceRight(function (x, acc) {
    return ap(map(prepend, x), acc);
  }, of([]), traversable);
});

module.exports = sequence;
},{"./ap":16,"./internal/_curry2":110,"./map":195,"./prepend":252,"./reduceRight":264}],274:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var always =
/*#__PURE__*/
require("./always");

var over =
/*#__PURE__*/
require("./over");
/**
 * Returns the result of "setting" the portion of the given data structure
 * focused by the given lens to the given value.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> a -> s -> s
 * @param {Lens} lens
 * @param {*} v
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
 *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
 */


var set =
/*#__PURE__*/
_curry3(function set(lens, v, x) {
  return over(lens, always(v), x);
});

module.exports = set;
},{"./always":11,"./internal/_curry3":111,"./over":234}],275:[function(require,module,exports){
var _checkForMethod =
/*#__PURE__*/
require("./internal/_checkForMethod");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Returns the elements of the given list or string (or object with a `slice`
 * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
 *
 * Dispatches to the `slice` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.4
 * @category List
 * @sig Number -> Number -> [a] -> [a]
 * @sig Number -> Number -> String -> String
 * @param {Number} fromIndex The start index (inclusive).
 * @param {Number} toIndex The end index (exclusive).
 * @param {*} list
 * @return {*}
 * @example
 *
 *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
 *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
 *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
 *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
 *      R.slice(0, 3, 'ramda');                     //=> 'ram'
 */


var slice =
/*#__PURE__*/
_curry3(
/*#__PURE__*/
_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
  return Array.prototype.slice.call(list, fromIndex, toIndex);
}));

module.exports = slice;
},{"./internal/_checkForMethod":103,"./internal/_curry3":111}],276:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a copy of the list, sorted according to the comparator function,
 * which should accept two values at a time and return a negative number if the
 * first value is smaller, a positive number if it's larger, and zero if they
 * are equal. Please note that this is a **copy** of the list. It does not
 * modify the original.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, a) -> Number) -> [a] -> [a]
 * @param {Function} comparator A sorting function :: a -> b -> Int
 * @param {Array} list The list to sort
 * @return {Array} a new array with its elements sorted by the comparator function.
 * @example
 *
 *      const diff = function(a, b) { return a - b; };
 *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
 */


var sort =
/*#__PURE__*/
_curry2(function sort(comparator, list) {
  return Array.prototype.slice.call(list, 0).sort(comparator);
});

module.exports = sort;
},{"./internal/_curry2":110}],277:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Sorts the list according to the supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig Ord b => (a -> b) -> [a] -> [a]
 * @param {Function} fn
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted by the keys generated by `fn`.
 * @example
 *
 *      const sortByFirstItem = R.sortBy(R.prop(0));
 *      const pairs = [[-1, 1], [-2, 2], [-3, 3]];
 *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
 *
 *      const sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
 *      const alice = {
 *        name: 'ALICE',
 *        age: 101
 *      };
 *      const bob = {
 *        name: 'Bob',
 *        age: -10
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 314.159
 *      };
 *      const people = [clara, bob, alice];
 *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
 */


var sortBy =
/*#__PURE__*/
_curry2(function sortBy(fn, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var aa = fn(a);
    var bb = fn(b);
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  });
});

module.exports = sortBy;
},{"./internal/_curry2":110}],278:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Sorts a list according to a list of comparators.
 *
 * @func
 * @memberOf R
 * @since v0.23.0
 * @category Relation
 * @sig [(a, a) -> Number] -> [a] -> [a]
 * @param {Array} functions A list of comparator functions.
 * @param {Array} list The list to sort.
 * @return {Array} A new list sorted according to the comarator functions.
 * @example
 *
 *      const alice = {
 *        name: 'alice',
 *        age: 40
 *      };
 *      const bob = {
 *        name: 'bob',
 *        age: 30
 *      };
 *      const clara = {
 *        name: 'clara',
 *        age: 40
 *      };
 *      const people = [clara, bob, alice];
 *      const ageNameSort = R.sortWith([
 *        R.descend(R.prop('age')),
 *        R.ascend(R.prop('name'))
 *      ]);
 *      ageNameSort(people); //=> [alice, clara, bob]
 */


var sortWith =
/*#__PURE__*/
_curry2(function sortWith(fns, list) {
  return Array.prototype.slice.call(list, 0).sort(function (a, b) {
    var result = 0;
    var i = 0;

    while (result === 0 && i < fns.length) {
      result = fns[i](a, b);
      i += 1;
    }

    return result;
  });
});

module.exports = sortWith;
},{"./internal/_curry2":110}],279:[function(require,module,exports){
var invoker =
/*#__PURE__*/
require("./invoker");
/**
 * Splits a string into an array of strings based on the given
 * separator.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category String
 * @sig (String | RegExp) -> String -> [String]
 * @param {String|RegExp} sep The pattern.
 * @param {String} str The string to separate into an array.
 * @return {Array} The array of strings from `str` separated by `sep`.
 * @see R.join
 * @example
 *
 *      const pathComponents = R.split('/');
 *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
 *
 *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
 */


var split =
/*#__PURE__*/
invoker(1, 'split');
module.exports = split;
},{"./invoker":176}],280:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var length =
/*#__PURE__*/
require("./length");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Splits a given list or string at a given index.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig Number -> [a] -> [[a], [a]]
 * @sig Number -> String -> [String, String]
 * @param {Number} index The index where the array/string is split.
 * @param {Array|String} array The array/string to be split.
 * @return {Array}
 * @example
 *
 *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
 *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
 *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
 */


var splitAt =
/*#__PURE__*/
_curry2(function splitAt(index, array) {
  return [slice(0, index, array), slice(index, length(array), array)];
});

module.exports = splitAt;
},{"./internal/_curry2":110,"./length":186,"./slice":275}],281:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Splits a collection into slices of the specified length.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [[a]]
 * @sig Number -> String -> [String]
 * @param {Number} n
 * @param {Array} list
 * @return {Array}
 * @example
 *
 *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
 *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
 */


var splitEvery =
/*#__PURE__*/
_curry2(function splitEvery(n, list) {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer');
  }

  var result = [];
  var idx = 0;

  while (idx < list.length) {
    result.push(slice(idx, idx += n, list));
  }

  return result;
});

module.exports = splitEvery;
},{"./internal/_curry2":110,"./slice":275}],282:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Takes a list and a predicate and returns a pair of lists with the following properties:
 *
 *  - the result of concatenating the two output lists is equivalent to the input list;
 *  - none of the elements of the first output list satisfies the predicate; and
 *  - if the second output list is non-empty, its first element satisfies the predicate.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [[a], [a]]
 * @param {Function} pred The predicate that determines where the array is split.
 * @param {Array} list The array to be split.
 * @return {Array}
 * @example
 *
 *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
 */


var splitWhen =
/*#__PURE__*/
_curry2(function splitWhen(pred, list) {
  var idx = 0;
  var len = list.length;
  var prefix = [];

  while (idx < len && !pred(list[idx])) {
    prefix.push(list[idx]);
    idx += 1;
  }

  return [prefix, Array.prototype.slice.call(list, idx)];
});

module.exports = splitWhen;
},{"./internal/_curry2":110}],283:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var equals =
/*#__PURE__*/
require("./equals");

var take =
/*#__PURE__*/
require("./take");
/**
 * Checks if a list starts with the provided sublist.
 *
 * Similarly, checks if a string starts with the provided substring.
 *
 * @func
 * @memberOf R
 * @since v0.24.0
 * @category List
 * @sig [a] -> [a] -> Boolean
 * @sig String -> String -> Boolean
 * @param {*} prefix
 * @param {*} list
 * @return {Boolean}
 * @see R.endsWith
 * @example
 *
 *      R.startsWith('a', 'abc')                //=> true
 *      R.startsWith('b', 'abc')                //=> false
 *      R.startsWith(['a'], ['a', 'b', 'c'])    //=> true
 *      R.startsWith(['b'], ['a', 'b', 'c'])    //=> false
 */


var startsWith =
/*#__PURE__*/
_curry2(function (prefix, list) {
  return equals(take(prefix.length, list), prefix);
});

module.exports = startsWith;
},{"./equals":66,"./internal/_curry2":110,"./take":289}],284:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Subtracts its second argument from its first argument.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig Number -> Number -> Number
 * @param {Number} a The first value.
 * @param {Number} b The second value.
 * @return {Number} The result of `a - b`.
 * @see R.add
 * @example
 *
 *      R.subtract(10, 8); //=> 2
 *
 *      const minus5 = R.subtract(R.__, 5);
 *      minus5(17); //=> 12
 *
 *      const complementaryAngle = R.subtract(90);
 *      complementaryAngle(30); //=> 60
 *      complementaryAngle(72); //=> 18
 */


var subtract =
/*#__PURE__*/
_curry2(function subtract(a, b) {
  return Number(a) - Number(b);
});

module.exports = subtract;
},{"./internal/_curry2":110}],285:[function(require,module,exports){
var add =
/*#__PURE__*/
require("./add");

var reduce =
/*#__PURE__*/
require("./reduce");
/**
 * Adds together all the elements of a list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Math
 * @sig [Number] -> Number
 * @param {Array} list An array of numbers
 * @return {Number} The sum of all the numbers in the list.
 * @see R.reduce
 * @example
 *
 *      R.sum([2,4,6,8,100,1]); //=> 121
 */


var sum =
/*#__PURE__*/
reduce(add, 0);
module.exports = sum;
},{"./add":6,"./reduce":262}],286:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var concat =
/*#__PURE__*/
require("./concat");

var difference =
/*#__PURE__*/
require("./difference");
/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
 * @example
 *
 *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
 *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
 */


var symmetricDifference =
/*#__PURE__*/
_curry2(function symmetricDifference(list1, list2) {
  return concat(difference(list1, list2), difference(list2, list1));
});

module.exports = symmetricDifference;
},{"./concat":38,"./difference":50,"./internal/_curry2":110}],287:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var concat =
/*#__PURE__*/
require("./concat");

var differenceWith =
/*#__PURE__*/
require("./differenceWith");
/**
 * Finds the set (i.e. no duplicates) of all elements contained in the first or
 * second list, but not both. Duplication is determined according to the value
 * returned by applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [a] -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The elements in `list1` or `list2`, but not both.
 * @see R.symmetricDifference, R.difference, R.differenceWith
 * @example
 *
 *      const eqA = R.eqBy(R.prop('a'));
 *      const l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
 *      const l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
 *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
 */


var symmetricDifferenceWith =
/*#__PURE__*/
_curry3(function symmetricDifferenceWith(pred, list1, list2) {
  return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
});

module.exports = symmetricDifferenceWith;
},{"./concat":38,"./differenceWith":51,"./internal/_curry3":111}],288:[function(require,module,exports){
var _checkForMethod =
/*#__PURE__*/
require("./internal/_checkForMethod");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns all but the first element of the given list or string (or object
 * with a `tail` method).
 *
 * Dispatches to the `slice` method of the first argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @sig String -> String
 * @param {*} list
 * @return {*}
 * @see R.head, R.init, R.last
 * @example
 *
 *      R.tail([1, 2, 3]);  //=> [2, 3]
 *      R.tail([1, 2]);     //=> [2]
 *      R.tail([1]);        //=> []
 *      R.tail([]);         //=> []
 *
 *      R.tail('abc');  //=> 'bc'
 *      R.tail('ab');   //=> 'b'
 *      R.tail('a');    //=> ''
 *      R.tail('');     //=> ''
 */


var tail =
/*#__PURE__*/
_curry1(
/*#__PURE__*/
_checkForMethod('tail',
/*#__PURE__*/
slice(1, Infinity)));

module.exports = tail;
},{"./internal/_checkForMethod":103,"./internal/_curry1":109,"./slice":275}],289:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xtake =
/*#__PURE__*/
require("./internal/_xtake");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns the first `n` elements of the given list, string, or
 * transducer/transformer (or object with a `take` method).
 *
 * Dispatches to the `take` method of the second argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n
 * @param {*} list
 * @return {*}
 * @see R.drop
 * @example
 *
 *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
 *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
 *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.take(3, 'ramda');               //=> 'ram'
 *
 *      const personnel = [
 *        'Dave Brubeck',
 *        'Paul Desmond',
 *        'Eugene Wright',
 *        'Joe Morello',
 *        'Gerry Mulligan',
 *        'Bob Bates',
 *        'Joe Dodge',
 *        'Ron Crotty'
 *      ];
 *
 *      const takeFive = R.take(5);
 *      takeFive(personnel);
 *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
 * @symb R.take(-1, [a, b]) = [a, b]
 * @symb R.take(0, [a, b]) = []
 * @symb R.take(1, [a, b]) = [a]
 * @symb R.take(2, [a, b]) = [a, b]
 */


var take =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['take'], _xtake, function take(n, xs) {
  return slice(0, n < 0 ? Infinity : n, xs);
}));

module.exports = take;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xtake":167,"./slice":275}],290:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var drop =
/*#__PURE__*/
require("./drop");
/**
 * Returns a new list containing the last `n` elements of the given list.
 * If `n > list.length`, returns a list of `list.length` elements.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig Number -> [a] -> [a]
 * @sig Number -> String -> String
 * @param {Number} n The number of elements to return.
 * @param {Array} xs The collection to consider.
 * @return {Array}
 * @see R.dropLast
 * @example
 *
 *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
 *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
 *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
 *      R.takeLast(3, 'ramda');               //=> 'mda'
 */


var takeLast =
/*#__PURE__*/
_curry2(function takeLast(n, xs) {
  return drop(n >= 0 ? xs.length - n : 0, xs);
});

module.exports = takeLast;
},{"./drop":55,"./internal/_curry2":110}],291:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns a new list containing the last `n` elements of a given list, passing
 * each value to the supplied predicate function, and terminating when the
 * predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropLastWhile, R.addIndex
 * @example
 *
 *      const isNotOne = x => x !== 1;
 *
 *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
 *
 *      R.takeLastWhile(x => x !== 'R' , 'Ramda'); //=> 'amda'
 */


var takeLastWhile =
/*#__PURE__*/
_curry2(function takeLastWhile(fn, xs) {
  var idx = xs.length - 1;

  while (idx >= 0 && fn(xs[idx])) {
    idx -= 1;
  }

  return slice(idx + 1, Infinity, xs);
});

module.exports = takeLastWhile;
},{"./internal/_curry2":110,"./slice":275}],292:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xtakeWhile =
/*#__PURE__*/
require("./internal/_xtakeWhile");

var slice =
/*#__PURE__*/
require("./slice");
/**
 * Returns a new list containing the first `n` elements of a given list,
 * passing each value to the supplied predicate function, and terminating when
 * the predicate function returns `false`. Excludes the element that caused the
 * predicate function to fail. The predicate function is passed one argument:
 * *(value)*.
 *
 * Dispatches to the `takeWhile` method of the second argument, if present.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig (a -> Boolean) -> [a] -> [a]
 * @sig (a -> Boolean) -> String -> String
 * @param {Function} fn The function called per iteration.
 * @param {Array} xs The collection to iterate over.
 * @return {Array} A new array.
 * @see R.dropWhile, R.transduce, R.addIndex
 * @example
 *
 *      const isNotFour = x => x !== 4;
 *
 *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
 *
 *      R.takeWhile(x => x !== 'd' , 'Ramda'); //=> 'Ram'
 */


var takeWhile =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable(['takeWhile'], _xtakeWhile, function takeWhile(fn, xs) {
  var idx = 0;
  var len = xs.length;

  while (idx < len && fn(xs[idx])) {
    idx += 1;
  }

  return slice(0, idx, xs);
}));

module.exports = takeWhile;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xtakeWhile":168,"./slice":275}],293:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _dispatchable =
/*#__PURE__*/
require("./internal/_dispatchable");

var _xtap =
/*#__PURE__*/
require("./internal/_xtap");
/**
 * Runs the given function with the supplied object, then returns the object.
 *
 * Acts as a transducer if a transformer is given as second parameter.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (a -> *) -> a -> a
 * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
 * @param {*} x
 * @return {*} `x`.
 * @example
 *
 *      const sayX = x => console.log('x is ' + x);
 *      R.tap(sayX, 100); //=> 100
 *      // logs 'x is 100'
 * @symb R.tap(f, a) = a
 */


var tap =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
_dispatchable([], _xtap, function tap(fn, x) {
  fn(x);
  return x;
}));

module.exports = tap;
},{"./internal/_curry2":110,"./internal/_dispatchable":113,"./internal/_xtap":169}],294:[function(require,module,exports){
var _cloneRegExp =
/*#__PURE__*/
require("./internal/_cloneRegExp");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _isRegExp =
/*#__PURE__*/
require("./internal/_isRegExp");

var toString =
/*#__PURE__*/
require("./toString");
/**
 * Determines whether a given string matches a given regular expression.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category String
 * @sig RegExp -> String -> Boolean
 * @param {RegExp} pattern
 * @param {String} str
 * @return {Boolean}
 * @see R.match
 * @example
 *
 *      R.test(/^x/, 'xyz'); //=> true
 *      R.test(/^y/, 'xyz'); //=> false
 */


var test =
/*#__PURE__*/
_curry2(function test(pattern, str) {
  if (!_isRegExp(pattern)) {
    throw new TypeError('‘test’ requires a value of type RegExp as its first argument; received ' + toString(pattern));
  }

  return _cloneRegExp(pattern).test(str);
});

module.exports = test;
},{"./internal/_cloneRegExp":105,"./internal/_curry2":110,"./internal/_isRegExp":134,"./toString":300}],295:[function(require,module,exports){
var curryN =
/*#__PURE__*/
require("./curryN");

var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Creates a thunk out of a function. A thunk delays a calculation until
 * its result is needed, providing lazy evaluation of arguments.
 *
 * @func
 * @memberOf R
 * @since v0.26.0
 * @category Function
 * @sig ((a, b, ..., j) -> k) -> (a, b, ..., j) -> (() -> k)
 * @param {Function} fn A function to wrap in a thunk
 * @return {Function} Expects arguments for `fn` and returns a new function
 *  that, when called, applies those arguments to `fn`.
 * @see R.partial, R.partialRight
 * @example
 *
 *      R.thunkify(R.identity)(42)(); //=> 42
 *      R.thunkify((a, b) => a + b)(25, 17)(); //=> 42
 */


var thunkify =
/*#__PURE__*/
_curry1(function thunkify(fn) {
  return curryN(fn.length, function createThunk() {
    var fnArgs = arguments;
    return function invokeThunk() {
      return fn.apply(this, fnArgs);
    };
  });
});

module.exports = thunkify;
},{"./curryN":46,"./internal/_curry1":109}],296:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Calls an input function `n` times, returning an array containing the results
 * of those function calls.
 *
 * `fn` is passed one argument: The current value of `n`, which begins at `0`
 * and is gradually incremented to `n - 1`.
 *
 * @func
 * @memberOf R
 * @since v0.2.3
 * @category List
 * @sig (Number -> a) -> Number -> [a]
 * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
 * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
 * @return {Array} An array containing the return values of all calls to `fn`.
 * @see R.repeat
 * @example
 *
 *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
 * @symb R.times(f, 0) = []
 * @symb R.times(f, 1) = [f(0)]
 * @symb R.times(f, 2) = [f(0), f(1)]
 */


var times =
/*#__PURE__*/
_curry2(function times(fn, n) {
  var len = Number(n);
  var idx = 0;
  var list;

  if (len < 0 || isNaN(len)) {
    throw new RangeError('n must be a non-negative number');
  }

  list = new Array(len);

  while (idx < len) {
    list[idx] = fn(idx);
    idx += 1;
  }

  return list;
});

module.exports = times;
},{"./internal/_curry2":110}],297:[function(require,module,exports){
var invoker =
/*#__PURE__*/
require("./invoker");
/**
 * The lower case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to lower case.
 * @return {String} The lower case version of `str`.
 * @see R.toUpper
 * @example
 *
 *      R.toLower('XYZ'); //=> 'xyz'
 */


var toLower =
/*#__PURE__*/
invoker(0, 'toLowerCase');
module.exports = toLower;
},{"./invoker":176}],298:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _has =
/*#__PURE__*/
require("./internal/_has");
/**
 * Converts an object into an array of key, value arrays. Only the object's
 * own properties are used.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own properties.
 * @see R.fromPairs
 * @example
 *
 *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
 */


var toPairs =
/*#__PURE__*/
_curry1(function toPairs(obj) {
  var pairs = [];

  for (var prop in obj) {
    if (_has(prop, obj)) {
      pairs[pairs.length] = [prop, obj[prop]];
    }
  }

  return pairs;
});

module.exports = toPairs;
},{"./internal/_curry1":109,"./internal/_has":121}],299:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Converts an object into an array of key, value arrays. The object's own
 * properties and prototype properties are used. Note that the order of the
 * output array is not guaranteed to be consistent across different JS
 * platforms.
 *
 * @func
 * @memberOf R
 * @since v0.4.0
 * @category Object
 * @sig {String: *} -> [[String,*]]
 * @param {Object} obj The object to extract from
 * @return {Array} An array of key, value arrays from the object's own
 *         and prototype properties.
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
 */


var toPairsIn =
/*#__PURE__*/
_curry1(function toPairsIn(obj) {
  var pairs = [];

  for (var prop in obj) {
    pairs[pairs.length] = [prop, obj[prop]];
  }

  return pairs;
});

module.exports = toPairsIn;
},{"./internal/_curry1":109}],300:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var _toString =
/*#__PURE__*/
require("./internal/_toString");
/**
 * Returns the string representation of the given value. `eval`'ing the output
 * should result in a value equivalent to the input value. Many of the built-in
 * `toString` methods do not satisfy this requirement.
 *
 * If the given value is an `[object Object]` with a `toString` method other
 * than `Object.prototype.toString`, this method is invoked with no arguments
 * to produce the return value. This means user-defined constructor functions
 * can provide a suitable `toString` method. For example:
 *
 *     function Point(x, y) {
 *       this.x = x;
 *       this.y = y;
 *     }
 *
 *     Point.prototype.toString = function() {
 *       return 'new Point(' + this.x + ', ' + this.y + ')';
 *     };
 *
 *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category String
 * @sig * -> String
 * @param {*} val
 * @return {String}
 * @example
 *
 *      R.toString(42); //=> '42'
 *      R.toString('abc'); //=> '"abc"'
 *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
 *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
 *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
 */


var toString =
/*#__PURE__*/
_curry1(function toString(val) {
  return _toString(val, []);
});

module.exports = toString;
},{"./internal/_curry1":109,"./internal/_toString":149}],301:[function(require,module,exports){
var invoker =
/*#__PURE__*/
require("./invoker");
/**
 * The upper case version of a string.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to upper case.
 * @return {String} The upper case version of `str`.
 * @see R.toLower
 * @example
 *
 *      R.toUpper('abc'); //=> 'ABC'
 */


var toUpper =
/*#__PURE__*/
invoker(0, 'toUpperCase');
module.exports = toUpper;
},{"./invoker":176}],302:[function(require,module,exports){
var _reduce =
/*#__PURE__*/
require("./internal/_reduce");

var _xwrap =
/*#__PURE__*/
require("./internal/_xwrap");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Initializes a transducer using supplied iterator function. Returns a single
 * item by iterating through the list, successively calling the transformed
 * iterator function and passing it an accumulator value and the current value
 * from the array, and then passing the result to the next call.
 *
 * The iterator function receives two values: *(acc, value)*. It will be
 * wrapped as a transformer to initialize the transducer. A transformer can be
 * passed directly in place of an iterator function. In both cases, iteration
 * may be stopped early with the [`R.reduced`](#reduced) function.
 *
 * A transducer is a function that accepts a transformer and returns a
 * transformer and can be composed directly.
 *
 * A transformer is an an object that provides a 2-arity reducing iterator
 * function, step, 0-arity initial value function, init, and 1-arity result
 * extraction function, result. The step function is used as the iterator
 * function in reduce. The result function is used to convert the final
 * accumulator into the return type and in most cases is
 * [`R.identity`](#identity). The init function can be used to provide an
 * initial accumulator, but is ignored by transduce.
 *
 * The iteration is performed with [`R.reduce`](#reduce) after initializing the transducer.
 *
 * @func
 * @memberOf R
 * @since v0.12.0
 * @category List
 * @sig (c -> c) -> ((a, b) -> a) -> a -> [b] -> a
 * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
 * @param {Function} fn The iterator function. Receives two values, the accumulator and the
 *        current element from the array. Wrapped as transformer, if necessary, and used to
 *        initialize the transducer
 * @param {*} acc The initial accumulator value.
 * @param {Array} list The list to iterate over.
 * @return {*} The final, accumulated value.
 * @see R.reduce, R.reduced, R.into
 * @example
 *
 *      const numbers = [1, 2, 3, 4];
 *      const transducer = R.compose(R.map(R.add(1)), R.take(2));
 *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
 *
 *      const isOdd = (x) => x % 2 === 1;
 *      const firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));
 *      R.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]
 */


var transduce =
/*#__PURE__*/
curryN(4, function transduce(xf, fn, acc, list) {
  return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
});
module.exports = transduce;
},{"./curryN":46,"./internal/_reduce":145,"./internal/_xwrap":170}],303:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Transposes the rows and columns of a 2D list.
 * When passed a list of `n` lists of length `x`,
 * returns a list of `x` lists of length `n`.
 *
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [[a]] -> [[a]]
 * @param {Array} list A 2D list
 * @return {Array} A 2D list
 * @example
 *
 *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
 *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 *      // If some of the rows are shorter than the following rows, their elements are skipped:
 *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
 * @symb R.transpose([[a], [b], [c]]) = [a, b, c]
 * @symb R.transpose([[a, b], [c, d]]) = [[a, c], [b, d]]
 * @symb R.transpose([[a, b], [c]]) = [[a, c], [b]]
 */


var transpose =
/*#__PURE__*/
_curry1(function transpose(outerlist) {
  var i = 0;
  var result = [];

  while (i < outerlist.length) {
    var innerlist = outerlist[i];
    var j = 0;

    while (j < innerlist.length) {
      if (typeof result[j] === 'undefined') {
        result[j] = [];
      }

      result[j].push(innerlist[j]);
      j += 1;
    }

    i += 1;
  }

  return result;
});

module.exports = transpose;
},{"./internal/_curry1":109}],304:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var map =
/*#__PURE__*/
require("./map");

var sequence =
/*#__PURE__*/
require("./sequence");
/**
 * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
 * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
 * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
 * into an Applicative of Traversable.
 *
 * Dispatches to the `traverse` method of the third argument, if present.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
 * @param {Function} of
 * @param {Function} f
 * @param {*} traversable
 * @return {*}
 * @see R.sequence
 * @example
 *
 *      // Returns `Maybe.Nothing` if the given divisor is `0`
 *      const safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n / d)
 *
 *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Maybe.Just([5, 2.5, 2])
 *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Maybe.Nothing
 */


var traverse =
/*#__PURE__*/
_curry3(function traverse(of, f, traversable) {
  return typeof traversable['fantasy-land/traverse'] === 'function' ? traversable['fantasy-land/traverse'](f, of) : sequence(of, map(f, traversable));
});

module.exports = traverse;
},{"./internal/_curry3":111,"./map":195,"./sequence":273}],305:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
var zeroWidth = '\u200b';
var hasProtoTrim = typeof String.prototype.trim === 'function';
/**
 * Removes (strips) whitespace from both ends of the string.
 *
 * @func
 * @memberOf R
 * @since v0.6.0
 * @category String
 * @sig String -> String
 * @param {String} str The string to trim.
 * @return {String} Trimmed version of `str`.
 * @example
 *
 *      R.trim('   xyz  '); //=> 'xyz'
 *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
 */

var trim = !hasProtoTrim ||
/*#__PURE__*/
ws.trim() || !
/*#__PURE__*/
zeroWidth.trim() ?
/*#__PURE__*/
_curry1(function trim(str) {
  var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
  var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
  return str.replace(beginRx, '').replace(endRx, '');
}) :
/*#__PURE__*/
_curry1(function trim(str) {
  return str.trim();
});
module.exports = trim;
},{"./internal/_curry1":109}],306:[function(require,module,exports){
var _arity =
/*#__PURE__*/
require("./internal/_arity");

var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
 * function evaluates the `tryer`; if it does not throw, it simply returns the
 * result. If the `tryer` *does* throw, the returned function evaluates the
 * `catcher` function and returns its result. Note that for effective
 * composition with this function, both the `tryer` and `catcher` functions
 * must return the same type of results.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Function
 * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
 * @param {Function} tryer The function that may throw.
 * @param {Function} catcher The function that will be evaluated if `tryer` throws.
 * @return {Function} A new function that will catch exceptions and send then to the catcher.
 * @example
 *
 *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
 *      R.tryCatch(() => { throw 'foo'}, R.always('catched'))('bar') // => 'catched'
 *      R.tryCatch(R.times(R.identity), R.always([]))('s') // => []
 *      R.tryCatch(() => { throw 'this is not a valid value'}, (err, value)=>({error : err,  value }))('bar') // => {'error': 'this is not a valid value', 'value': 'bar'}
 */


var tryCatch =
/*#__PURE__*/
_curry2(function _tryCatch(tryer, catcher) {
  return _arity(tryer.length, function () {
    try {
      return tryer.apply(this, arguments);
    } catch (e) {
      return catcher.apply(this, _concat([e], arguments));
    }
  });
});

module.exports = tryCatch;
},{"./internal/_arity":100,"./internal/_concat":107,"./internal/_curry2":110}],307:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Gives a single-word string description of the (native) type of a value,
 * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
 * attempt to distinguish user Object types any further, reporting them all as
 * 'Object'.
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Type
 * @sig (* -> {*}) -> String
 * @param {*} val The value to test
 * @return {String}
 * @example
 *
 *      R.type({}); //=> "Object"
 *      R.type(1); //=> "Number"
 *      R.type(false); //=> "Boolean"
 *      R.type('s'); //=> "String"
 *      R.type(null); //=> "Null"
 *      R.type([]); //=> "Array"
 *      R.type(/[A-z]/); //=> "RegExp"
 *      R.type(() => {}); //=> "Function"
 *      R.type(undefined); //=> "Undefined"
 */


var type =
/*#__PURE__*/
_curry1(function type(val) {
  return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
});

module.exports = type;
},{"./internal/_curry1":109}],308:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Takes a function `fn`, which takes a single array argument, and returns a
 * function which:
 *
 *   - takes any number of positional arguments;
 *   - passes these arguments to `fn` as an array; and
 *   - returns the result.
 *
 * In other words, `R.unapply` derives a variadic function from a function which
 * takes an array. `R.unapply` is the inverse of [`R.apply`](#apply).
 *
 * @func
 * @memberOf R
 * @since v0.8.0
 * @category Function
 * @sig ([*...] -> a) -> (*... -> a)
 * @param {Function} fn
 * @return {Function}
 * @see R.apply
 * @example
 *
 *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
 * @symb R.unapply(f)(a, b) = f([a, b])
 */


var unapply =
/*#__PURE__*/
_curry1(function unapply(fn) {
  return function () {
    return fn(Array.prototype.slice.call(arguments, 0));
  };
});

module.exports = unapply;
},{"./internal/_curry1":109}],309:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var nAry =
/*#__PURE__*/
require("./nAry");
/**
 * Wraps a function of any arity (including nullary) in a function that accepts
 * exactly 1 parameter. Any extraneous parameters will not be passed to the
 * supplied function.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Function
 * @sig (* -> b) -> (a -> b)
 * @param {Function} fn The function to wrap.
 * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
 *         arity 1.
 * @see R.binary, R.nAry
 * @example
 *
 *      const takesTwoArgs = function(a, b) {
 *        return [a, b];
 *      };
 *      takesTwoArgs.length; //=> 2
 *      takesTwoArgs(1, 2); //=> [1, 2]
 *
 *      const takesOneArg = R.unary(takesTwoArgs);
 *      takesOneArg.length; //=> 1
 *      // Only 1 argument is passed to the wrapped function
 *      takesOneArg(1, 2); //=> [1, undefined]
 * @symb R.unary(f)(a, b, c) = f(a)
 */


var unary =
/*#__PURE__*/
_curry1(function unary(fn) {
  return nAry(1, fn);
});

module.exports = unary;
},{"./internal/_curry1":109,"./nAry":221}],310:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Returns a function of arity `n` from a (manually) curried function.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Function
 * @sig Number -> (a -> b) -> (a -> c)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to uncurry.
 * @return {Function} A new function.
 * @see R.curry
 * @example
 *
 *      const addFour = a => b => c => d => a + b + c + d;
 *
 *      const uncurriedAddFour = R.uncurryN(4, addFour);
 *      uncurriedAddFour(1, 2, 3, 4); //=> 10
 */


var uncurryN =
/*#__PURE__*/
_curry2(function uncurryN(depth, fn) {
  return curryN(depth, function () {
    var currentDepth = 1;
    var value = fn;
    var idx = 0;
    var endIdx;

    while (currentDepth <= depth && typeof value === 'function') {
      endIdx = currentDepth === depth ? arguments.length : idx + value.length;
      value = value.apply(this, Array.prototype.slice.call(arguments, idx, endIdx));
      currentDepth += 1;
      idx = endIdx;
    }

    return value;
  });
});

module.exports = uncurryN;
},{"./curryN":46,"./internal/_curry2":110}],311:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Builds a list from a seed value. Accepts an iterator function, which returns
 * either false to stop iteration or an array of length 2 containing the value
 * to add to the resulting list and the seed to be used in the next call to the
 * iterator function.
 *
 * The iterator function receives one argument: *(seed)*.
 *
 * @func
 * @memberOf R
 * @since v0.10.0
 * @category List
 * @sig (a -> [b]) -> * -> [b]
 * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
 *        either false to quit iteration or an array of length two to proceed. The element
 *        at index 0 of this array will be added to the resulting array, and the element
 *        at index 1 will be passed to the next call to `fn`.
 * @param {*} seed The seed value.
 * @return {Array} The final list.
 * @example
 *
 *      const f = n => n > 50 ? false : [-n, n + 10];
 *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
 * @symb R.unfold(f, x) = [f(x)[0], f(f(x)[1])[0], f(f(f(x)[1])[1])[0], ...]
 */


var unfold =
/*#__PURE__*/
_curry2(function unfold(fn, seed) {
  var pair = fn(seed);
  var result = [];

  while (pair && pair.length) {
    result[result.length] = pair[0];
    pair = fn(pair[1]);
  }

  return result;
});

module.exports = unfold;
},{"./internal/_curry2":110}],312:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var compose =
/*#__PURE__*/
require("./compose");

var uniq =
/*#__PURE__*/
require("./uniq");
/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig [*] -> [*] -> [*]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @example
 *
 *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
 */


var union =
/*#__PURE__*/
_curry2(
/*#__PURE__*/
compose(uniq, _concat));

module.exports = union;
},{"./compose":34,"./internal/_concat":107,"./internal/_curry2":110,"./uniq":314}],313:[function(require,module,exports){
var _concat =
/*#__PURE__*/
require("./internal/_concat");

var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var uniqWith =
/*#__PURE__*/
require("./uniqWith");
/**
 * Combines two lists into a set (i.e. no duplicates) composed of the elements
 * of each list. Duplication is determined according to the value returned by
 * applying the supplied predicate to two list elements.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Relation
 * @sig ((a, a) -> Boolean) -> [*] -> [*] -> [*]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list1 The first list.
 * @param {Array} list2 The second list.
 * @return {Array} The first and second lists concatenated, with
 *         duplicates removed.
 * @see R.union
 * @example
 *
 *      const l1 = [{a: 1}, {a: 2}];
 *      const l2 = [{a: 1}, {a: 4}];
 *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
 */


var unionWith =
/*#__PURE__*/
_curry3(function unionWith(pred, list1, list2) {
  return uniqWith(pred, _concat(list1, list2));
});

module.exports = unionWith;
},{"./internal/_concat":107,"./internal/_curry3":111,"./uniqWith":316}],314:[function(require,module,exports){
var identity =
/*#__PURE__*/
require("./identity");

var uniqBy =
/*#__PURE__*/
require("./uniqBy");
/**
 * Returns a new list containing only one copy of each element in the original
 * list. [`R.equals`](#equals) is used to determine equality.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [a]
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
 *      R.uniq([1, '1']);     //=> [1, '1']
 *      R.uniq([[42], [42]]); //=> [[42]]
 */


var uniq =
/*#__PURE__*/
uniqBy(identity);
module.exports = uniq;
},{"./identity":87,"./uniqBy":315}],315:[function(require,module,exports){
var _Set =
/*#__PURE__*/
require("./internal/_Set");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied function to
 * each list element. Prefers the first item if the supplied function produces
 * the same value on two items. [`R.equals`](#equals) is used for comparison.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category List
 * @sig (a -> b) -> [a] -> [a]
 * @param {Function} fn A function used to produce a value to use during comparisons.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
 */


var uniqBy =
/*#__PURE__*/
_curry2(function uniqBy(fn, list) {
  var set = new _Set();
  var result = [];
  var idx = 0;
  var appliedItem, item;

  while (idx < list.length) {
    item = list[idx];
    appliedItem = fn(item);

    if (set.add(appliedItem)) {
      result.push(item);
    }

    idx += 1;
  }

  return result;
});

module.exports = uniqBy;
},{"./internal/_Set":98,"./internal/_curry2":110}],316:[function(require,module,exports){
var _includesWith =
/*#__PURE__*/
require("./internal/_includesWith");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Returns a new list containing only one copy of each element in the original
 * list, based upon the value returned by applying the supplied predicate to
 * two list elements. Prefers the first item if two items compare equal based
 * on the predicate.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category List
 * @sig ((a, a) -> Boolean) -> [a] -> [a]
 * @param {Function} pred A predicate used to test whether two items are equal.
 * @param {Array} list The array to consider.
 * @return {Array} The list of unique items.
 * @example
 *
 *      const strEq = R.eqBy(String);
 *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
 *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
 *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
 *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
 */


var uniqWith =
/*#__PURE__*/
_curry2(function uniqWith(pred, list) {
  var idx = 0;
  var len = list.length;
  var result = [];
  var item;

  while (idx < len) {
    item = list[idx];

    if (!_includesWith(pred, item, result)) {
      result[result.length] = item;
    }

    idx += 1;
  }

  return result;
});

module.exports = uniqWith;
},{"./internal/_curry2":110,"./internal/_includesWith":124}],317:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is not satisfied, the function will return the result of
 * calling the `whenFalseFn` function with the same argument. If the predicate
 * is satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred        A predicate function
 * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
 *                               to a falsy value.
 * @param {*}        x           An object to test with the `pred` function and
 *                               pass to `whenFalseFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
 * @see R.ifElse, R.when, R.cond
 * @example
 *
 *      let safeInc = R.unless(R.isNil, R.inc);
 *      safeInc(null); //=> null
 *      safeInc(1); //=> 2
 */


var unless =
/*#__PURE__*/
_curry3(function unless(pred, whenFalseFn, x) {
  return pred(x) ? x : whenFalseFn(x);
});

module.exports = unless;
},{"./internal/_curry3":111}],318:[function(require,module,exports){
var _identity =
/*#__PURE__*/
require("./internal/_identity");

var chain =
/*#__PURE__*/
require("./chain");
/**
 * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
 * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig Chain c => c (c a) -> c a
 * @param {*} list
 * @return {*}
 * @see R.flatten, R.chain
 * @example
 *
 *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
 *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
 */


var unnest =
/*#__PURE__*/
chain(_identity);
module.exports = unnest;
},{"./chain":29,"./internal/_identity":122}],319:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Takes a predicate, a transformation function, and an initial value,
 * and returns a value of the same type as the initial value.
 * It does so by applying the transformation until the predicate is satisfied,
 * at which point it returns the satisfactory value.
 *
 * @func
 * @memberOf R
 * @since v0.20.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred A predicate function
 * @param {Function} fn The iterator function
 * @param {*} init Initial value
 * @return {*} Final value that satisfies predicate
 * @example
 *
 *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
 */


var until =
/*#__PURE__*/
_curry3(function until(pred, fn, init) {
  var val = init;

  while (!pred(val)) {
    val = fn(val);
  }

  return val;
});

module.exports = until;
},{"./internal/_curry3":111}],320:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");

var adjust =
/*#__PURE__*/
require("./adjust");

var always =
/*#__PURE__*/
require("./always");
/**
 * Returns a new copy of the array with the element at the provided index
 * replaced with the given value.
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category List
 * @sig Number -> a -> [a] -> [a]
 * @param {Number} idx The index to update.
 * @param {*} x The value to exist at the given index of the returned array.
 * @param {Array|Arguments} list The source array-like object to be updated.
 * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
 * @see R.adjust
 * @example
 *
 *      R.update(1, '_', ['a', 'b', 'c']);      //=> ['a', '_', 'c']
 *      R.update(-1, '_', ['a', 'b', 'c']);     //=> ['a', 'b', '_']
 * @symb R.update(-1, a, [b, c]) = [b, a]
 * @symb R.update(0, a, [b, c]) = [a, c]
 * @symb R.update(1, a, [b, c]) = [b, a]
 */


var update =
/*#__PURE__*/
_curry3(function update(idx, x, list) {
  return adjust(idx, always(x), list);
});

module.exports = update;
},{"./adjust":8,"./always":11,"./internal/_curry3":111}],321:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var curryN =
/*#__PURE__*/
require("./curryN");
/**
 * Accepts a function `fn` and a list of transformer functions and returns a
 * new curried function. When the new function is invoked, it calls the
 * function `fn` with parameters consisting of the result of calling each
 * supplied handler on successive arguments to the new function.
 *
 * If more arguments are passed to the returned function than transformer
 * functions, those arguments are passed directly to `fn` as additional
 * parameters. If you expect additional arguments that don't need to be
 * transformed, although you can ignore them, it's best to pass an identity
 * function so that the new function reports the correct arity.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig ((x1, x2, ...) -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
 * @param {Function} fn The function to wrap.
 * @param {Array} transformers A list of transformer functions
 * @return {Function} The wrapped function.
 * @see R.converge
 * @example
 *
 *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
 *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
 *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
 *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
 * @symb R.useWith(f, [g, h])(a, b) = f(g(a), h(b))
 */


var useWith =
/*#__PURE__*/
_curry2(function useWith(fn, transformers) {
  return curryN(transformers.length, function () {
    var args = [];
    var idx = 0;

    while (idx < transformers.length) {
      args.push(transformers[idx].call(this, arguments[idx]));
      idx += 1;
    }

    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, transformers.length)));
  });
});

module.exports = useWith;
},{"./curryN":46,"./internal/_curry2":110}],322:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");

var keys =
/*#__PURE__*/
require("./keys");
/**
 * Returns a list of all the enumerable own properties of the supplied object.
 * Note that the order of the output array is not guaranteed across different
 * JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own properties.
 * @see R.valuesIn, R.keys
 * @example
 *
 *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
 */


var values =
/*#__PURE__*/
_curry1(function values(obj) {
  var props = keys(obj);
  var len = props.length;
  var vals = [];
  var idx = 0;

  while (idx < len) {
    vals[idx] = obj[props[idx]];
    idx += 1;
  }

  return vals;
});

module.exports = values;
},{"./internal/_curry1":109,"./keys":182}],323:[function(require,module,exports){
var _curry1 =
/*#__PURE__*/
require("./internal/_curry1");
/**
 * Returns a list of all the properties, including prototype properties, of the
 * supplied object.
 * Note that the order of the output array is not guaranteed to be consistent
 * across different JS platforms.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @sig {k: v} -> [v]
 * @param {Object} obj The object to extract values from
 * @return {Array} An array of the values of the object's own and prototype properties.
 * @see R.values, R.keysIn
 * @example
 *
 *      const F = function() { this.x = 'X'; };
 *      F.prototype.y = 'Y';
 *      const f = new F();
 *      R.valuesIn(f); //=> ['X', 'Y']
 */


var valuesIn =
/*#__PURE__*/
_curry1(function valuesIn(obj) {
  var prop;
  var vs = [];

  for (prop in obj) {
    vs[vs.length] = obj[prop];
  }

  return vs;
});

module.exports = valuesIn;
},{"./internal/_curry1":109}],324:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2"); // `Const` is a functor that effectively ignores the function given to `map`.


var Const = function (x) {
  return {
    value: x,
    'fantasy-land/map': function () {
      return this;
    }
  };
};
/**
 * Returns a "view" of the given data structure, determined by the given lens.
 * The lens's focus determines which portion of the data structure is visible.
 *
 * @func
 * @memberOf R
 * @since v0.16.0
 * @category Object
 * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
 * @sig Lens s a -> s -> a
 * @param {Lens} lens
 * @param {*} x
 * @return {*}
 * @see R.prop, R.lensIndex, R.lensProp
 * @example
 *
 *      const xLens = R.lensProp('x');
 *
 *      R.view(xLens, {x: 1, y: 2});  //=> 1
 *      R.view(xLens, {x: 4, y: 2});  //=> 4
 */


var view =
/*#__PURE__*/
_curry2(function view(lens, x) {
  // Using `Const` effectively ignores the setter function of the `lens`,
  // leaving the value returned by the getter function unmodified.
  return lens(Const)(x).value;
});

module.exports = view;
},{"./internal/_curry2":110}],325:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Tests the final argument by passing it to the given predicate function. If
 * the predicate is satisfied, the function will return the result of calling
 * the `whenTrueFn` function with the same argument. If the predicate is not
 * satisfied, the argument is returned as is.
 *
 * @func
 * @memberOf R
 * @since v0.18.0
 * @category Logic
 * @sig (a -> Boolean) -> (a -> a) -> a -> a
 * @param {Function} pred       A predicate function
 * @param {Function} whenTrueFn A function to invoke when the `condition`
 *                              evaluates to a truthy value.
 * @param {*}        x          An object to test with the `pred` function and
 *                              pass to `whenTrueFn` if necessary.
 * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
 * @see R.ifElse, R.unless, R.cond
 * @example
 *
 *      // truncate :: String -> String
 *      const truncate = R.when(
 *        R.propSatisfies(R.gt(R.__, 10), 'length'),
 *        R.pipe(R.take(10), R.append('…'), R.join(''))
 *      );
 *      truncate('12345');         //=> '12345'
 *      truncate('0123456789ABC'); //=> '0123456789…'
 */


var when =
/*#__PURE__*/
_curry3(function when(pred, whenTrueFn, x) {
  return pred(x) ? whenTrueFn(x) : x;
});

module.exports = when;
},{"./internal/_curry3":111}],326:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var _has =
/*#__PURE__*/
require("./internal/_has");
/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec. Each of the spec's own properties must be a predicate function.
 * Each predicate is applied to the value of the corresponding property of the
 * test object. `where` returns true if all the predicates return true, false
 * otherwise.
 *
 * `where` is well suited to declaratively expressing constraints for other
 * functions such as [`filter`](#filter) and [`find`](#find).
 *
 * @func
 * @memberOf R
 * @since v0.1.1
 * @category Object
 * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propSatisfies, R.whereEq
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.where({
 *        a: R.equals('foo'),
 *        b: R.complement(R.equals('bar')),
 *        x: R.gt(R.__, 10),
 *        y: R.lt(R.__, 20)
 *      });
 *
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
 *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
 *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
 */


var where =
/*#__PURE__*/
_curry2(function where(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
      return false;
    }
  }

  return true;
});

module.exports = where;
},{"./internal/_curry2":110,"./internal/_has":121}],327:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var equals =
/*#__PURE__*/
require("./equals");

var map =
/*#__PURE__*/
require("./map");

var where =
/*#__PURE__*/
require("./where");
/**
 * Takes a spec object and a test object; returns true if the test satisfies
 * the spec, false otherwise. An object satisfies the spec if, for each of the
 * spec's own properties, accessing that property of the object gives the same
 * value (in [`R.equals`](#equals) terms) as accessing that property of the
 * spec.
 *
 * `whereEq` is a specialization of [`where`](#where).
 *
 * @func
 * @memberOf R
 * @since v0.14.0
 * @category Object
 * @sig {String: *} -> {String: *} -> Boolean
 * @param {Object} spec
 * @param {Object} testObj
 * @return {Boolean}
 * @see R.propEq, R.where
 * @example
 *
 *      // pred :: Object -> Boolean
 *      const pred = R.whereEq({a: 1, b: 2});
 *
 *      pred({a: 1});              //=> false
 *      pred({a: 1, b: 2});        //=> true
 *      pred({a: 1, b: 2, c: 3});  //=> true
 *      pred({a: 1, b: 1});        //=> false
 */


var whereEq =
/*#__PURE__*/
_curry2(function whereEq(spec, testObj) {
  return where(map(equals, spec), testObj);
});

module.exports = whereEq;
},{"./equals":66,"./internal/_curry2":110,"./map":195,"./where":326}],328:[function(require,module,exports){
var _includes =
/*#__PURE__*/
require("./internal/_includes");

var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");

var flip =
/*#__PURE__*/
require("./flip");

var reject =
/*#__PURE__*/
require("./reject");
/**
 * Returns a new list without values in the first argument.
 * [`R.equals`](#equals) is used to determine equality.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @sig [a] -> [a] -> [a]
 * @param {Array} list1 The values to be removed from `list2`.
 * @param {Array} list2 The array to remove values from.
 * @return {Array} The new array without values in `list1`.
 * @see R.transduce, R.difference, R.remove
 * @example
 *
 *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
 */


var without =
/*#__PURE__*/
_curry2(function (xs, list) {
  return reject(flip(_includes)(xs), list);
});

module.exports = without;
},{"./flip":74,"./internal/_curry2":110,"./internal/_includes":123,"./reject":267}],329:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Exclusive disjunction logical operation.
 * Returns `true` if one of the arguments is truthy and the other is falsy.
 * Otherwise, it returns `false`.
 *
 * @func
 * @memberOf R
 * @since v0.27.0
 * @category Logic
 * @sig a -> b -> Boolean
 * @param {Any} a
 * @param {Any} b
 * @return {Boolean} true if one of the arguments is truthy and the other is falsy
 * @see R.or, R.and
 * @example
 *
 *      R.xor(true, true); //=> false
 *      R.xor(true, false); //=> true
 *      R.xor(false, true); //=> true
 *      R.xor(false, false); //=> false
 */


var xor =
/*#__PURE__*/
_curry2(function xor(a, b) {
  return Boolean(!a ^ !b);
});

module.exports = xor;
},{"./internal/_curry2":110}],330:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a new list out of the two supplied by creating each possible pair
 * from the lists.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} as The first list.
 * @param {Array} bs The second list.
 * @return {Array} The list made by combining each possible pair from
 *         `as` and `bs` into pairs (`[a, b]`).
 * @example
 *
 *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
 * @symb R.xprod([a, b], [c, d]) = [[a, c], [a, d], [b, c], [b, d]]
 */


var xprod =
/*#__PURE__*/
_curry2(function xprod(a, b) {
  // = xprodWith(prepend); (takes about 3 times as long...)
  var idx = 0;
  var ilen = a.length;
  var j;
  var jlen = b.length;
  var result = [];

  while (idx < ilen) {
    j = 0;

    while (j < jlen) {
      result[result.length] = [a[idx], b[j]];
      j += 1;
    }

    idx += 1;
  }

  return result;
});

module.exports = xprod;
},{"./internal/_curry2":110}],331:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a new list out of the two supplied by pairing up equally-positioned
 * items from both lists. The returned list is truncated to the length of the
 * shorter of the two input lists.
 * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig [a] -> [b] -> [[a,b]]
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
 * @example
 *
 *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
 * @symb R.zip([a, b, c], [d, e, f]) = [[a, d], [b, e], [c, f]]
 */


var zip =
/*#__PURE__*/
_curry2(function zip(a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = [a[idx], b[idx]];
    idx += 1;
  }

  return rv;
});

module.exports = zip;
},{"./internal/_curry2":110}],332:[function(require,module,exports){
var _curry2 =
/*#__PURE__*/
require("./internal/_curry2");
/**
 * Creates a new object out of a list of keys and a list of values.
 * Key/value pairing is truncated to the length of the shorter of the two lists.
 * Note: `zipObj` is equivalent to `pipe(zip, fromPairs)`.
 *
 * @func
 * @memberOf R
 * @since v0.3.0
 * @category List
 * @sig [String] -> [*] -> {String: *}
 * @param {Array} keys The array that will be properties on the output object.
 * @param {Array} values The list of values on the output object.
 * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
 * @example
 *
 *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
 */


var zipObj =
/*#__PURE__*/
_curry2(function zipObj(keys, values) {
  var idx = 0;
  var len = Math.min(keys.length, values.length);
  var out = {};

  while (idx < len) {
    out[keys[idx]] = values[idx];
    idx += 1;
  }

  return out;
});

module.exports = zipObj;
},{"./internal/_curry2":110}],333:[function(require,module,exports){
var _curry3 =
/*#__PURE__*/
require("./internal/_curry3");
/**
 * Creates a new list out of the two supplied by applying the function to each
 * equally-positioned pair in the lists. The returned list is truncated to the
 * length of the shorter of the two input lists.
 *
 * @function
 * @memberOf R
 * @since v0.1.0
 * @category List
 * @sig ((a, b) -> c) -> [a] -> [b] -> [c]
 * @param {Function} fn The function used to combine the two elements into one value.
 * @param {Array} list1 The first array to consider.
 * @param {Array} list2 The second array to consider.
 * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
 *         using `fn`.
 * @example
 *
 *      const f = (x, y) => {
 *        // ...
 *      };
 *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
 *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
 * @symb R.zipWith(fn, [a, b, c], [d, e, f]) = [fn(a, d), fn(b, e), fn(c, f)]
 */


var zipWith =
/*#__PURE__*/
_curry3(function zipWith(fn, a, b) {
  var rv = [];
  var idx = 0;
  var len = Math.min(a.length, b.length);

  while (idx < len) {
    rv[idx] = fn(a[idx], b[idx]);
    idx += 1;
  }

  return rv;
});

module.exports = zipWith;
},{"./internal/_curry3":111}]},{},[2]);
