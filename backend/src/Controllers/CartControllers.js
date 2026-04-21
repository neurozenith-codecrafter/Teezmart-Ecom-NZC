const cartService = require("../Services/cartServices");

const getCartErrorStatus = (error) =>
  error.message?.startsWith("Insufficient stock") ? 409 : 400;

exports.addItem = async (req, res) => {
  try {
    const cart = await cartService.addToCart(req.user.id, req.body);

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });

    // Frontend sample request:
    // axios.post(
    //   "/api/cart",
    //   {
    //     productId: "69cfd03fbdd201849c85b47a",
    //     quantity: 2,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   },
    // );

  } catch (error) {
    console.error("Add to Cart Error:", error);

    res.status(getCartErrorStatus(error)).json({
      success: false,
      message: error.message || "Failed to add to cart",
      data: null,
    });
  }
};

// cart.controller.js
exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart",
      data: null,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const cart = await cartService.updateCartItem(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    res.status(getCartErrorStatus(error)).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await cartService.removeItem(
      req.user.id,
      req.params.productId,
      req.query.size || req.body.size
    );

    res.json({
      success: true,
      message: "Item removed",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user.id);

    res.json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
