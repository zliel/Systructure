import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { ProductDemo } from '@/components/landing/ProductDemo';
import { Benefits } from '@/components/landing/Benefits';
import { EarlyAccess } from '@/components/landing/EarlyAccess';
import { FAQ } from '@/components/landing/FAQ';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header (Element 2: Logo) */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section (Elements 3, 4, 5: Title, CTA, Social Proof) */}
        <Hero />

        {/* Product Demo (Element 6: Images/Videos) */}
        <ProductDemo />

        {/* Benefits Section (Element 7: Core Benefits/Features) */}
        <Benefits />

        {/* Early Access Section (Replaces Testimonials for early-stage product) */}
        <EarlyAccess />

        {/* FAQ Section (Element 9: FAQ) */}
        <FAQ />

        {/* Final CTA (Element 10: Bottom CTA) */}
        <FinalCTA />
      </main>

      {/* Footer (Element 11: Contact/Legal) */}
      <Footer />
    </div>
  );
}
