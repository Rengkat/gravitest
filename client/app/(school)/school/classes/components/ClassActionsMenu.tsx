// src/app/school/classes/components/ClassActionsMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Edit, Copy, Key, Trash2, Power, UserPlus } from "lucide-react";
import type { SchoolClass } from "../types";
import { EditClassModal } from "./EditClassModal";
import { RotatePinModal } from "./RotatePinModal";
import { DeleteClassModal } from "./DeleteClassModal";

interface ClassActionsMenuProps {
  classItem: SchoolClass;
  onClassUpdate: (updatedClass: SchoolClass) => void;
  onClassDelete: (classId: string) => void;
}

export function ClassActionsMenu({
  classItem,
  onClassUpdate,
  onClassDelete,
}: ClassActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRotatePinModal, setShowRotatePinModal] = useState(false);
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

  const handleCopyClassCode = () => {
    navigator.clipboard.writeText(classItem.classCode);
    setIsOpen(false);
  };

  const handleToggleStatus = async () => {
    const updatedClass = { ...classItem, isActive: !classItem.isActive };
    onClassUpdate(updatedClass);
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
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
            <Link
              href={`/school/classes/${classItem.id}`}
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
              <Edit size={14} /> Edit Class
            </button>

            <button
              onClick={handleCopyClassCode}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Copy size={14} /> Copy Class Code
            </button>

            <button
              onClick={() => {
                setShowRotatePinModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-cream transition-colors">
              <Key size={14} /> Rotate Access PIN
            </button>

            <button
              onClick={handleToggleStatus}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 transition-colors">
              <Power size={14} /> {classItem.isActive ? "Deactivate" : "Activate"} Class
            </button>

            <hr className="my-1 border-gray-100" />

            <button
              onClick={() => {
                setShowDeleteModal(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Delete Class
            </button>
          </div>
        )}
      </div>

      <EditClassModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        classItem={classItem}
        onSuccess={onClassUpdate}
      />

      <RotatePinModal
        isOpen={showRotatePinModal}
        onClose={() => setShowRotatePinModal(false)}
        classItem={classItem}
        onSuccess={onClassUpdate}
      />

      <DeleteClassModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        classItem={classItem}
        onSuccess={() => onClassDelete(classItem.id)}
      />
    </>
  );
}
