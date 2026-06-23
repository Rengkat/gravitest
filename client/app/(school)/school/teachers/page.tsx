"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Users,
  Trash2,
  UserPlus,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { MOCK_TEACHERS, MOCK_INVITATIONS } from "./mock-data";
import type { Teacher, TeacherFilters, TeacherFormData, TeacherInvitation } from "./types";
import { InviteTeacherModal } from "./components/InviteTeacherModal";
import { AssignClassModal } from "./components/AssignClassModal";
import { TeacherDetailsModal } from "./components/TeacherDetailsModal";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { PendingInvitationsList } from "./components/PendingInvitationsList";

const ITEMS_PER_PAGE = 10;
const INVITATION_VALID_DAYS = 7;

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invitations, setInvitations] = useState<TeacherInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TeacherFilters>({});

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [teacherToRemove, setTeacherToRemove] = useState<Teacher | null>(null);
  const [invitationToRevoke, setInvitationToRevoke] = useState<TeacherInvitation | null>(null);
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setTeachers(MOCK_TEACHERS);
      setInvitations(MOCK_INVITATIONS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const pendingInvitations = useMemo(
    () => invitations.filter((inv) => inv.status === "PENDING"),
    [invitations],
  );

  // Filtered + paginated teachers (derived, not duplicated into separate state)
  const filteredTeachers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !term ||
        teacher.firstName.toLowerCase().includes(term) ||
        teacher.lastName.toLowerCase().includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.subjects.some((s) => s.toLowerCase().includes(term));

      const matchesRole = filters.role ? teacher.role === filters.role : true;
      const matchesStatus = filters.status
        ? filters.status === "active"
          ? teacher.isActive
          : !teacher.isActive
        : true;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [teachers, searchTerm, filters]);

  // Reset to page 1 whenever the filtered set changes shape, so we never
  // get stuck looking at an empty page after a filter narrows the results.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters.role, filters.status]);

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE));
  const indexOfFirstItem = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstItem,
    indexOfFirstItem + ITEMS_PER_PAGE,
  );

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase();

  const getRoleBadge = (role: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      CLASS_ADMIN: { color: "text-blue-700", bg: "bg-blue-100" },
      HEAD_OF_DEPARTMENT: { color: "text-purple-700", bg: "bg-purple-100" },
      TEACHER: { color: "text-green-700", bg: "bg-green-100" },
    };
    const config = configs[role] || configs.TEACHER;
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.color}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  // --- Invitations: this is the ONLY way a teacher enters the system. ---
  // Sending an invite creates a PENDING record; the teacher only shows up
  // in the active table once they accept it (handled outside this admin
  // view — e.g. the email link flow).
  const handleInviteTeacher = (formData: TeacherFormData) => {
    const newInvitation: TeacherInvitation = {
      id: `invite-${Date.now()}`,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      classIds: formData.classIds,
      invitedBy: "current-admin",
      token: `tok_${Math.random().toString(36).slice(2, 10)}`,
      status: "PENDING",
      expiresAt: new Date(Date.now() + INVITATION_VALID_DAYS * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
    setInvitations((prev) => [newInvitation, ...prev]);
    setShowInviteModal(false);
  };

  const handleResendInvitation = async (invitation: TeacherInvitation) => {
    setResendingInviteId(invitation.id);
    // Simulate sending the email again.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitation.id
          ? {
              ...inv,
              expiresAt: new Date(Date.now() + INVITATION_VALID_DAYS * 24 * 60 * 60 * 1000),
            }
          : inv,
      ),
    );
    setResendingInviteId(null);
  };

  const handleRevokeInvitation = async () => {
    if (!invitationToRevoke) return;
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationToRevoke.id));
    setInvitationToRevoke(null);
  };

  const handleAssignClass = (
    teacherId: string,
    classData: {
      classId: string;
      className: string;
      classArm: string | null;
      role: "CLASS_ADMIN" | "SUBJECT_TEACHER";
      subjects: string[];
    },
  ) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              assignedClasses: [
                ...teacher.assignedClasses,
                {
                  classId: classData.classId,
                  className: classData.className,
                  classArm: classData.classArm,
                  role: classData.role,
                  subjects: classData.subjects,
                  assignedAt: new Date(),
                  isActive: true,
                },
              ],
            }
          : teacher,
      ),
    );
    setShowAssignModal(false);
  };

  const handleConfirmRemoveTeacher = async () => {
    if (!teacherToRemove) return;
    setTeachers((prev) => prev.filter((t) => t.id !== teacherToRemove.id));
    setTeacherToRemove(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1">Teacher Management</h1>
            <p className="text-text-muted">
              Teachers can only join by invitation — manage invites, classes, and performance here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-800 text-white hover:bg-green-700 transition-all">
            <UserPlus size={16} />
            Invite Teacher
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Total Teachers</p>
          <p className="text-2xl font-bold text-green-900">{teachers.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Class Admins</p>
          <p className="text-2xl font-bold text-green-900">
            {teachers.filter((t) => t.role === "CLASS_ADMIN").length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Active Teachers</p>
          <p className="text-2xl font-bold text-green-900">
            {teachers.filter((t) => t.isActive).length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <p className="text-sm text-text-muted mb-1">Avg. Teacher Score</p>
          <p className="text-2xl font-bold text-green-900">
            {(
              teachers.reduce((sum, t) => sum + t.averageStudentScore, 0) / teachers.length || 0
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Pending Invitations */}
      <PendingInvitationsList
        invitations={pendingInvitations}
        onResend={handleResendInvitation}
        onRevoke={setInvitationToRevoke}
        resendingId={resendingInviteId}
      />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search teachers by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <select
          aria-label="Filter by role"
          value={filters.role || "all"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              role: e.target.value === "all" ? undefined : e.target.value,
            }))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Roles</option>
          <option value="CLASS_ADMIN">Class Admin</option>
          <option value="HEAD_OF_DEPARTMENT">Head of Department</option>
          <option value="TEACHER">Teacher</option>
        </select>

        <select
          aria-label="Filter by status"
          value={filters.status || "all"}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              status:
                e.target.value === "all" ? undefined : (e.target.value as "active" | "inactive"),
            }))
          }
          className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-cream transition-all">
          <Filter size={16} /> More Filters
        </button>
      </div>

      {/* Teachers Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[240px]">
                  Teacher
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[160px]">
                  Subjects
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[180px]">
                  Classes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[120px]">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[140px]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-green-900 min-w-[110px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-cream/30 transition-colors align-top">
                  {/* Teacher: avatar, name, role badge, contact info — given room to breathe */}
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 font-semibold">
                          {getInitials(teacher.firstName, teacher.lastName)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowDetailsModal(true);
                          }}
                          className="font-medium text-[15px] text-green-900 hover:text-green-700 transition-colors text-left">
                          {teacher.firstName} {teacher.lastName}
                        </button>
                        <div className="mt-1">{getRoleBadge(teacher.role)}</div>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate max-w-[180px]">{teacher.email}</span>
                        </div>
                        {teacher.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                            <Phone size={12} className="shrink-0" />
                            <span>{teacher.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Subjects */}
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.slice(0, 2).map((subject) => (
                        <span
                          key={subject}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{teacher.subjects.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Classes */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800 mb-1.5">
                      <Users size={14} className="text-text-muted" />
                      {teacher.assignedClasses.length}{" "}
                      {teacher.assignedClasses.length === 1 ? "class" : "classes"}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.assignedClasses.slice(0, 2).map((c) => (
                        <span
                          key={c.classId}
                          className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                          {c.className}
                          {c.classArm ? ` (${c.classArm})` : ""}
                        </span>
                      ))}
                      {teacher.assignedClasses.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{teacher.assignedClasses.length - 2} more
                        </span>
                      )}
                      {teacher.assignedClasses.length === 0 && (
                        <span className="text-xs text-text-muted">No classes yet</span>
                      )}
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-green-900">
                        {teacher.averageStudentScore}%
                      </span>
                      <span className="text-xs text-text-muted">{teacher.passRate}% pass rate</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      {teacher.isActive ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                          <XCircle size={12} /> Inactive
                        </span>
                      )}
                      {teacher.lastActive && (
                        <span className="text-xs text-text-muted">
                          Last active {new Date(teacher.lastActive).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDetailsModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                        title="View Details">
                        <GraduationCap size={16} className="text-text-muted" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowAssignModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                        title="Assign Classes">
                        <Users size={16} className="text-text-muted" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeacherToRemove(teacher)}
                        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove Teacher">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentTeachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    No teachers match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfFirstItem + ITEMS_PER_PAGE, filteredTeachers.length)} of{" "}
              {filteredTeachers.length} teachers
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              <span className="px-4 py-2 text-sm text-text-muted">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                aria-label="Next page"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <InviteTeacherModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteTeacher}
      />

      <AssignClassModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        teacher={selectedTeacher}
        onAssign={handleAssignClass}
      />

      <TeacherDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        teacher={selectedTeacher}
      />

      <ConfirmationModal
        isOpen={teacherToRemove !== null}
        title="Remove this teacher?"
        message={
          teacherToRemove ? (
            <>
              <strong className="text-gray-700">
                {teacherToRemove.firstName} {teacherToRemove.lastName}
              </strong>{" "}
              will lose access to all {teacherToRemove.assignedClasses.length} assigned class
              {teacherToRemove.assignedClasses.length === 1 ? "" : "es"} immediately. This can't be
              undone — they would need a new invitation to rejoin.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Remove Teacher"
        variant="danger"
        onConfirm={handleConfirmRemoveTeacher}
        onCancel={() => setTeacherToRemove(null)}
      />

      <ConfirmationModal
        isOpen={invitationToRevoke !== null}
        title="Revoke this invitation?"
        message={
          invitationToRevoke ? (
            <>
              The invitation link sent to{" "}
              <strong className="text-gray-700">{invitationToRevoke.email}</strong> will stop
              working immediately.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Revoke Invitation"
        variant="danger"
        onConfirm={handleRevokeInvitation}
        onCancel={() => setInvitationToRevoke(null)}
      />
    </div>
  );
}
