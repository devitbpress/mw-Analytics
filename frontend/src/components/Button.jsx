import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'medium', // 'small' | 'medium' | 'large'
  to,
  href,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  target,
  rel
}) {
  let sizeClass = '';
  if (size === 'small') sizeClass = 'mwa-button--small';
  if (size === 'large') sizeClass = 'mwa-button--large';

  const classes = `mwa-button mwa-button--${variant} ${sizeClass} ${className}`.trim();

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (href && !disabled) {
    return (
      <a href={href} className={classes} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
