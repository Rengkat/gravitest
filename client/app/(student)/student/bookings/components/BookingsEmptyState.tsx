import Link from "next/link";
import { Calendar } from "lucide-react";

export default function BookingsEmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Calendar size={36} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
      <p className="text-[14px] text-gray-500 mb-5">
        Browse tutors and book your first session!
      </p>
      <Link
        href="/tutors"
        className="inline-block px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-[14px]"
      >
        Find a Tutor
      </Link>
    </div>
  );
}
