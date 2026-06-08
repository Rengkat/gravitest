"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, BookOpen, Settings, UserPlus, Key, MoreVertical } from "lucide-react";
import { ClassStats } from "./components/ClassStats";
import { ClassStudents } from "./components/ClassStudents";
import { ClassAdmins } from "./components/ClassAdmins";
import { ClassSettings } from "./components/ClassSettings";
import { ClassExams } from "./components/ClassExams";
import { getClassById } from "../mock";
import type { ClassWithDetails } from "../types";

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [classData, setClassData] = useState<ClassWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "students" | "exams" | "admins" | "settings"
  >("overview");

  useEffect(() => {
    fetchClassDetails();
  }, [params.id]);

  const fetchClassDetails = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const data = getClassById(params.id as string);
      setClassData(data || null);
    } catch (error) {
      console.error("Error fetching class details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassUpdate = (updatedClass: ClassWithDetails) => {
    setClassData(updatedClass);
  };

  const handleStudentAdd = (studentIds: string[]) => {
    // Refresh class data after adding students
    fetchClassDetails();
  };

  const handleStudentRemove = (studentId: string) => {
    fetchClassDetails();
  };

  if (loading || !classData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-green-900 transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Classes
        </button>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl text-green-900 mb-1">
              {classData.name}
              {classData.arm && (
                <span className="text-xl text-text-muted ml-2">({classData.arm})</span>
              )}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{classData.classCode}</code>
              {classData.year && <span className="text-text-muted">Year {classData.year}</span>}
              {classData.description && (
                <span className="text-text-muted">• {classData.description}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <div className="flex gap-6 overflow-x-auto">
          {(["overview", "students", "exams", "admins", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-3 text-sm font-medium capitalize transition-colors relative whitespace-nowrap ${
                activeTab === tab ? "text-green-800" : "text-text-muted hover:text-green-700"
              }`}>
              {tab === "overview" && "Overview"}
              {tab === "students" && `Students (${classData.totalStudents})`}
              {tab === "exams" && `Exams (${classData.totalExamsCreated})`}
              {tab === "admins" && "Class Admins"}
              {tab === "settings" && "Settings"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-800 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" && <ClassStats classData={classData} />}

      {activeTab === "students" && (
        <ClassStudents
          classId={classData.id}
          students={classData.students || []}
          onStudentAdd={handleStudentAdd}
          onStudentRemove={handleStudentRemove}
        />
      )}

      {activeTab === "exams" && <ClassExams classId={classData.id} />}

      {activeTab === "admins" && (
        <ClassAdmins
          classId={classData.id}
          admins={classData.classAdmins || []}
          onAdminAdd={() => {}}
          onAdminRemove={() => {}}
        />
      )}

      {activeTab === "settings" && (
        <ClassSettings classData={classData} onClassUpdate={handleClassUpdate} />
      )}
    </div>
  );
}
