"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  BookOpen,
  BarChart3,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Mock student data
const STUDENTS = [
  {
    id: 1,
    name: "Adebayo Oluwaseun",
    email: "oluwaseun@example.com",
    phone: "08012345678",
    class: "SS3 Science",
    performance: 94.5,
    status: "active",
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Okafor Chukwudi",
    email: "chukwudi@example.com",
    phone: "08023456789",
    class: "SS3 Science",
    performance: 92.3,
    status: "active",
    lastActive: "2024-01-14",
  },
  {
    id: 3,
    name: "Eze Chioma",
    email: "chioma@example.com",
    phone: "08034567890",
    class: "SS3 Art",
    performance: 91.8,
    status: "active",
    lastActive: "2024-01-15",
  },
  // Add more students as needed
];

const CLASSES = ["All Classes", "SS3 Science", "SS3 Art", "SS3 Commercial", "SS2 Science"];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = STUDENTS.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "All Classes" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Students</h1>
            <p className="text-text-muted">Manage all students in your school</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/school/students/bulk-upload"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-cream transition-all text-[14px] font-medium">
              <Upload size={16} /> Bulk Upload
            </Link>
            <Link
              href="/school/students/add"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all text-[14px] font-medium">
              <Plus size={16} /> Add Student
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-green-600" />
            <span className="text-[12px] text-text-muted">Total Students</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">{STUDENTS.length}</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-blue-600" />
            <span className="text-[12px] text-text-muted">Active Classes</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">12</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-orange-600" />
            <span className="text-[12px] text-text-muted">Avg Performance</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">78.5%</div>
        </div>
        <div
          className="p-4 rounded-2xl bg-white border"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} className="text-purple-600" />
            <span className="text-[12px] text-text-muted">New This Month</span>
          </div>
          <div className="text-[22px] font-bold text-green-900">45</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div
        className="bg-white rounded-2xl border p-4 mb-6"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30"
            />
          </div>
          <div className="flex gap-2">
            <select
              title="select class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-green-500/30">
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-cream transition-all">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-cream transition-all">
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-green-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-green-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-green-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-[12px] font-semibold text-green-900">
                  Class
                </th>
                <th className="px-6 py-4 text-center text-[12px] font-semibold text-green-900">
                  Performance
                </th>
                <th className="px-6 py-4 text-center text-[12px] font-semibold text-green-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-[12px] font-semibold text-green-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="border-t hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-green-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[13px] text-text-muted">
                      <Mail size={12} /> {student.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[13px] text-text-muted">
                      <Phone size={12} /> {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-text-muted">{student.class}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-[12px] font-semibold">
                      {student.performance}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-[11px]">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      title="vertical"
                      className="p-1.5 rounded-lg hover:bg-cream transition-colors">
                      <MoreVertical size={16} className="text-text-muted" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[13px] text-text-muted">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
