import React, { useState } from "react";
import { useCart } from "@/components/products/CartContext";
import StripeCardForm from "./StripeCardForm";
import { createOrder } from "@/api/order.api";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Address = {
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  area: string;
  postalCode: string;
  phone: string;
  line1: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, clearCart } = useCart();
  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const [addressType, setAddressType] = useState<"new" | "existing">("new");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    province: "",
    city: "",
    area: "",
    postalCode: "",
    phone: "",
    line1: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  if (!isOpen) return null;

  // Determine which address to use
  const addressToUse =
    addressType === "existing" && selectedAddressIndex !== null
      ? addresses[selectedAddressIndex]
      : newAddress;

  const handleAddressSave = () => {
    const requiredFields = [
      newAddress.firstName,
      newAddress.lastName,
      newAddress.phone,
      newAddress.line1,
      newAddress.city,
      newAddress.province,
      newAddress.postalCode,
    ];

    if (requiredFields.some(field => !field.trim())) {
      alert("Please fill all required fields.");
      return;
    }

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressIndex(addresses.length);
    setAddressType("existing");

    setNewAddress({
      firstName: "",
      lastName: "",
      province: "",
      city: "",
      area: "",
      postalCode: "",
      phone: "",
      line1: "",
    });
  };

  const handlePhoneChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setNewAddress(prev => ({ ...prev, phone: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 w-full max-w-3xl p-6 rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        {/* 1️⃣ Order Summary */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">Order Summary</h3>
          {cartItems.length === 0 ? (
            <p className="text-red-600 font-medium">
              Your cart is empty. You can still test payment with $10.
            </p>
          ) : (
            <div className="space-y-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* 2️⃣ Address */}
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">Billing / Shipping Address</h3>

          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                value="new"
                checked={addressType === "new"}
                onChange={() => setAddressType("new")}
              />
              <span>Use new address</span>
            </label>

            {addresses.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="existing"
                  checked={addressType === "existing"}
                  onChange={() => setAddressType("existing")}
                />
                <span>Use existing address</span>
              </label>
            )}
          </div>

          {addressType === "existing" && selectedAddressIndex !== null && (
            <div className="space-y-2 mb-4 p-2 bg-gray-50 rounded">
              <p>{addresses[selectedAddressIndex]?.firstName} {addresses[selectedAddressIndex]?.lastName}</p>
              <p>{addresses[selectedAddressIndex]?.line1}, {addresses[selectedAddressIndex]?.area}</p>
              <p>{addresses[selectedAddressIndex]?.city}, {addresses[selectedAddressIndex]?.province}</p>
              <p>Postal: {addresses[selectedAddressIndex]?.postalCode}</p>
              <p>Phone: {addresses[selectedAddressIndex]?.phone}</p>
            </div>
          )}

          {addressType === "new" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={newAddress.firstName}
                  onChange={e => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                  className="border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={newAddress.lastName}
                  onChange={e => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                  className="border rounded-lg p-2"
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number *"
                value={newAddress.phone}
                onChange={e => handlePhoneChange(e.target.value)}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={newAddress.line1}
                onChange={e => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Area"
                value={newAddress.area}
                onChange={e => setNewAddress(prev => ({ ...prev, area: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={e => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Province"
                value={newAddress.province}
                onChange={e => setNewAddress(prev => ({ ...prev, province: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={e => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                className="border rounded-lg p-2"
              />
              <button
                className="mt-2 w-full bg-gray-200 p-2 rounded"
                onClick={handleAddressSave}
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* 3️⃣ Payment Method */}
        <div className="mb-4 p-4 border rounded-lg">
          <h3 className="font-semibold mb-2 text-lg">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span>Credit / Debit Card</span>
            </label>
          </div>
        </div>

        {/* Payment Section */}
        {paymentMethod === "card" && (
   <StripeCardForm
  amount={total > 0 ? total : 10}
  onSuccess={async () => {
    try {
      // Use the address the user selected
      const orderData = {
        customerName: `${addressToUse.firstName} ${addressToUse.lastName}`,
        address: {
          firstName: addressToUse.firstName,
          lastName: addressToUse.lastName,
          line1: addressToUse.line1,
          area: addressToUse.area,
          city: addressToUse.city,
          province: addressToUse.province,
          postalCode: addressToUse.postalCode,
          phone: addressToUse.phone,
        },
        phoneNumber: addressToUse.phone,
        items: cartItems.map(i => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        type: "Online",
        bill: total > 0 ? total : 10,
        payment: paymentMethod,
        status: "Pending",
      };

      await createOrder(orderData); // API call to backend

      clearCart();
      onClose();
      alert("Order successfully placed!");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    }
  }}
/>


        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
