import React from 'react';
import Container from './Container';

export default function Section({
  children,
  title,
  subtitle,
  centered = false,
  variant = 'default', // 'default' | 'soft' | 'dark'
  narrow = false,
  className = '',
  id
}) {
  const sectionClass = `mwa-section mwa-section--${variant} ${className}`.trim();
  const headerClass = `mwa-section-header ${centered ? 'mwa-section-header--centered' : ''}`.trim();

  return (
    <section className={sectionClass} id={id}>
      <Container narrow={narrow}>
        {(title || subtitle) && (
          <div className={headerClass}>
            {title && <h2 className="mwa-section-title">{title}</h2>}
            {subtitle && <p className="mwa-section-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
