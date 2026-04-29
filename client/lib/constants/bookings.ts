import { Clock, Video, CheckCircle, XCircle, RefreshCw, MapPin } from "lucide-react";
import { BookingStatus, BookingType, Booking, BookingFilters } from "@/types/bookings";

export const STATUS_COLORS: Record<BookingStatus, string> = {
  upcoming: "text-blue-600 bg-blue-100 border-blue-200",
  ongoing: "text-green-600 bg-green-100 border-green-200",
  completed: "text-gray-600 bg-gray-100 border-gray-200",
  cancelled: "text-red-600 bg-red-100 border-red-200",
  rescheduled: "text-orange-600 bg-orange-100 border-orange-200",
};

export const STATUS_ICONS: Record<BookingStatus, any> = {
  upcoming: Clock,
  ongoing: Video,
  completed: CheckCircle,
  cancelled: XCircle,
  rescheduled: RefreshCw,
};

export const STATUS_LABEL: Record<BookingStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};

export const TYPE_COLORS: Record<BookingType, string> = {
  online: "text-blue-600 bg-blue-50 border-blue-200",
  physical: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

export const PLATFORM_LABELS: Record<string, string> = {
  "google-meet": "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
};

export const PIE_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export function formatPrice(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function applyBookingFilters(bookings: Booking[], filters: BookingFilters): Booking[] {
  return bookings.filter((b) => {
    // Tab
    if (filters.tab === "upcoming" && b.status !== "upcoming" && b.status !== "ongoing")
      return false;
    if (filters.tab === "past" && b.status !== "completed" && b.status !== "cancelled")
      return false;
    // Search
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (
        !b.tutorName.toLowerCase().includes(q) &&
        !b.subject.toLowerCase().includes(q) &&
        !b.topic.toLowerCase().includes(q)
      )
        return false;
    }
    // Status
    if (filters.status !== "all" && b.status !== filters.status) return false;
    // Type
    if (filters.type !== "all" && b.type !== filters.type) return false;
    return true;
  });
}

// Nigerian states for location input
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const LAGOS_AREAS = [
  "Ikeja",
  "Lekki",
  "Victoria Island",
  "Surulere",
  "Yaba",
  "Ikorodu",
  "Badagry",
  "Epe",
  "Ajah",
  "Ibeju-Lekki",
  "Agege",
  "Alimosho",
  "Apapa",
  "Mushin",
  "Oshodi",
];
