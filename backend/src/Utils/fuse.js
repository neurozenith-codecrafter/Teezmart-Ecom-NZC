const Fuse = require("fuse.js");
const normalize = require("./normalize");

let fuseInstance = null;

const createFuseInstance = (products) => {

  const searchableProducts = products.map(product => ({
    ...product,

    normalizedTitle: normalize(product.title),

    normalizedCategory: normalize(product.category),

    normalizedDescription: normalize(product.description),

    normalizedSizes: product.sizes?.map(size =>
      normalize(size)
    ),

    normalizedSlug: normalize(product.slug)
  }));

  fuseInstance = new Fuse(searchableProducts, {

    includeScore: true,

    shouldSort: true,

    ignoreLocation: true,

    findAllMatches: true,

    minMatchCharLength: 2,

    threshold: 0.3,

    distance: 100,

    useExtendedSearch: true,

    keys: [

      {
        name: "normalizedTitle",
        weight: 0.5
      },

      {
        name: "normalizedCategory",
        weight: 0.2
      },

      {
        name: "normalizedDescription",
        weight: 0.15
      },

      {
        name: "normalizedSlug",
        weight: 0.1
      },

      {
        name: "normalizedSizes",
        weight: 0.05
      }
    ]
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
  getFuse
};