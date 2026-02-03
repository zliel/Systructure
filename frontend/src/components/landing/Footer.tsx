import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Workflow, Github, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    // { name: 'Changelog', href: '/changelog' },
    // { name: 'Roadmap', href: '/roadmap' },
  ],
  resources: [
    // { name: 'API Reference', href: '/api' },
    // { name: 'Tutorials', href: '/tutorials' },
    // { name: 'Blog', href: '/blog' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: 'mailto:zpliel@gmail.com' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/zliel/systructure', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/zliel/', icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Workflow className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Systructure</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The visual system architecture editor for developers who think visually.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

