import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5">
          {/* Blueprint Corner Decorations */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-primary/30" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-primary/30" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-primary/30" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-primary/30" />

          {/* Animated Background Nodes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary animate-pulse" />
            <div className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-1/2 right-1/4 w-5 h-5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '1.5s' }} />
          </div>

          <CardContent className="relative p-12 md:p-16 text-center">
            {/* Icon */}
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to Visualize Your Architecture?
            </h2>

            {/* Subheadline */}
            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
              Start designing your system architecture today. It's completely free,
              no strings attached.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-base px-8 h-12 gap-2">
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
                <a href="https://github.com/zliel/systructure" target="_blank" rel="noopener noreferrer">
                  View Source Code
                </a>
              </Button>
            </div>

            {/* Trust Signal */}
            <p className="mt-6 text-sm text-muted-foreground">
              ✓ 100% free &nbsp;•&nbsp; ✓ Open source &nbsp;•&nbsp; ✓ No credit card required
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
