"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  HelpCircle,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  User,
  BookOpen,
  School as SchoolIcon,
  FileText,
} from "lucide-react";
import GravitasLogoMark from "@/lib/components/gravitas-logo";

const SCHOOL_NAV_ITEMS = [
  {
    href: "/school",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/school/students",
    label: "Students",
    icon: Users,
  },
  {
    href: "/school/classes",
    label: "Classes",
    icon: GraduationCap,
  },
  {
    href: "/school/exams",
    label: "Exams",
    icon: HelpCircle,
  },
  {
    href: "/school/performance",
    label: "School Performance",
    icon: BarChart3,
  },
  {
    href: "/school/ai",
    label: "Use AI",
    icon: Bot,
  },
  {
    href: "/school/library",
    label: "Library",
    icon: BookOpen,
  },
  {
    href: "/school/settings",
    label: "Settings",
    icon: Settings,
  },
];

type SchoolSideBarProps = {
  sidebarOpen: boolean;
  closeSidebar: () => void;
};

const SchoolSideBar = ({ sidebarOpen, closeSidebar }: SchoolSideBarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 bg-white border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ borderColor: "rgba(30,80,50,0.1)" }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(30,80,50,0.1)" }}>
        <Link href="/school" onClick={closeSidebar} className="flex items-center gap-2">
          <GravitasLogoMark />
          <span className="font-serif text-xl font-bold" style={{ color: "#0d2b1a" }}>
            Gravitest
          </span>
          <span
            className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "#2e8b5715", color: "#2e8b57" }}>
            School
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {SCHOOL_NAV_ITEMS.map((item) => {
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
          <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center">
            <SchoolIcon size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-green-900">Lagos Prep School</div>
            <div className="text-[11px] text-text-muted">School Admin</div>
          </div>
          <button title="logout" className="p-1.5 rounded-lg hover:bg-white/50 transition-colors">
            <LogOut size={16} className="text-text-muted" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SchoolSideBar;
