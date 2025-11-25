import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="flex flex-col space-y-4">
            <span className="text-white font-serif text-xl font-semibold">VERES</span>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} VERES. All Rights Reserved.</p>
          </div>

          {/* Column 1 */}
          <div className="flex flex-col space-y-2 text-sm">
            <a href="#" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">Shop Categories</a>
            <a href="#" className="hover:underline">Store Location</a>
            <a href="#" className="hover:underline">FAQs</a>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-2 text-sm">
            <a href="#" className="hover:underline">Terms & Conditions</a>
            <a href="#" className="hover:underline">Delivery</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Services</a>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-2 text-sm">
            <a href="#" className="hover:underline">Handmade Soap</a>
            <a href="#" className="hover:underline">Scented Candle</a>
            <a href="#" className="hover:underline">Perfume</a>
            <a href="#" className="hover:underline">Accessories</a>
          </div>

          {/* Column 4: small images / gallery */}
          <div className="grid grid-cols-4 gap-2">
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
            <img src="/client.jpeg" className="w-12 h-12 object-cover rounded" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <span>© {new Date().getFullYear()} VERES. All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
