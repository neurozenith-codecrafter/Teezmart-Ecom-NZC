const Order = require("../Models/OrderSchema");

exports.getAllOrders = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  // Query execution
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("items.product", "name price image") // latest first
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments(filter);

  return {
    orders,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
  };
};
