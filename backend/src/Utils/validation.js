const mongoose = require("mongoose");

const ensureValidObjectId = (id, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

module.exports = {
  ensureValidObjectId,
};
