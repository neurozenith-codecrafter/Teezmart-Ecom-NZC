const orderService = require("../Services/OrderServices");
const { isAddressValidationErrorMessage } = require("../Utils/validation");

const getUserId = (req) => req.user?._id || req.user?.id;

const isAdminUser = (req) =>
  req.user?.role === "admin" || req.user?.role === "devAdmin";

const getErrorStatusCode = (error) => {
  if (
    error.name === "ValidationError" ||
    error.message?.startsWith("Invalid ") ||
    error.message?.startsWith("Quantity must be greater than 0") ||
    error.message?.startsWith("Each item must be an object") ||
    error.message?.startsWith("Selected size not available") ||
    isAddressValidationErrorMessage(error.message) ||
    error.message === "At least one item is required" ||
    error.message === "Invalid order status" ||
    error.message === "Order status cannot move backwards"
  ) {
    return 400;
  }

  if (
    error.message === "Unauthorized" ||
    error.message === "User is required to place an order" ||
    error.message === "User is required"
  ) {
    return 401;
  }

  if (
    error.message === "Order not found" ||
    error.message === "Cart not found" ||
    error.message === "Product not found" ||
    error.message?.startsWith("Product not found:")
  ) {
    return 404;
  }

  if (error.message?.startsWith("Insufficient stock")) {
    return 409;
  }

  return 500;
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, items, buyNowItem } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    const order = await orderService.createOrder(userId, {
      shippingAddress,
      items,
      buyNowItem
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const orders = await orderService.getMyOrders(userId);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to fetch orders"
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    const userId = String(getUserId(req) || "");
    const orderUserId = String(order.user?._id || order.user || "");

    if (!isAdminUser(req) && userId !== orderUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to fetch order"
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    if (!isAdminUser(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(getErrorStatusCode(error)).json({
      success: false,
      message: error.message || "Failed to update order status"
    });
  }
};
