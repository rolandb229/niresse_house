import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'NiresseHouse - Location, Vente, H\u00f4tels et Auberges au B\u00e9nin',
  description:
    'NiresseHouse, votre plateforme immobili\u00e8re au B\u00e9nin. Location, vente, auberges, h\u00f4tels, appartements meubl\u00e9s dans toutes les villes du B\u00e9nin. Trouvez votre bien id\u00e9al !',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
