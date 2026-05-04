import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formater un prix en Francs CFA (XOF) avec le bon suffixe selon le type de bien
export function formatPrice(prix: number, type: string): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(prix)

  if (["location", "court_sejour", "chambre_meublee", "appartement_meuble"].includes(type)) {
    return `${formatted}/mois`
  }
  if (["auberge", "hotel"].includes(type)) {
    return `${formatted}/nuit`
  }
  return formatted
}
