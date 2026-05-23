const { searchProducts } = require("../Services/SearchService.js");

const search = async (req, res) => {
  try {
    const query = req.query.q;

    if (!req.query.q?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query required",
      });
    }

    const products = await searchProducts(query);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  search,
};
