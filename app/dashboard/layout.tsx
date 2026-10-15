
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  UserRound,
  LogOut,
  Feather,
} from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth/session";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "My Stories", icon: BookOpen },
  { href: "/dashboard/projects/new", label: "Write a Story", icon: Plus },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
];

function Avatar({
  name,
  avatar,
  boxClass,
  fallbackClass,
}: {
  name: string;
  avatar?: string;
  boxClass: string;
  fallbackClass: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatar}
        alt=""
        className={`${boxClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${boxClass} flex shrink-0 items-center justify-center rounded-full ${fallbackClass}`}
    >
      {initial}
    </div>
  );
}

async function DashboardInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] text-[#4A2638]">
      {/* Sidebar */}
      <aside className="group fixed inset-y-0 left-0 z-50 flex w-16 flex-col justify-between overflow-hidden whitespace-nowrap border-r border-[#F9A8D4] bg-[#FFF8FC] text-[#9D6480] shadow-sm transition-[width] duration-300 ease-in-out hover:w-64 hover:shadow-lg">
        {/* Brand and Navigation */}
        <div>
          <div className="flex h-16 items-center px-3.5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#F9A8D4] bg-[#FCE7F3] text-[#BE185D] shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Feather size={20} />
              </div>

              <span className="max-w-0 -translate-x-3 overflow-hidden text-sm font-bold uppercase tracking-wider text-[#BE185D] opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[150px] group-hover:translate-x-0 group-hover:opacity-100">
                Delululu
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav
            aria-label="Main navigation"
            className="mt-4 flex flex-col gap-1.5 px-2.5"
          >
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group/nav flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-xs font-medium text-[#9D6480] transition-all duration-200 hover:border-[#F9A8D4] hover:bg-[#FCE7F3] hover:text-[#BE185D] hover:shadow-sm"
                >
                  <Icon
                    size={19}
                    className="shrink-0 transition-transform duration-200 group-hover/nav:scale-110"
                  />

                  <span className="max-w-0 -translate-x-3 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[180px] group-hover:translate-x-0 group-hover:opacity-100">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile and Logout */}
        <div className="border-t border-[#F9A8D4]/60 p-3">
          <div className="mb-2 flex items-center gap-3 px-1">
            <Avatar
              name={user.name}
              avatar={user.avatar}
              boxClass="h-8 w-8 border border-[#F9A8D4] shadow-sm transition-transform duration-300 group-hover:scale-105"
              fallbackClass="bg-[#FCE7F3] text-xs font-bold text-[#BE185D]"
            />

            <div className="max-w-0 -translate-x-3 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[160px] group-hover:translate-x-0 group-hover:opacity-100">
              <p className="text-xs font-semibold text-[#4A2638]">
                {user.name}
              </p>
              <p className="text-[10px] text-[#9D8291]">Writer</p>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              title="Log out"
              className="flex w-full items-center gap-3 rounded-xl border border-transparent px-2.5 py-2 text-xs font-medium text-[#9D6480] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} className="shrink-0" />

              <span className="max-w-0 -translate-x-3 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-w-[160px] group-hover:translate-x-0 group-hover:opacity-100">
                Log out
              </span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-h-screen flex-col pl-16">
        {/* Header */}
        <header className="flex h-16 items-center justify-end border-b border-[#F9A8D4]/60 bg-[#FFFDF7] px-6">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[#4A2638]">
                {user.name}
              </p>
              <p className="text-xs text-[#9D8291]">My account</p>
            </div>

            <Avatar
              name={user.name}
              avatar={user.avatar}
              boxClass="h-9 w-9 border border-[#F9A8D4] shadow-sm"
              fallbackClass="bg-[#FCE7F3] font-semibold text-[#BE185D]"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="w-full flex-1 bg-[#FFFDF7] p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FFFDF7] text-sm text-[#9D8291]">
          Loading dashboard...
        </div>
      }
    >
      <DashboardInner>{children}</DashboardInner>
    </Suspense>
  );
}
