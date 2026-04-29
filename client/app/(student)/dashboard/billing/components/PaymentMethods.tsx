"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Check, X, Shield, Loader2, Lock } from "lucide-react";
import { SavedCard } from "@/types/billing";
import { MOCK_CARDS, BRAND_CONFIG, formatCurrency } from "@/lib/constants/billing";

export default function PaymentMethods() {
  const [cards, setCards] = useState<SavedCard[]>(MOCK_CARDS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" });

  const setDefault = (id: string) => {
    setCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const removeCard = (id: string) => {
    if (cards.find((c) => c.id === id)?.isDefault) {
      alert("Cannot remove your default card. Set another card as default first.");
      return;
    }
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCard = async () => {
    if (!form.cardNumber || !form.expiry || !form.cvv || !form.name) {
      alert("Please fill in all fields");
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    // TODO: tokenise via Paystack
    const last4 = form.cardNumber.replace(/\s/g, "").slice(-4);
    const [expM, expY] = form.expiry.split("/").map((s) => parseInt(s.trim()));
    setCards((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        last4,
        brand: "visa",
        expMonth: expM,
        expYear: 2000 + expY,
        isDefault: false,
        holderName: form.name,
      },
    ]);
    setIsProcessing(false);
    setShowAddModal(false);
    setForm({ cardNumber: "", expiry: "", cvv: "", name: "" });
  };

  const formatCardNumber = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    return digits;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
              <CreditCard size={18} className="text-green-700" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900">Payment Methods</h3>
              <p className="text-[12px] text-gray-500">
                {cards.length} card{cards.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Shield size={12} className="text-green-500" />
            Secured by Paystack
          </div>
        </div>

        {/* Cards list */}
        <div className="space-y-3 mb-4">
          {cards.map((card) => {
            const brand = BRAND_CONFIG[card.brand];
            const isExpired = new Date(card.expYear, card.expMonth - 1) < new Date();

            return (
              <div
                key={card.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  card.isDefault
                    ? "border-green-400 bg-green-50/50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}>
                {/* Card icon — proper circle with brand colour */}
                <div
                  className={`w-12 h-12 rounded-full ${brand.bg} flex items-center justify-center shadow-sm shrink-0`}>
                  <span className={`text-[11px] font-black ${brand.text} tracking-wide`}>
                    {brand.label}
                  </span>
                </div>

                {/* Card details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[14px] font-bold text-gray-800 font-mono">
                      •••• •••• •••• {card.last4}
                    </p>
                    {card.isDefault && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                        Default
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-500">
                    {card.holderName && <span className="mr-2">{card.holderName} ·</span>}
                    Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!card.isDefault && (
                    <button
                      onClick={() => setDefault(card.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                      <Check size={12} /> Set Default
                    </button>
                  )}
                  <button
                    onClick={() => removeCard(card.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove card">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add card button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-[14px] font-semibold text-gray-500 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> Add New Card
        </button>
      </div>

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <CreditCard size={18} className="text-green-700" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">Add New Card</h3>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Lock size={10} /> 256-bit SSL encrypted
                  </p>
                </div>
              </div>
              <button
                title="show model "
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Card preview */}
              <div className="h-[90px] rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 p-4 flex flex-col justify-between text-white shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-bold tracking-widest opacity-70 uppercase">
                    Gravitest
                  </p>
                  <div className="w-8 h-8 rounded-full bg-amber-400/80 border-2 border-orange-300" />
                </div>
                <p className="font-mono text-[15px] font-bold tracking-widest">
                  {form.cardNumber || "•••• •••• •••• ••••"}
                </p>
              </div>

              {/* Form fields */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                  placeholder="ADAEZE OKONKWO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 tracking-wide"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 tracking-widest"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM / YY"
                    maxLength={7}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 tracking-widest text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    CVV <Lock size={10} className="text-gray-400" />
                  </label>
                  <input
                    type="password"
                    value={form.cvv}
                    onChange={(e) =>
                      setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-[14px] font-mono focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 tracking-widest text-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                <Shield size={14} className="text-green-600 shrink-0" />
                <p className="text-[11px] text-gray-500">
                  Card details are tokenised by Paystack and never stored on our servers.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-[14px] text-gray-600 font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                disabled={isProcessing}
                className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl text-[14px] font-bold hover:bg-green-700 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm">
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {isProcessing ? "Adding card…" : "Add Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
