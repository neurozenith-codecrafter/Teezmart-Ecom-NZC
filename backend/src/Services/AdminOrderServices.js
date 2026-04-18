const Order = require("../Models/OrderSchema");

exports.getAllOrders = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filter = (query.filter || "all").toLowerCase();

  // Debug: confirm filter is reaching the service
  console.log(`[AdminOrders] filter=${filter} page=${page}`);
  let mongoFilter = {};
  let sort = { createdAt: -1 }; // default: newest first

  if (filter === "recent") {
    // Orders placed in the last 7 days, newest first
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    mongoFilter = { createdAt: { $gte: sevenDaysAgo } };
    sort = { createdAt: -1 };
  } else if (filter === "high-value") {
    // Orders with total >= ₹1000, highest first
    mongoFilter = { "pricing.total": { $gte: 1000 } };
    sort = { "pricing.total": -1 };
  }
  // "all" keeps empty filter + createdAt desc

  const [orders, totalOrders] = await Promise.all([
    Order.find(mongoFilter)
      .sort(sort)
      .populate("user", "name email")
      .populate("items.product", "title price images category")
      .skip(skip)
      .limit(limit),
    // Use the same filter so pagination totals are accurate per view
    Order.countDocuments(mongoFilter),
  ]);

  return {
    orders,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit) || 1,
  };
};
