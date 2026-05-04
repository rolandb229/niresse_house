"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, LogIn, Eye, EyeOff, AlertCircle, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur de connexion.")
        return
      }

      router.push("/admin")
    } catch {
      setError("Impossible de joindre le serveur. Vérifiez que XAMPP est démarré.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Home className="h-8 w-8 text-[#C9A227]" />
            <span className="font-heading text-2xl font-bold text-[#0B1F3A]">
              Niresse<span className="text-[#C9A227]">House</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Connectez-vous à votre espace"}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="mb-6 text-center font-heading text-xl font-bold text-card-foreground">
            Connexion
          </h1>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Adresse email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Insérez votre adresse gmail ici"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* DB Info */}
          <div className="mt-6 rounded-lg bg-secondary p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Database className="h-3.5 w-3.5 text-[#0B1F3A]" />
              Connexion MySQL (XAMPP)
            </div>
            <p className="text-xs text-muted-foreground">
              Identifiant admin : <span className="font-medium text-foreground">niressedigital@gmail.com</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Mot de passe : <span className="font-medium text-foreground">admin123</span>
            </p>
            <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground">
              Assurez-vous que XAMPP est démarré (Apache + MySQL) et que la base{" "}
              <span className="font-medium text-foreground">niressehouse</span> est importée via phpMyAdmin.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-[#0B1F3A] hover:underline">
            {"Retour à l'accueil"}
          </Link>
        </p>
      </div>
    </main>
  )
}
