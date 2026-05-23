import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AudiencesSection from "@/components/audiences-section"
import FeaturedProperties from "@/components/featured-properties"
import PromotionsSection from "@/components/promotions-section"
import Testimonials from "@/components/testimonials"
import StatsSection from "@/components/stats-section"
import CtaSection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <AudiencesSection />
      <FeaturedProperties />
      <PromotionsSection />
      <Testimonials />
      <StatsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
