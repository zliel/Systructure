import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Systructure?',
    answer: 'Systructure is a visual system architecture editor that helps developers design, document, and share their system architecture through an intuitive flow-based interface. Think of it as a specialized tool for creating architecture diagrams that actually stay up to date.',
  },
  {
    question: 'Is Systructure free?',
    answer: 'Yes! Systructure is completely free to use. We believe that every developer should have access to great architecture tools without barriers. Create unlimited projects and diagrams at no cost.',
  },
  {
    question: 'Is this open source?',
    answer: 'Yes, Systructure is open source. You can view the code, report issues, and contribute on our GitHub repository. We welcome contributions from the community!',
  },
  {
    question: 'What export formats are supported?',
    answer: 'Systructure currently only supports exporting to a Docker Compose file, but exporting to SVG/PNG is on the roadmap as well.',
  },
  {
    question: 'Can I use this for my team?',
    answer: 'Absolutely! While we\'re still in early development, you can already use Systructure for your projects. Team collaboration features are on our roadmap and coming soon.',
  },
  {
    question: 'What types of diagrams can I create?',
    answer: 'Systructure is designed for system architecture diagrams; think things like microservices, API flows, infrastructure layouts, and data pipelines. You can create nodes for services, databases, APIs, and more, then connect them to show how your system components interact.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, your diagrams are stored securely. All data is encrypted in transit using HTTPS. As an open source project, you can also self-host Systructure if you prefer to keep everything on your own infrastructure.',
  },
  {
    question: 'How can I contribute or give feedback?',
    answer: 'We love hearing from users! You can open issues or pull requests on our GitHub repository, or reach out directly via email. Your feedback helps shape the future of Systructure.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. If you can't find what you need,{' '}
            <a href="mailto:hello@systructure.io" className="text-primary hover:underline">
              reach out to us
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border/50 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
