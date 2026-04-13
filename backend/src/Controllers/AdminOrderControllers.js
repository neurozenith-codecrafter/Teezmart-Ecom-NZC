const orderService = require("../Services/AdminOrderServices");

exports.getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: result.orders,
      totalOrders: result.totalOrders,
      currentPage: result.currentPage,
      totalPages: result.totalPages
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};