const normalize = (text = "") => {
  return text
    .toString()
    .toLowerCase()
    .trim()

    // Split accented characters
    .normalize("NFD")

    // Remove accents
    .replace(/[\u0300-\u036f]/g, "")

    // Remove special characters
    .replace(/[^\w\s]/g, " ")

    // Remove extra spaces
    .replace(/\s+/g, " ");
};

module.exports = normalize;