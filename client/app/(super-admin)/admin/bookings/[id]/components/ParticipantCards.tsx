import Link from "next/link";
import { Users, Star, Mail, Phone } from "lucide-react";
import { ContactRow, SectionCard } from "./Primitives";

interface StudentCardProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAvatar?: string;
  studentLevel?: string;
}

interface TutorCardProps {
  tutorId: string;
  tutorName: string;
  tutorEmail: string;
  tutorPhone: string;
  tutorAvatar?: string;
  tutorRating: number;
  tutorSpecialization: string[];
}

// ─── AVATAR ──────────────────────────────────────────────────
function Avatar({ src, fallback }: { src?: string; fallback: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center overflow-hidden shrink-0">
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}

// ─── STUDENT CARD ────────────────────────────────────────────
export function StudentCard({
  studentId,
  studentName,
  studentEmail,
  studentPhone,
  studentAvatar,
  studentLevel,
}: StudentCardProps) {
  return (
    <SectionCard title="Student">
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={studentAvatar} fallback={<Users size={22} className="text-green-800" />} />
        <div>
          <div className="text-[14px] font-semibold text-green-900">{studentName}</div>
          <div className="text-[11px] text-text-muted">{studentLevel ?? "Student"}</div>
        </div>
      </div>
      <div className="space-y-2">
        <ContactRow icon={Mail}  value={studentEmail} />
        <ContactRow icon={Phone} value={studentPhone} />
      </div>
      <Link
        href={`/admin/users/${studentId}`}
        className="block w-full mt-3 py-2 rounded-lg bg-green-800 text-white text-[12px] font-semibold text-center hover:bg-green-700 transition-all">
        View Student Profile
      </Link>
    </SectionCard>
  );
}

// ─── TUTOR CARD ──────────────────────────────────────────────
export function TutorCard({
  tutorId,
  tutorName,
  tutorEmail,
  tutorPhone,
  tutorAvatar,
  tutorRating,
  tutorSpecialization,
}: TutorCardProps) {
  return (
    <SectionCard title="Tutor">
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={tutorAvatar} fallback={<Users size={22} className="text-green-800" />} />
        <div>
          <div className="text-[14px] font-semibold text-green-900">{tutorName}</div>
          <div className="flex items-center gap-1 text-[11px] text-text-muted">
            <Star size={10} className="text-gold fill-gold" /> {tutorRating}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <ContactRow icon={Mail}  value={tutorEmail} />
        <ContactRow icon={Phone} value={tutorPhone} />
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {tutorSpecialization.map((spec) => (
          <span key={spec} className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] text-green-700">
            {spec}
          </span>
        ))}
      </div>
      <Link
        href={`/admin/tutors/${tutorId}`}
        className="block w-full mt-3 py-2 rounded-lg border-2 border-green-800 text-green-800 text-[12px] font-semibold text-center hover:bg-green-50 transition-all">
        View Tutor Profile
      </Link>
    </SectionCard>
  );
}
