"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { SchoolData, SchoolType, SubscriptionPlan } from "@/types/schoolsTypes";
import {
  SCHOOL_TYPES,
  SUBSCRIPTION_PLANS,
  NIGERIAN_STATES,
  PLAN_LIMITS,
} from "@/lib/constants/schools";

interface Props {
  onClose: () => void;
  onAdd: (school: SchoolData) => void;
}

export function AddSchoolModal({ onClose, onAdd }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    type: "private" as SchoolType,
    state: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    foundedYear: new Date().getFullYear(),
    motto: "",
    plan: "basic" as SubscriptionPlan,
  });

  const set = (key: keyof typeof formData, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const limits = PLAN_LIMITS[formData.plan];
    const now = new Date();
    const newSchool: SchoolData = {
      id: `sch_${Date.now()}`,
      name: formData.name,
      code: `${formData.state.substring(0, 2).toUpperCase()}${formData.type.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      type: formData.type,
      status: "pending",
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: "Nigeria",
      },
      contact: { phone: formData.phone, email: formData.email },
      subscription: {
        plan: formData.plan,
        status: "trial",
        startDate: now.toISOString().split("T")[0],
        expiryDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        maxStudents: limits.maxStudents,
        maxClasses: limits.maxClasses,
        features: limits.features,
      },
      stats: {
        totalStudents: 0,
        activeStudents: 0,
        totalClasses: 0,
        totalTeachers: 0,
        totalAdmins: 1,
        sessionsCompleted: 0,
        averagePerformance: 0,
        subscriptionUsage: 0,
        questionsAttempted: 0,
        totalSpent: 0,
        loginRate: 0,
        completionRate: 0,
      },
      classes: [],
      admins: [
        {
          id: `admin_${Date.now()}`,
          name: "School Admin",
          email: formData.email,
          phone: formData.phone,
          role: "admin",
          lastActive: now.toISOString().split("T")[0],
          status: "active",
        },
      ],
      foundedYear: formData.foundedYear,
      motto: formData.motto,
      accreditation: [],
      facilities: [],
      createdAt: now.toISOString().split("T")[0],
      updatedAt: now.toISOString().split("T")[0],
    };
    onAdd(newSchool);
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-green-900">Register New School</h3>
          <button
            title="close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>School Name *</Label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g., Lagos Preparatory School"
              className={inputCls}
            />
          </div>

          <div>
            <Label>School Type *</Label>
            <select
              title="type"
              value={formData.type}
              onChange={(e) => set("type", e.target.value as SchoolType)}
              className={inputCls}>
              {Object.entries(SCHOOL_TYPES).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Founded Year</Label>
            <input
              title="year"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => set("foundedYear", parseInt(e.target.value) || 2024)}
              className={inputCls}
            />
          </div>

          <div>
            <Label>State *</Label>
            <select
              title="state"
              value={formData.state}
              onChange={(e) => set("state", e.target.value)}
              className={inputCls}>
              <option value="">Select State</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>City</Label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="e.g., Ikeja"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Address</Label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="e.g., 123 Main Street"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Phone</Label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+234..."
              className={inputCls}
            />
          </div>

          <div>
            <Label>Email</Label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="info@school.edu.ng"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Motto</Label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => set("motto", e.target.value)}
              placeholder="e.g., Knowledge is Power"
              className={inputCls}
            />
          </div>

          <div>
            <Label>Subscription Plan</Label>
            <select
              title="plan"
              value={formData.plan}
              onChange={(e) => set("plan", e.target.value as SubscriptionPlan)}
              className={inputCls}>
              {Object.entries(SUBSCRIPTION_PLANS).map(([k, c]) => (
                <option key={k} value={k}>
                  {c.label} — {c.price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-[14px] font-semibold text-text-muted hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.state}
            className="flex-1 py-3 rounded-xl bg-green-800 text-white font-semibold hover:bg-green-700 transition-all text-[14px] disabled:opacity-50">
            Register School
          </button>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[12px] font-semibold text-green-900 mb-1">{children}</label>;
}
