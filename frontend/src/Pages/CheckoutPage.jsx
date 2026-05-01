import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Hooks/useAuth";
import Loader from "../components/Loader";
import { useCart } from "../Hooks/useCart";

// ─── Reusable Premium Components ──────────────────
const DEFAULT_ADDRESS_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  country: "India",
};

const PremiumInput = ({
  label,
  id,
  error,
  className = "",
  selectedAddressId,
  editMode,
  ...props
}) => (
  <div className={`flex flex-col space-y-1 w-full ${className}`}>
    <label
      htmlFor={id}
      className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-0.5"
    >
      {label}
    </label>
    <input
      id={id}
      {...props}
      name={props.name || id}
      disabled={Boolean(selectedAddressId) && !editMode}
      className={`w-full px-3.5 py-2.5 text-[13px] text-gray-800 bg-gray-50/50 border rounded-lg 
                  outline-none transition-all duration-200 ease-in-out
                  ${error ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5"}`}
    />
    {error && (
      <span className="text-[9px] font-medium text-red-500 ml-0.5 mt-0.5 italic">
        {error}
      </span>
    )}
  </div>
);

const AddressCard = ({ address, isSelected, onSelect, onEdit }) => (
  <div
    onClick={() => onSelect(address)}
    className={`relative group p-4 cursor-pointer border transition-all duration-300 rounded-xl 
                flex-shrink-0 w-[260px] md:w-full md:mb-3 snap-center
                ${isSelected ? "border-black bg-white shadow-lg shadow-black/5" : "border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-white"}`}
  >
    <div className="flex justify-between items-start mb-1.5">
      <div
        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors
                      ${isSelected ? "border-black" : "border-gray-200 group-hover:border-gray-300"}`}
      >
        {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(address);
        }}
        className="p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-md"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-3.5 h-3.5 text-gray-500"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
    <h4 className="font-bold text-gray-900 text-[13px] mb-0.5 truncate">
      {address.firstName} {address.lastName}
    </h4>
    <p className="text-gray-500 text-[11px] leading-relaxed truncate">
      {address.addressLine1}, {address.addressLine2}
    </p>
    <p className="text-gray-500 text-[11px] leading-relaxed">
      {address.city}, {address.state}, {address.pincode}.
    </p>
    <p className="mt-1.5 text-gray-900 font-semibold text-[10px] tracking-wide">
      {address.phone}
    </p>
  </div>
);

const CheckoutPage = () => {
  const { user, token } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  // const location = useLocation();
  // const cartItems = location.state?.cartItems;
  // const totalPrice = location.state?.totalPrice;

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState(DEFAULT_ADDRESS_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [editMode, setEditMode] = useState(false);

  // const [defaultAddress, setDefaultAddress] = useState(false);

  const [errors, setErrors] = useState({});

  const savedAddresses = user?.addresses || [];

  const handleSelectAddress = (addr, options = {}) => {
    const { enableEdit = false } = options;
    const isSameAddress = selectedAddressId === addr._id;

    setEditMode(enableEdit);

    if (isSameAddress && !enableEdit) {
      setSelectedAddressId(null);
      setForm(DEFAULT_ADDRESS_FORM);
    } else {
      setSelectedAddressId(addr._id);

      // ✅ map only required fields
      setForm({
        firstName: addr.firstName,
        lastName: addr.lastName,
        phone: addr.phone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2 || "",
        landmark: addr.landmark || "",
        pincode: addr.pincode,
        city: addr.city,
        state: addr.state,
        country: addr.country || "India",
      });
    }

    setErrors({});
  };

  const handleEditAddress = (addr) => {
    handleSelectAddress(addr, { enableEdit: true });
  };

  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setEditMode(true);
    setCheckoutError("");
    setErrors({});
    setForm(DEFAULT_ADDRESS_FORM);
  };

  const handleNext = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setCheckoutError("");

    if (!cartItems.length) {
      setCheckoutError("Your cart is empty. Add an item before checkout.");
      setIsLoading(false);
      return;
    }

    if (!selectedAddressId) {
      const newErrors = {};

      for (const [key, value] of Object.entries(form)) {
        if (!value && key !== "landmark") {
          newErrors[key] = "Required";
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);

        const firstErrorKey = Object.keys(newErrors)[0];
        document.querySelector(`[name="${firstErrorKey}"]`)?.focus();

        setIsLoading(false);
        return;
      }
    }

    setErrors({});

    const order = await handlePlaceOrder();

    if (!order) {
      setIsLoading(false);
      return;
    }

    // 🔥 DO NOT set loading false here
    // Navigate immediately
    navigate(`/payment/${order._id}`);
  };

  const handlePlaceOrder = async () => {
    try {
      let finalAddress;

      if (selectedAddressId && editMode) {
        const updatedAddressRes = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}/address`,
          { ...form, _id: selectedAddressId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const updatedUser = updatedAddressRes.data?.data;
        finalAddress = updatedUser?.addresses?.find(
          (addr) => addr._id === selectedAddressId,
        ) || { ...form, _id: selectedAddressId };
      } else if (selectedAddressId) {
        finalAddress = user.addresses.find(
          (addr) => addr._id === selectedAddressId,
        );
      } else {
        finalAddress = form;

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}/address`,
          form,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      const formattedItems = cartItems.map((item) => ({
        productId: item.product?._id || item.product,
        quantity: item.quantity,
        size: item.size,
      }));

      if (formattedItems.some((item) => !item.productId)) {
        throw new Error("One or more cart items are no longer available.");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/`,
        {
          shippingAddress: finalAddress,
          items: formattedItems,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return res.data?.order;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to create order. Please try again.";

      setCheckoutError(message);
      console.error("Order failed:", err.response?.data || err.message);
      return null;
    }
  };

  const handleBack = () => {
    navigate("/cart", { state: { from: "checkout" }, replace: true });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white pb-16">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <Loader />
        </div>
      )}

      <div className="max-w-[1000px] mx-auto px-6 pt-8">
        {/* --- REFINED HEADER: Back Button beside Title --- */}
        <div className="mb-10">
          <div className="flex items-center space-x-1 -ml-2">
            <button
              onClick={handleBack}
              className="p-2 text-gray-800 hover:text-black transition-colors focus:outline-none"
              aria-label="Go back"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 19L8 12L15 5" />
              </svg>
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Checkout
            </h1>
          </div>
          <div className="w-8 h-1 bg-black mt-1 ml-9 rounded-full" />{" "}
          {/* Aligned bar with text */}
        </div>

        <div className="relative">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="order-1 lg:order-2 lg:col-span-5">
              <h2 className="text-[14px] font-bold mb-4 lg:mb-6 text-gray-800">
                Saved Addresses
              </h2>
              <div className="flex flex-row overflow-x-auto gap-4 pb-4 snap-x custom-scrollbar lg:flex-col lg:max-h-[450px] lg:overflow-y-auto lg:pr-2">
                {savedAddresses.map((addr) => (
                  <AddressCard
                    setEditMode={setEditMode}
                    editMode={editMode}
                    key={addr._id}
                    address={addr}
                    isSelected={selectedAddressId === addr._id}
                    onSelect={handleSelectAddress}
                    onEdit={handleEditAddress}
                  />
                ))}
                <button
                  onClick={handleAddNewAddress}
                  className="flex-shrink-0 w-[140px] lg:w-full py-4 lg:py-4 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-[11px] font-bold hover:border-gray-200 transition-all flex items-center justify-center"
                >
                  + New
                </button>
              </div>
            </div>

            <div className="order-2 lg:order-1 lg:col-span-7 bg-white p-6 border border-gray-100 rounded-[20px] shadow-sm">
              <h2 className="text-[14px] font-bold mb-6 text-gray-800">
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  error={errors.firstName}
                  className="col-span-1"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  error={errors.lastName}
                  className="col-span-1"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="addressLine1"
                  name="addressLine1"
                  label="Flat/ House No/ Building"
                  placeholder="House no, Building, Apartment"
                  value={form.addressLine1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                  error={errors.addressLine1}
                  className="col-span-2"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="addressLine2"
                  name="addressLine2"
                  label="Street / Locality"
                  value={form.addressLine2}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                  error={errors.addressLine2}
                  className="col-span-2"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="landmark"
                  name="landmark"
                  label="Landmark (Optional)"
                  value={form.landmark}
                  onChange={(e) =>
                    setForm({ ...form, landmark: e.target.value })
                  }
                  className="col-span-2"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="pincode"
                  name="pincode"
                  label="PIN Code"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                  error={errors.pincode}
                  className="col-span-1"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="city"
                  name="city"
                  label="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  error={errors.city}
                  className="col-span-1"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="state"
                  name="state"
                  label="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  error={errors.state}
                  className="col-span-2"
                />
                <PremiumInput
                  editMode={editMode}
                  selectedAddressId={selectedAddressId}
                  id="phone"
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 XXXX-XXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  className="col-span-2"
                />
              </div>

              <div className="mt-10 flex justify-end">
                <div className="w-full sm:w-auto">
                  {checkoutError && (
                    <p className="mb-3 text-[11px] font-semibold text-red-500 text-right">
                      {checkoutError}
                    </p>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={isLoading}
                    className="w-full sm:w-auto group bg-black text-white flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>continue</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ) : (
            <div className="animate-in fade-in slide-in-from-right-3 duration-500">
              <PaymentPage
                cartItems={cartItems}
                totalPrice={totalPrice}
                shippingDetails={form}
                order={pendingOrder}
                orderId={pendingOrder?._id}
              />
              <button
                onClick={() => setStep(1)}
                className="mt-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                ← Back to Shipping
              </button>
            </div>
          )} */}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          height: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eee;
          border-radius: 10px;
        }
        .custom-scrollbar {
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
