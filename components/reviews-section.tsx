"use client"

import { useState } from "react"
import { Star, User, MessageSquare, Send, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/types"

interface ReviewsSectionProps {
  propertyId: number
  reviews: Review[]
  averageRating?: number
  totalReviews?: number
}

export default function ReviewsSection({ propertyId, reviews, averageRating = 0, totalReviews = 0 }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          user_name: name,
          user_email: email || null,
          note: rating,
          commentaire: comment,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'envoi")
      }

      setSubmitted(true)
      setShowForm(false)
      setName("")
      setEmail("")
      setRating(5)
      setComment("")
    } catch (err) {
      console.error("[reviews-section] submit error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.floor(r.note) === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => Math.floor(r.note) === stars).length / reviews.length) * 100 : 0
  }))

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-card-foreground">
          <MessageSquare className="h-5 w-5 text-[#C9A227]" />
          Avis clients
        </h2>
        {!showForm && !submitted && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            size="sm"
            className="border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227]/10"
          >
            Laisser un avis
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="mb-6 flex flex-col gap-6 rounded-lg bg-muted/50 p-4 sm:flex-row sm:items-center">
          <div className="text-center">
            <p className="font-heading text-4xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
            <div className="mt-1 flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(averageRating) ? "fill-[#C9A227] text-[#C9A227]" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{totalReviews} avis</p>
          </div>
          <div className="flex-1">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-muted-foreground">{stars} {"e\u0301toiles"}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[#C9A227]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitted && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <ThumbsUp className="mx-auto mb-2 h-8 w-8 text-green-500" />
          <p className="font-medium text-green-800">Merci pour votre avis !</p>
          <p className="text-sm text-green-600">Il sera publi{"e\u0301"} apr{"e\u0300s"} validation par notre {"e\u0301quipe"}.</p>
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-lg border border-border bg-background p-4">
          <h3 className="mb-4 font-heading text-base font-semibold text-foreground">Partagez votre exp{"e\u0301rience"}</h3>
          
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Votre nom *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Email (optionnel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                placeholder="jean@email.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Note *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-0.5 transition hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${star <= rating ? "fill-[#C9A227] text-[#C9A227]" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Votre commentaire *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none"
             placeholder="Partagez votre expérience avec ce bien..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !name || !comment}
              className="bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{review.user_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date_creation).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${star <= review.note ? "fill-[#C9A227] text-[#C9A227]" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.commentaire}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm && !submitted && (
        <div className="py-8 text-center">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">Aucun avis pour le moment</p>
          <p className="text-xs text-muted-foreground/70">Soyez le premier {"a\u0300"} laisser un avis !</p>
        </div>
      )}
    </section>
  )
}
