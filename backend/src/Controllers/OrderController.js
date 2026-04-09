const orderService = require("../services/order.service");

exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    const order = await orderService.createOrder(
      req.user._id,
      shippingAddress
    );

    res.status(201).json({
      success: true,
      order
    });

    // Expected request body format:

    // {
    //   "shippingAddress": {
    //     "fullName": "abcdefg",
    //     "phone": "9876543210",
    //     "addressLine": "123 Street",
    //     "city": "Erode",
    //     "state": "Tamil Nadu",
    //     "postalCode": "638001",
    //     "country": "India"
    //   }
    // }

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};