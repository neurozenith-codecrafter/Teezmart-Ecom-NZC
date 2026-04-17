const { getFilteredProducts } = require("../../Services/productService");

const filterProductsController = async (req, res) => {
  try {
    const {
      collection = "all",
      sizes,
      sort = "new",
    } = req.query;

    const result = await getFilteredProducts({
      collection,
      sizes,
      sort,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Filter Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch filtered products",
    });
  }
};

module.exports = { filterProductsController };
