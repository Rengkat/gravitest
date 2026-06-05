import GravitasLogoMark from "@/lib/components/gravitas-logo";
import {
  LayoutDashboard,
  Users,
  School,
  HelpCircle,
  FileText,
  CreditCard,
  Repeat,
  Bot,
  Settings,
  LogOut,
  User,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Shield,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Platform Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/schools",
    label: "Schools",
    icon: School,
  },
  {
    href: "/admin/questions",
    label: "Question Bank",
    icon: HelpCircle,
  },
  {
    href: "/admin/contents",
    label: "Content Library",
    icon: FileText,
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    icon: CreditCard,
  },
  // {
  //   href: "/admin/subscriptions",
  //   label: "Subscriptions",
  //   icon: Repeat,
  // },
  // {
  //   href: "/admin/tutors",
  //   label: "Tutors",
  //   icon: GraduationCap,
  // },
  // {
  //   href: "/admin/bookings",
  //   label: "Bookings",
  //   icon: CalendarCheck,
  // },
  {
    href: "/admin/ai-logs",
    label: "AI Usage Logs",
    icon: Bot,
  },
  {
    href: "/admin/games",
    label: "Game",
    icon: Gamepad2,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

type AdminSideBarProps = {
  sidebarOpen: boolean;
  closeSidebar: () => void;
};

const AdminSideBar = ({ sidebarOpen, closeSidebar }: AdminSideBarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ borderColor: "rgba(30,80,50,0.1)" }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(30,80,50,0.1)" }}>
        <Link href="/admin" onClick={closeSidebar} className="flex items-center gap-2">
          <GravitasLogoMark />
          <span className="font-serif text-xl font-bold" style={{ color: "#0d2b1a" }}>
            Gravitest
          </span>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "#ef444415", color: "#ef4444" }}>
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-green-800 text-white"
                  : "text-text-muted hover:bg-green-500/5 hover:text-green-800"
              }`}>
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[14px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        className="absolute bottom-0 left-0 right-0 py-[0.2rem] px-4 border-t"
        style={{ borderColor: "rgba(30,80,50,0.1)" }}>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-cream">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield size={18} className="text-red-600" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-green-900">Admin User</div>
            <div className="text-[11px] text-text-muted">Super Admin</div>
          </div>
          <button title="logout" className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <LogOut size={16} className="text-text-muted" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSideBar;
