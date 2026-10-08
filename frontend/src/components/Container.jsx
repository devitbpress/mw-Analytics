import React from 'react';

export default function Container({ children, narrow = false, className = '' }) {
  const classes = `mwa-container ${narrow ? 'mwa-container--narrow' : ''} ${className}`.trim();
  return <div className={classes}>{children}</div>;
}
