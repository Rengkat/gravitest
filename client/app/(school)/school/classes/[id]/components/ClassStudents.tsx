"use client";

import { useState } from "react";
import { Search, UserPlus, X, UserMinus, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ClassStudent } from "../../types";

interface ClassStudentsProps {
  classId: string;
  students: ClassStudent[];
  onStudentAdd: (studentIds: string[]) => void;
  onStudentRemove: (studentId: string) => void;
}

// Mock available students for adding
const AVAILABLE_STUDENTS = [
  {
    id: "student-001",
    firstName: "Adebayo",
    lastName: "Ogunlesi",
    email: "adebayo@example.com",
    admissionNo: "LMC/SS3/001",
  },
  {
    id: "student-002",
    firstName: "Chiamaka",
    lastName: "Nwachukwu",
    email: "chiamaka@example.com",
    admissionNo: "QC/SS3/042",
  },
  {
    id: "student-003",
    firstName: "Emmanuel",
    lastName: "Okonkwo",
    email: "emmanuel@example.com",
    admissionNo: "FGC/SS3/056",
  },
  {
    id: "student-006",
    firstName: "Blessing",
    lastName: "Eze",
    email: "blessing@example.com",
    admissionNo: "QCG/SS3/015",
  },
  {
    id: "student-007",
    firstName: "Grace",
    lastName: "Johnson",
    email: "grace@example.com",
    admissionNo: "INT/SS3/089",
  },
  {
    id: "student-008",
    firstName: "Michael",
    lastName: "Okafor",
    email: "michael@example.com",
    admissionNo: "STD/SS3/101",
  },
];

export function ClassStudents({
  classId,
  students,
  onStudentAdd,
  onStudentRemove,
}: ClassStudentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.email} ${student.admissionNo || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleAddStudents = () => {
    if (selectedStudents.length > 0) {
      onStudentAdd(selectedStudents);
      setSelectedStudents([]);
      setShowAddModal(false);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student from the class?")) {
      onStudentRemove(studentId);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students by name, email, or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
          <UserPlus size={16} /> Add Students
        </button>
      </div>

      {/* Students Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Admission No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Avg. Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-green-700 font-semibold text-xs">
                            {getInitials(student.firstName, student.lastName)}
                          </span>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/school/students/${student.userId}`}
                          className="font-medium text-green-900 hover:text-green-700 transition-colors text-sm">
                          {student.firstName} {student.lastName}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {student.admissionNo || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-green-900">
                      {student.averageScore?.toFixed(1) || "N/A"}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(student.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      title="Remove from class">
                      <UserMinus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-text-muted">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)}{" "}
              of {filteredStudents.length} students
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ArrowLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Students Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />

            <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-green-900">Add Students to Class</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-cream transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_STUDENTS.filter(
                    (s) => !students.some((enrolled) => enrolled.userId === s.id),
                  ).map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-cream cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {student.email} • {student.admissionNo}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-cream transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddStudents}
                  disabled={selectedStudents.length === 0}
                  className="px-4 py-2 rounded-lg bg-green-800 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                  Add {selectedStudents.length} Student(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
