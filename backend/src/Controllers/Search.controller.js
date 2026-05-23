const {
  searchProducts
} = require("../Services/SearchService.js");

const {
  getSuggestions
} = require("../Services/SearchService.js");


const search = async (req, res) => {

  try {

    const query = req.query.q || "";

    const products =
      await searchProducts(query);

    return res.status(200).json({

      success: true,

      query,

      count: products.length,

      products,
    });

  } catch (error) {

    console.error(
      "Search Controller Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Search failed",
    });
  }
};


const suggestions = async (req, res) => {

  try {

    const query = req.query.q || "";

    const suggestions =
      await getSuggestions(query);

    return res.status(200).json({

      success: true,

      query,

      suggestions,
    });

  } catch (error) {

    console.error(
      "Suggestions Controller Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Suggestions failed",
    });
  }
};


module.exports = {
  search,
  suggestions,
};