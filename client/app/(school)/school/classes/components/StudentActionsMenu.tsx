// src/app/school/students/components/StudentActionsMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, UserX, Trash2, Shield, Award } from "lucide-react";
import type { StudentWithUser } from "../types";
import { EditStudentModal } from "./EditStudentModal";
import { DeactivateStudentModal } from "./DeactivateStudentModal";
import { DeleteStudentModal } from "./DeleteStudentModal";

interface StudentActionsMenuProps {
  student: StudentWithUser;
  onStudentUpdate: (student: StudentWithUser) => void;
  onStudentDelete: (studentId: string) => void;
}

export function StudentActionsMenu({
  student,
  onStudentUpdate,
  onStudentDelete,
}: StudentActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditSuccess = (updatedStudent: StudentWithUser) => {
    onStudentUpdate(updatedStudent);
    setShowEditModal(false);
    setIsOpen(false);
  };

  const handleDeactivateSuccess = () => {
    const updatedStudent = {
      ...student,
      user: { ...student.user, isActive: false },
    };
    onStudentUpdate(updatedStudent);
    setShowDeactivateModal(false);
    setIsOpen(false);
  };

  const handleDeleteSuccess = () => {
    onStudentDelete(student.user.id);
    setShowDeleteModal(false);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-cream transition-colors">
          <MoreVertical size={16} className="text-text-muted" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
            <Link
              href={`/school/students/${student.user.id}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Eye size={14} /> View Details
            </Link>

            <button
              onClick={() => {
                setShowEditModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Edit size={14} /> Edit Profile
            </button>

            <button
              onClick={() => {
                setShowDeactivateModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors">
              <UserX size={14} /> {student.user.isActive ? "Deactivate" : "Reactivate"} Account
            </button>

            <button
              onClick={() => {
                setShowDeleteModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Delete Account
            </button>

            <hr className="my-1 border-gray-100" />

            <Link
              href={`/school/students/${student.user.id}/performance`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Award size={14} /> View Performance
            </Link>

            <Link
              href={`/school/students/${student.user.id}/security`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Shield size={14} /> Security Settings
            </Link>
          </div>
        )}
      </div>

      <EditStudentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        student={student}
        onSuccess={handleEditSuccess}
      />

      <DeactivateStudentModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        student={student}
        onSuccess={handleDeactivateSuccess}
      />

      <DeleteStudentModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        student={student}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
