import React from 'react';
import Section from './Section';
import Button from './Button';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

export default function ContactSection({ siteConfig, title = "Ready to verify your complex operational decisions?", subtitle = "Contact us today to discuss how our data analysis, simulation models, and predictive tools can bring clarity to your organization." }) {
  const email = siteConfig?.email || 'meditya@mw-analytics.id';
  const address = siteConfig?.address || 'Ganesha Street No. 10, Bandung, West Java, Indonesia';
  const links = siteConfig?.links || {};
  const mailtoUrl = `mailto:${email}`;

  return (
    <Section variant="dark" centered className="mwa-contact-section">
      <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '16px' }}>{title}</h2>
      <p style={{ fontSize: '1.1rem', color: '#D1D5DB', maxWidth: '640px', margin: '0 auto 32px' }}>
        {subtitle}
      </p>

      <div style={{ marginBottom: '32px' }}>
        <Button
          href={mailtoUrl}
          variant="primary"
          size="large"
          style={{ backgroundColor: 'var(--color-accent)', color: '#0F1B33', borderColor: 'var(--color-accent)' }}
        >
          <Mail size={18} /> Contact Meditya Wasesa Analytics
        </Button>
      </div>

      <div className="mwa-contact-details">
        <div className="mwa-contact-detail-item">
          <MapPin size={18} />
          <span>{address}</span>
        </div>

        <div className="mwa-contact-links-row">
          {links.scholar && (
            <a href={links.scholar} target="_blank" rel="noopener noreferrer" className="mwa-contact-link">
              Google Scholar <ExternalLink size={14} />
            </a>
          )}
          {links.linkedin && (
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="mwa-contact-link">
              LinkedIn <ExternalLink size={14} />
            </a>
          )}
          {links.orcid && (
            <a href={links.orcid} target="_blank" rel="noopener noreferrer" className="mwa-contact-link">
              ORCID <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
