const Fuse = require("fuse.js");
const normalize = require("./normalize");

let fuseInstance = null;

const buildSearchableText = (product) => {
  return normalize(`
    ${product.title}
    ${product.category}
    ${product.description}
    ${product.slug}
    ${product.sizes?.join(" ")}
  `);
};

const createFuseInstance = (products) => {
  const searchableProducts = products.map((product) => ({
    ...product,

    searchableText: buildSearchableText(product),

    normalizedTitle: normalize(product.title),

    normalizedCategory: normalize(product.category),

    normalizedSlug: normalize(product.slug),
  }));

  fuseInstance = new Fuse(searchableProducts, {
    includeScore: true,

    shouldSort: true,

    ignoreLocation: true,

    findAllMatches: true,

    minMatchCharLength: 2,

    threshold: 0.35,

    distance: 100,

    keys: [
      {
        name: "normalizedTitle",
        weight: 0.5,
      },

      {
        name: "searchableText",
        weight: 0.35,
      },

      {
        name: "normalizedCategory",
        weight: 0.1,
      },

      {
        name: "normalizedSlug",
        weight: 0.05,
      },
    ],
  });

  return fuseInstance;
};

const getFuse = () => {
  if (!fuseInstance) {
    throw new Error("Fuse instance not initialized");
  }

  return fuseInstance;
};

module.exports = {
  createFuseInstance,
  getFuse,
};
