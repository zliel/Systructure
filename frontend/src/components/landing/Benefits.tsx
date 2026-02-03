import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Workflow,
  // Users,
  Download,
  // History,
  // Lock,
  Layers,
} from 'lucide-react';

const benefits = [
  {
    icon: Workflow,
    title: 'Visual Flow Design',
    description: 'Drag and drop components to build your system architecture. No more wrestling with drawing tools.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  // {
  //   icon: Users,
  //   title: 'Real-time Collaboration',
  //   description: 'Work together with your team in real-time. See changes as they happen and stay in sync.',
  //   color: 'text-blue-500',
  //   bgColor: 'bg-blue-500/10',
  // },
  {
    icon: Download,
    title: 'Export to Docker Compose',
    description: 'Export your diagrams straight to Docker Compose files. Share with stakeholders or deploy directly.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  // {
  //   icon: History,
  //   title: 'Version History',
  //   description: 'Track every change with automatic versioning. Roll back to any previous state with one click.',
  //   color: 'text-amber-500',
  //   bgColor: 'bg-amber-500/10',
  // },
  // {
  //   icon: Lock,
  //   title: 'Enterprise Security',
  //   description: 'Your diagrams are encrypted at rest and in transit. SOC 2 compliant and GDPR ready.',
  //   color: 'text-red-500',
  //   bgColor: 'bg-red-500/10',
  // },
  {
    icon: Layers,
    title: 'Component Library',
    description: 'Start with pre-built components covering the majority of common use-cases',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
];

export function Benefits() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-muted/30">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[6rem_6rem] opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Design
            <br />
            <span className="text-primary">Better Systems</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From solo developers to enterprise teams, Systructure gives you the tools
            to visualize, document, and share your system architecture.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Connection Node Decoration */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors" />

              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl ${benefit.bgColor} mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

