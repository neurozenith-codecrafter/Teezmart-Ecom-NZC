const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Order = require("../Models/OrderSchema");

const MONGO_URI = process.env.MONGO_URI_DUMMY;

const ORDER_STATUSES = ["order placed", "shipped", "delivered", "cancelled"];

const PAYMENT_STATUSES = ["pending", "paid", "failed"];

// Generate random order
const generateOrder = (userId) => {
  const itemCount = faker.number.int({ min: 1, max: 3 });

  const items = Array.from({ length: itemCount }).map(() => {
    const price = faker.number.int({ min: 300, max: 2000 });
    const quantity = faker.number.int({ min: 1, max: 2 });

    return {
      product: new mongoose.Types.ObjectId(),
      name: faker.commerce.productName(),
      image: faker.image.url(),
      price,
      size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
      quantity,
    };
  });

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingFee = faker.helpers.arrayElement([0, 50]);
  const total = subtotal + shippingFee;

  const status = faker.helpers.arrayElement(ORDER_STATUSES);
  const paymentStatus = faker.helpers.arrayElement(PAYMENT_STATUSES);

  const createdAt = faker.date.between({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const updatedAt = new Date(
    createdAt.getTime() + faker.number.int({ min: 0, max: 5 }) * 86400000,
  );

  return {
    user: userId,

    items,

    shippingAddress: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number("9#########"),
      addressLine1: faker.location.buildingNumber(),
      addressLine2: faker.location.streetAddress(),
      landmark: faker.helpers.maybe(() => faker.location.secondaryAddress(), {
        probability: 0.35,
      }),
      city: faker.location.city(),
      state: "Tamil Nadu",
      pincode: faker.location.zipCode("6#####"),
      country: "India",
    },

    status,

    payment: {
      method: "razorpay",
      status: paymentStatus,
      razorpayOrderId:
        paymentStatus === "paid" ? faker.string.alphanumeric(10) : undefined,
      razorpayPaymentId:
        paymentStatus === "paid" ? faker.string.alphanumeric(10) : undefined,
    },

    shippedAt:
      status === "shipped" || status === "delivered"
        ? faker.date.recent({ days: 10 })
        : null,

    deliveredAt: status === "delivered" ? faker.date.recent({ days: 5 }) : null,

    pricing: {
      subtotal,
      shippingFee,
      total,
    },

    createdAt,
    updatedAt,
  };
};

const seedOrders = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await Order.deleteMany();

    const userId = new mongoose.Types.ObjectId(); // single user

    const orders = Array.from({ length: 100 }).map(() => generateOrder(userId));

    await Order.insertMany(orders);

    console.log("✅ 100 Random Orders Inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedOrders();
