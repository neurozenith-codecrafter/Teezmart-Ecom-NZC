const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../Models/ProductSchema"); // adjust path

const MONGO_URI = process.env.MONGO_URI_DUMMY;

// Match your constants
const CATEGORIES = ["tshirt", "trackpant"];

// Helper: slug generator
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Helper: random sizes
const getRandomSizes = () => {
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const count = faker.number.int({ min: 2, max: 5 });
  return faker.helpers.arrayElements(allSizes, count);
};

// Helper: ratings breakdown
const generateRatings = () => {
  const totalReviews = faker.number.int({ min: 0, max: 200 });

  let remaining = totalReviews;

  const breakdown = {
    1: faker.number.int({ min: 0, max: remaining }),
    2: faker.number.int({ min: 0, max: remaining }),
    3: faker.number.int({ min: 0, max: remaining }),
    4: faker.number.int({ min: 0, max: remaining }),
    5: faker.number.int({ min: 0, max: remaining }),
  };

  // Normalize so sum matches totalReviews
  const sum = Object.values(breakdown).reduce((a, b) => a + b, 0);

  if (sum > 0) {
    const factor = totalReviews / sum;
    for (let key in breakdown) {
      breakdown[key] = Math.floor(breakdown[key] * factor);
    }
  }

  const rating =
    totalReviews === 0
      ? 0
      : (
          (breakdown[1] * 1 +
            breakdown[2] * 2 +
            breakdown[3] * 3 +
            breakdown[4] * 4 +
            breakdown[5] * 5) /
          totalReviews
        ).toFixed(1);

  return {
    rating: Number(rating),
    numReviews: totalReviews,
    ratingsBreakdown: breakdown,
  };
};

// Generate one product
const generateProduct = () => {
  const title = faker.commerce.productName();
  const price = faker.number.int({ min: 300, max: 3000 });

  const hasDiscount = faker.datatype.boolean();
  const discountPrice = hasDiscount
    ? faker.number.int({ min: 200, max: price - 50 })
    : undefined;

  const imageCount = faker.number.int({ min: 2, max: 4 });

  const images = Array.from({ length: imageCount }).map(() => ({
    url: faker.image.url({ category: "fashion" }),
    public_id: `products/${faker.string.alphanumeric(10)}`,
  }));

  const { rating, numReviews, ratingsBreakdown } = generateRatings();

  const createdAt = faker.date.between({
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // 🔥 NEW
  const sizes = getRandomSizes();
  const stock = generateStock(sizes);

  return {
    title,
    slug: slugify(title + "-" + faker.string.alphanumeric(5)),
    description: faker.commerce.productDescription(),
    price,
    discountPrice,
    category: faker.helpers.arrayElement(CATEGORIES),
    images,
    sizes: getRandomSizes(),
    stock, // ✅ added
    salesCount: faker.number.int({ min: 0, max: 500 }),
    rating,
    numReviews,
    ratingsBreakdown,
    createdAt,
    updatedAt: createdAt,
  };
};

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await Product.deleteMany();

    const products = Array.from({ length: 50 }).map(() => generateProduct());

    await Product.insertMany(products);

    console.log("✅ 50 Products Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
