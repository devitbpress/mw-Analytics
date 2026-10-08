import React from 'react';
import logoHorizontal from '../assets/logo/logo-horizontal.svg';
import logoHorizontalDark from '../assets/logo/logo-horizontal-on-dark.svg';
import logoIcon from '../assets/logo/logo-icon.svg';
import logoIconDark from '../assets/logo/logo-icon-on-dark.svg';

export default function Logo({ variant = 'horizontal', dark = false, alt = 'MW Analytics', className = '', style = {} }) {
  let src = logoHorizontal;
  
  if (variant === 'icon') {
    src = dark ? logoIconDark : logoIcon;
  } else {
    src = dark ? logoHorizontalDark : logoHorizontal;
  }

  return <img src={src} alt={alt} className={className} style={{ height: '38px', width: 'auto', display: 'block', ...style }} />;
}
