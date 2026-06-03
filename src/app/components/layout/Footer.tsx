import React from 'react';
import { Link } from 'react-router';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--card)] border-t border-[var(--border)] mt-12 sm:mt-20">
      <div className="container mx-auto py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <BrandLogo size="md" className="mb-4" />
            <p className="text-[var(--muted-foreground)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Curated, contemporary fashion designed for confidence and comfort.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Quick Links</h4>
            <ul className="space-y-2" style={{ fontFamily: 'var(--font-body)' }}>
              <li><Link to="/shop" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Contact</Link></li>
              <li><Link to="/track-order" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Customer Care</h4>
            <ul className="space-y-2" style={{ fontFamily: 'var(--font-body)' }}>
              <li><Link to="/faq" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Get in Touch</h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-body)' }}>
              <li className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@sukafashions.com" className="hover:text-[var(--primary)]">hello@sukafashions.com</a>
              </li>
              <li className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Phone className="w-4 h-4" />
                <a href="tel:+919876543210" className="hover:text-[var(--primary)]">+91 98765 43210</a>
              </li>
              <li className="flex items-start gap-2 text-[var(--muted-foreground)]">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Fashion Street, Mumbai, Maharashtra 400001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-8 text-center text-[var(--muted-foreground)]" style={{ fontFamily: 'var(--font-body)' }}>
          <p>&copy; 2026 Suka Fashions. All rights reserved. Crafted with elegance.</p>
        </div>
      </div>
    </footer>
  );
};

