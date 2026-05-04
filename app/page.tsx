import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PromotionsSection from "@/components/promotions-section"
import FeaturedProperties from "@/components/featured-properties"
import RecentListings from "@/components/recent-listings"
import Testimonials from "@/components/testimonials"
import TrustSection from "@/components/trust-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <PromotionsSection />
      <FeaturedProperties />
      <RecentListings />
      <Testimonials />
      <TrustSection />
      <Footer />
    </main>
  )
}
