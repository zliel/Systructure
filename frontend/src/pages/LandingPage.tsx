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
      <Header />

      <main>
        <Hero />
        <ProductDemo />
        <Benefits />
        <EarlyAccess />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
