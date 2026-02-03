import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import {
  Workflow,
  Heart,
  Code2,
  Users,
  Lightbulb,
  Github,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-6">
              About Systructure
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Built by Developers,
              <br />
              <span className="text-primary">For Developers</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Systructure started as a simple idea: make system architecture design
              as intuitive as whiteboarding.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-3">The Problem</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Architecture documentation is often an afterthought. Diagrams get
                    outdated, scattered across different tools, and disconnected from
                    the actual codebase. Teams waste time re-explaining systems that
                    should be self-documenting.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-8">
                  <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 mb-4">
                    <Workflow className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-semibold mb-3">Our Solution</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A visual editor that makes creating and maintaining architecture
                    diagrams fast and enjoyable. Think of it as a combo
                    diagramming tool + development environment, designed
                    specifically for how engineers think.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                What We Believe
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                The principles that guide how we build Systructure.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <Code2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Open Source First</h3>
                <p className="text-sm text-muted-foreground">
                  Great tools should be accessible to everyone. We build in the open
                  and welcome contributions.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-4">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Developer Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Every feature is designed with developers in mind. If it's not
                  intuitive, we haven't finished building it.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 mb-4">
                  <Heart className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="font-semibold mb-2">Honest & Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  We're in early development. We share our progress, listen to feedback,
                  and build what actually helps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Early Stage Banner */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-4">
              🚧 Work in Progress
            </Badge>
            <h2 className="text-2xl font-bold mb-4">
              We're Just Getting Started
            </h2>
            <p className="text-muted-foreground mb-6">
              Systructure is under active development. Features are being added,
              rough edges are being polished, and we're learning as we go.
              Your feedback shapes what we build next.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <a href="https://github.com/systructure" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Follow on GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:hello@systructure.io">
                  <Mail className="h-4 w-4 mr-2" />
                  Get in Touch
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Try It?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start designing your system architecture today. It's free, open source,
              and we'd love to hear what you think.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

