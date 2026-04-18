const orderService = require("../Services/AdminOrderServices");
const Order = require("../Models/OrderSchema");
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
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${ORDER_STATUSES.join(", ")}`
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;

    // Auto-set timestamps
    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

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
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};