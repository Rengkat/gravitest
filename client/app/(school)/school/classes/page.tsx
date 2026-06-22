"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, LayoutGrid, List } from "lucide-react";
import { ClassStatsCards } from "./components/ClassStatsCards";
import { ClassGrid } from "./components/ClassGrid";
import { ClassList } from "./components/ClassList";
import { CreateClassModal } from "./components/CreateClassModal";
import { MOCK_CLASSES } from "./mock";
import type { SchoolClass, ClassFilters } from "./types";

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ClassFilters>({
    isActive: undefined,
    sortBy: "name",
    sortOrder: "ASC",
  });

  // Calculate stats
  const stats = {
    totalClasses: classes.length,
    activeClasses: classes.filter((c) => c.isActive).length,
    inactiveClasses: classes.filter((c) => !c.isActive).length,
    totalStudents: classes.reduce((sum, c) => sum + c.totalStudents, 0),
    totalExams: classes.reduce((sum, c) => sum + c.totalExamsCreated, 0),
    averageStudentsPerClass:
      Math.round(classes.reduce((sum, c) => sum + c.totalStudents, 0) / classes.length) || 0,
  };

  // Filter and sort classes
  const filteredClasses = classes
    .filter((classItem) => {
      const matchesSearch =
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (classItem.arm && classItem.arm.toLowerCase().includes(searchTerm.toLowerCase())) ||
        classItem.classCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.isActive === undefined ? true : classItem.isActive === filters.isActive;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const sortField = filters.sortBy || "name";
      const sortOrder = filters.sortOrder === "DESC" ? -1 : 1;

      switch (sortField) {
        case "name":
          return sortOrder * a.name.localeCompare(b.name);
        case "totalStudents":
          return sortOrder * (a.totalStudents - b.totalStudents);
        case "totalExamsCreated":
          return sortOrder * (a.totalExamsCreated - b.totalExamsCreated);
        case "createdAt":
          return sortOrder * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return sortOrder * a.name.localeCompare(b.name);
      }
    });

  const handleCreateClass = async (classData: any) => {
    // Replace with actual API call
    const newClass: SchoolClass = {
      id: `class-${Date.now()}`,
      schoolId: "school-001",
      ...classData,
      classCode: `KCL-${classData.name.toUpperCase().replace(/\s/g, "")}-${classData.year || 2025}`,
      pinHash: "hashed_temp",
      pinLastChangedAt: new Date(),
      totalStudents: 0,
      totalExamsCreated: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClasses((prev) => [newClass, ...prev]);
    setShowCreateModal(false);
  };

  const handleClassUpdate = (updatedClass: SchoolClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const handleClassDelete = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-2">Classes</h1>
            <p className="text-text-muted">
              Manage all classes, view performance, and configure settings
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <Plus size={16} /> Create Class
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <ClassStatsCards stats={stats} />

      {/* Filters and View Toggle */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by class name, arm, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={
              filters.isActive === undefined ? "all" : filters.isActive ? "active" : "inactive"
            }
            onChange={(e) => {
              const value = e.target.value;
              setFilters((prev) => ({
                ...prev,
                isActive: value === "all" ? undefined : value === "active",
              }));
            }}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="all">All Classes</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
            <option value="name">Sort by Name</option>
            <option value="totalStudents">Sort by Students</option>
            <option value="totalExamsCreated">Sort by Exams</option>
            <option value="createdAt">Sort by Date</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all">
            <Filter size={16} /> More Filters
          </button>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 px-3 transition-all ${viewMode === "grid" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 px-3 transition-all ${viewMode === "list" ? "bg-green-800 text-white" : "bg-white text-text-muted hover:bg-cream"}`}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Classes Display */}
      {viewMode === "grid" ? (
        <ClassGrid
          classes={filteredClasses}
          onClassUpdate={handleClassUpdate}
          onClassDelete={handleClassDelete}
        />
      ) : (
        <ClassList
          classes={filteredClasses}
          onClassUpdate={handleClassUpdate}
          onClassDelete={handleClassDelete}
        />
      )}

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateClass}
      />
    </div>
  );
}
