import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    // Payment
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : [];
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Process order
      setOrderPlaced(true);
      clearCart();
    }
  };

  // Empty cart
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-400 mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
          >
            ← Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Order success
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-400 mb-2">Thank you for your order.</p>
          <p className="text-gray-400 mb-8">
            Order confirmation has been sent to{" "}
            <span className="text-green-500">{formData.email}</span>
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Order Number</span>
              <span className="text-white font-mono">
                PRX-{Date.now().toString().slice(-8)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Paid</span>
              <span className="text-green-500 font-bold text-xl">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="px-6 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <Link
            to="/products"
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-white">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-green-500" : "text-gray-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {step > 1 ? "✓" : "1"}
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>
          <div
            className={`w-16 h-0.5 ${
              step >= 2 ? "bg-green-500" : "bg-gray-800"
            }`}
          />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-green-500" : "text-gray-500"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                /* Shipping Form */
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">📦</span> Shipping Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="+91 9790333223"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="123 Industrial Park Ave"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Jalandhar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="Punjab"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                        placeholder="144001"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>Australia</option>
                      <option>India</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
                  >
                    Continue to Payment →
                  </button>
                </div>
              ) : (
                /* Payment Form */
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">💳</span> Payment Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      ← Edit Shipping
                    </button>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-1">Shipping to:</p>
                    <p className="text-white">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formData.address}, {formData.city}, {formData.state}{" "}
                      {formData.zipCode}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={19}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors font-mono"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors font-mono"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors font-mono"
                        placeholder="123"
                      />
                    </div>
                  </div>

                  {/* Secure Payment Notice */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Your payment information is encrypted and secure
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Place Order - ₹{total.toFixed(2)}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-green-500 font-semibold text-sm">
                        ₹
                        {(
                          (parseFloat(item.price.replace(/[₹$,]/g, "")) || 0) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Subtotal ({getCartCount()} items)
                  </span>
                  <span className="text-white">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span
                    className={shipping === 0 ? "text-green-500" : "text-white"}
                  >
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-green-500">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 500 && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-500 text-sm">
                    Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="text-gray-400">
                    <div className="text-xl mb-1">🔒</div>
                    <p className="text-xs">Secure</p>
                  </div>
                  <div className="text-gray-400">
                    <div className="text-xl mb-1">🚚</div>
                    <p className="text-xs">Fast Ship</p>
                  </div>
                  <div className="text-gray-400">
                    <div className="text-xl mb-1">↩️</div>
                    <p className="text-xs">30-Day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
