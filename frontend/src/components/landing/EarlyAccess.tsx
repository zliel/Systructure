import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Rocket,
  MessageSquare,
  Github,
  Heart,
} from 'lucide-react';

export function EarlyAccess() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Early Access
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Join Us in Building
            <br />
            <span className="text-primary">Something Great</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Systructure is in active development. Be among the first to use it and help
            shape the future of visual architecture design.
          </p>
        </div>

        {/* Three Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Start Building Card */}
          <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Building</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Create your free account and start designing your system architecture today. No credit card required.
              </p>
              <Button asChild className="w-full">
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Give Feedback Card */}
          <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-6">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Give Feedback</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Found a bug? Have a feature request? Your feedback directly shapes what we build next.
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="mailto:zpliel@gmail.com">Share Feedback</a>
              </Button>
            </CardContent>
          </Card>

          {/* Contribute Card */}
          <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-6">
                <Github className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contribute</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Systructure is open source. Check out our GitHub and contribute to the project.
              </p>
              <Button variant="outline" asChild className="w-full">
                <a href="https://github.com/zliel/systructure" target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Built with love for developers who think visually
          </p>
        </div>
      </div>
    </section>
  );
}

