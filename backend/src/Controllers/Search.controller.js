const {
  searchProducts
} = require("../Services/SearchService.js");

const search = async (req, res) => {

  try {

    const query = req.query.q || "";

    const data =
      await searchProducts(query);

    return res.status(200).json({

      success: true,

      query,

      count: data.products.length,

      suggestions: data.suggestions,

      products: data.products,
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

module.exports = {
  search,
};