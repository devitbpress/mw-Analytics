import React from 'react';

export default function Card({ children, interactive = false, className = '', onClick }) {
  const classes = `mwa-card ${interactive ? 'mwa-card--interactive' : ''} ${className}`.trim();
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
