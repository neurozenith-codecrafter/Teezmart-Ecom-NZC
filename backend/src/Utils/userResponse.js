const buildSafeUser = (user) => {
  const wishlist = Array.isArray(user?.wishlist) ? user.wishlist : [];

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role,
    addresses: user.addresses || [],
    wishlist,
    wishlistCount: wishlist.length,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  buildSafeUser,
};
