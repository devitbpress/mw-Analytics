import React from 'react';

export default function Tag({ children, className = '' }) {
  return <span className={`mwa-tag ${className}`.trim()}>{children}</span>;
}
