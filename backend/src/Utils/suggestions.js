const normalize = require("./normalize");

const generateSuggestions = (
  results,
  query
) => {

  const suggestions = [];

  const addedProducts = new Set();

  const addedQueries = new Set();

  for (const result of results) {

    const product = result.item;

    if (
      !addedProducts.has(product.slug)
    ) {

      suggestions.push({

        type: "product",

        label: product.title,

        slug: product.slug,

        image: product.image
      });

      addedProducts.add(product.slug);
    }

    const words = normalize(
      product.title
    ).split(" ");

    for (const word of words) {

      if (
        word.startsWith(query) &&
        !addedQueries.has(word) &&
        word.length > 2
      ) {

        suggestions.push({

          type: "query",

          label: word
        });

        addedQueries.add(word);
      }
    }
  }

  return suggestions.slice(0, 8);
};

module.exports = {
  generateSuggestions
};