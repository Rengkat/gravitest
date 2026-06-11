"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  DollarSign,
  Activity,
  Shield,
  Settings,
  MessageSquare,
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  GraduationCap,
  BookOpen,
  Flag,
  Zap,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Target,
  Users,
  AlertCircle,
  CheckCircle,
  Home,
  Bot,
  LayoutDashboard,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/admin/ai-logs",
    icon: LayoutDashboard,
  },
  {
    title: "AI Conversations",
    href: "/admin/ai-logs/conversations",
    icon: MessageSquare,
    badge: 234,
  },
  {
    title: "Cost Analytics",
    href: "/admin/ai-logs/cost",
    icon: DollarSign,
  },
  {
    title: "Performance",
    href: "/admin/ai-logs/performance",
    icon: Activity,
  },
  {
    title: "Model Management",
    href: "/admin/ai-logs/models",
    icon: Brain,
  },
  {
    title: "Flagged Content",
    href: "/admin/ai-logs/flagged",
    icon: Shield,
    badge: 12,
  },
  {
    title: "AI Scoring",
    href: "/admin/ai-logs/scoring",
    icon: Target,
    children: [
      {
        title: "Practice Questions",
        href: "/admin/ai-logs/scoring/practice",
        icon: BookOpen,
      },
      {
        title: "Exam Grading",
        href: "/admin/ai-logs/scoring/exams",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "System Prompts",
    href: "/admin/ai-logs/prompts",
    icon: FileText,
  },
  {
    title: "Rate Limits",
    href: "/admin/ai-logs/limits",
    icon: Clock,
  },
  {
    title: "Settings",
    href: "/admin/ai-logs/settings",
    icon: Settings,
  },
];

export default function AILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["AI Scoring"]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <span className="font-serif text-lg text-green-900">AI Management</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 z-40 h-screen bg-white border-r transition-all duration-300 overflow-y-auto
          ${sidebarOpen ? "left-0 w-72" : "-left-72 lg:left-0 lg:w-64"}
        `}
        style={{ borderColor: "rgba(30,80,50,0.08)" }}>
        {/* Logo */}
        <div
          className="hidden lg:flex items-center gap-2 p-6 border-b"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="w-10 h-10 rounded-xl bg-green-800 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="font-serif text-xl text-green-900">Sabi AI</div>
            <div className="text-[10px] text-text-muted">Tutor Management</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                      ${expandedMenus.includes(item.title) ? "bg-cream" : "hover:bg-gray-50"}
                    `}>
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className="text-text-muted" />
                      <span className="text-[14px] font-medium text-green-900">{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted transition-transform ${
                        expandedMenus.includes(item.title) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedMenus.includes(item.title) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[13px]
                            ${
                              isActive(child.href)
                                ? "bg-green-800 text-white"
                                : "text-text-muted hover:bg-gray-50"
                            }
                          `}>
                          <child.icon size={14} />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-xl transition-all
                    ${
                      isActive(item.href)
                        ? "bg-green-800 text-white"
                        : "text-green-900 hover:bg-gray-50"
                    }
                  `}>
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={isActive(item.href) ? "text-white" : "text-text-muted"}
                    />
                    <span className="text-[14px] font-medium">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`
                        px-1.5 py-0.5 rounded-full text-[9px] font-bold
                        ${
                          isActive(item.href) ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                        }
                      `}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* System Status */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{ borderColor: "rgba(30,80,50,0.08)" }}>
          <div className="p-3 rounded-xl bg-cream/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-green-900">System Status</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-green-600">Operational</span>
              </span>
            </div>
            <div className="text-[10px] text-text-muted">Uptime: 99.9% • Last 24h</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
