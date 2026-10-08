import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  // variant: 'default' | 'q1' | 'q2' | 'q3' | 'q4' | 'dummy'
  const vClass = `mwa-badge--${variant.toLowerCase()}`;
  return <span className={`mwa-badge ${vClass} ${className}`.trim()}>{children}</span>;
}
