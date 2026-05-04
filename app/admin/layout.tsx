"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  MapPin,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Tag,
  Star,
  CalendarCheck,
  Bell,
} from "lucide-react"

interface SessionUser {
  id: number
  nom: string
  email: string
  role: string
}

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/biens", label: "Gestion des biens", icon: Building2 },
  { href: "/admin/reservations", label: "R\u00e9servations", icon: CalendarCheck },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/avis", label: "Avis clients", icon: Star },
  { href: "/admin/promotions", label: "Promotions", icon: Tag },
  { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/localites", label: "Localit\u00e9s", icon: MapPin },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/connexion")
        } else {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => {
        router.push("/connexion")
        setLoading(false)
      })
  }, [router])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/connexion")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#0B1F3A] border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-secondary">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0B1F3A] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-[#C9A227]" />
              <span className="font-heading text-lg font-bold text-white">
                Niresse<span className="text-[#C9A227]">House</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white lg:hidden"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="mx-4 mb-4 rounded-lg bg-white/5 px-3 py-3">
            <p className="text-sm font-medium text-white">{user.nom}</p>
            <p className="text-xs text-white/50 capitalize">{user.role.replace("_", " ")}</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#C9A227] text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {"D\u00e9connexion"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-foreground lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-heading text-base font-semibold text-foreground">
              {navItems.find((n) => n.href === pathname)?.label || "Administration"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Voir le site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
