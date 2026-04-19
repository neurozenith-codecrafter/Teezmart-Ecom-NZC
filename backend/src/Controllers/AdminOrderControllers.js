const orderService = require("../Services/AdminOrderServices");
const { updateOrderStatus: updateOrderFulfillmentStatus } = require("../Services/OrderServices");
const { ORDER_STATUSES } = require("../Constants/constant");

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

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`
      });
    }

    const order = await updateOrderFulfillmentStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: {
        _id: order._id,
        status: order.status,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
      }
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    const statusCode =
      error.message === "Order not found"
        ? 404
        : [
            "Invalid order status",
            "Order status cannot move backwards",
            "Only paid orders can enter fulfillment flow",
            "Invalid fulfillment status transition",
            "Invalid order ID",
          ].includes(error.message)
          ? 400
          : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};
