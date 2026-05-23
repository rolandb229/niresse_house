"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  CalendarCheck,
  Heart,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

interface SessionUser {
  id: number
  nom: string
  email: string
  role: string
}

const navItems = [
  { href: "/mon-compte", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/mes-reservations", label: "Mes réservations", icon: CalendarCheck },
  { href: "/mes-favoris", label: "Mes favoris", icon: Heart },
  { href: "/mes-demandes", label: "Mes demandes de visite", icon: MessageSquare },
]

const ADMIN_ROLES = ["super_admin", "admin", "commercial"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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
        } else if (ADMIN_ROLES.includes(data.user.role)) {
          router.push("/admin")
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
    router.push("/")
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-6 w-6 text-[#C9A227]" />
              <span className="font-heading text-lg font-bold text-[#0B1F3A]">
                Niresse<span className="text-[#C9A227]">House</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-4 mb-4 rounded-lg bg-secondary px-3 py-3">
            <p className="text-sm font-medium text-foreground">{user.nom}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>

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
                      ? "bg-[#0B1F3A] text-white"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              )
            })}
          </nav>

          <div className="px-3 pb-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
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
              {navItems.find((n) => n.href === pathname)?.label || "Mon espace"}
            </h2>
          </div>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Retour au site
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
