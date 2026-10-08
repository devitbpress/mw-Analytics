import React from 'react';
import Container from './Container';
import heroBgImage from '../assets/images/meditya-wasesa.jpeg';

export default function Hero() {
  return (
    <div
      className="mwa-hero mwa-hero--seattle"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.88)), url(${heroBgImage})`
      }}
    >
      <Container className="mwa-hero-container">
        <div className="mwa-hero-content mwa-hero-content--centered">
          <h1 className="mwa-hero-headline mwa-hero-headline--large">
            Simplifying Data Infrastructure, Amplifying Business Growth
          </h1>
          <p className="mwa-hero-subline mwa-hero-subline--medium">
            Powered by Data Science, Analytics & Simulation Expertise
          </p>
        </div>
      </Container>

      {/* Modern Curved Bottom Divider (Inspired by reference, distinct custom shape) */}
      <div className="mwa-hero-bottom-divider">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="mwa-hero-wave-svg">
          <path
            d="M0,35 C360,85 720,10 1080,60 C1260,85 1380,45 1440,30 L1440,90 L0,90 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>
  );
}
