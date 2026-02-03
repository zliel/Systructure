import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Github } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Animated Connection Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" viewBox="0 0 1200 800" fill="none" preserveAspectRatio="xMidYMid slice">
          {/* Connection Line 1 */}
          <path
            d="M100,200 Q300,150 400,300 T600,250"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            opacity="0.3"
          />
          {/* Connection Line 2 */}
          <path
            d="M800,100 Q900,200 850,350 T1000,400"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
            opacity="0.3"
          />
          {/* Connection Line 3 */}
          <path
            d="M200,500 Q400,450 500,550 T700,500"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
            opacity="0.3"
          />

          {/* Node Points */}
          <circle cx="100" cy="200" r="6" className="fill-primary/40" />
          <circle cx="600" cy="250" r="6" className="fill-primary/40" />
          <circle cx="800" cy="100" r="6" className="fill-primary/40" />
          <circle cx="1000" cy="400" r="6" className="fill-primary/40" />
          <circle cx="200" cy="500" r="6" className="fill-primary/40" />
          <circle cx="700" cy="500" r="6" className="fill-primary/40" />

          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.59 0.26 323)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.59 0.26 323)" stopOpacity="1" />
              <stop offset="100%" stopColor="oklch(0.59 0.26 323)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.67 0.26 322)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.67 0.26 322)" stopOpacity="1" />
              <stop offset="100%" stopColor="oklch(0.67 0.26 322)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
        {/* Announcement Badge */}
        <Badge variant="secondary" className="mb-6 gap-2 px-4 py-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-primary" />
          Free & Open Source
        </Badge>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Design Your System
          <br />
          <span className="text-primary">Architecture Visually</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
          The intuitive flow-based editor for designing, documenting, and sharing
          your system architecture. Built for developers who think visually.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" asChild className="text-base px-8 h-12 gap-2">
            <Link to="/signup">
              Start Building — It's Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 h-12 gap-2">
            <a href="https://github.com/systructure" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Early Adopter Message instead of fake stats */}
        <p className="text-sm text-muted-foreground">
          ✨ Be among the first to try Systructure. No credit card required.
        </p>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
