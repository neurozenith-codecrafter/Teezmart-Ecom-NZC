const Order = require("../Models/OrderSchema");

exports.getAllOrders = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;


  // Query execution
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("items.product", "title price images category") // latest first
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments();

  return {
    orders,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
  };
};
