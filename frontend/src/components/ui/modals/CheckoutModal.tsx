import React, { useState } from "react";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [addressType, setAddressType] = useState("new"); // 'new' | 'existing'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4">Billing Details</h2>

        {/* Address Type Selection */}
        <div className="space-y-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              value="new"
              checked={addressType === "new"}
              onChange={() => setAddressType("new")}
            />
            <span>I want to use a new address</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              value="existing"
              checked={addressType === "existing"}
              onChange={() => setAddressType("existing")}
            />
            <span>I want to use an existing address</span>
          </label>
        </div>

        {/* If NEW ADDRESS is selected */}
        {addressType === "new" && (
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Enter your first name *"
                className="border rounded-lg p-3"
              />

              <input
                type="text"
                placeholder="Enter your last name *"
                className="border rounded-lg p-3"
              />
            </div>

            <select className="w-full border rounded-lg p-3 bg-gray-50">
              <option>Punjab</option>
            </select>

            <select className="w-full border rounded-lg p-3 bg-gray-50">
              <option>Faisalabad</option>
            </select>

            <input
              type="text"
              placeholder="Enter Area *"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Enter Postal Code *"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Enter Phone Number *"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Address Line 1 *"
              className="w-full border rounded-lg p-3"
            />

          </div>
        )}

        {/* Note Section */}
        {/* <p className="text-sm text-red-600 mt-4">
          <strong>NOTE:</strong> We only deliver in <strong>Faisalabad</strong>
        </p> */}

        {/* Button */}
        <button className="mt-6 w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition">
          Continue to Payment
        </button>

      </div>
    </div>
  );
};

export default CheckoutModal;
