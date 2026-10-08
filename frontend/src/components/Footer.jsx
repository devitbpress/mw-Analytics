import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Container from './Container';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ siteConfig }) {
  const name = siteConfig?.name || 'Meditya Wasesa Analytics';
  const tagline = siteConfig?.tagline || 'Data analysis, simulation, and machine learning for evidence-based decisions.';
  const email = siteConfig?.email || 'email@example.com';
  const address = siteConfig?.address || 'Placeholder address, Bandung, Indonesia';
  const links = siteConfig?.links || {};

  return (
    <footer className="mwa-footer">
      <Container>
        <div className="mwa-footer-grid">
          {/* Brand Column */}
          <div className="mwa-footer-brand">
            <Link to="/">
              <Logo variant="horizontal" dark style={{ height: '38px', marginBottom: '16px' }} />
            </Link>
            <p className="mwa-footer-tagline">{tagline}</p>
          </div>

          {/* Navigation Column */}
          <div className="mwa-footer-col">
            <h4 className="mwa-footer-heading">Navigation</h4>
            <ul className="mwa-footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/overview">Profil</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/publications">Publications</Link></li>
              <li><Link to="/insights">Insights</Link></li>
            </ul>
          </div>

          {/* Contact & Profiles Column */}
          <div className="mwa-footer-col">
            <h4 className="mwa-footer-heading">Contact & Profiles</h4>
            <ul className="mwa-footer-list mwa-footer-contact">
              <li>
                <Mail size={16} />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <MapPin size={16} />
                <span>{address}</span>
              </li>
              {links.scholar && (
                <li>
                  <ExternalLink size={16} />
                  <a href={links.scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a>
                </li>
              )}
              {links.linkedin && (
                <li>
                  <ExternalLink size={16} />
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </li>
              )}
              {links.orcid && (
                <li>
                  <ExternalLink size={16} />
                  <a href={links.orcid} target="_blank" rel="noopener noreferrer">ORCID</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="mwa-footer-bottom">
          <p>© 2026 Meditya Wasesa Analytics. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
