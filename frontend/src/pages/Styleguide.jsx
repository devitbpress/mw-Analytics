import React from 'react';
import Section from '../components/Section';
import Container from '../components/Container';
import Button from '../components/Button';
import Card from '../components/Card';
import Tag from '../components/Tag';
import Badge from '../components/Badge';
import Logo from '../components/Logo';

export default function Styleguide() {
  return (
    <div>
      <Section title="Design System & Component Styleguide" subtitle="Meditya Wasesa Analytics UI Foundation review page.">
        
        {/* Logos Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Logo Variants</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', padding: '20px', background: 'var(--color-bg-soft)', borderRadius: '12px' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Horizontal (Light bg)</p>
              <Logo variant="horizontal" style={{ height: '36px' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Icon Only (Light bg)</p>
              <Logo variant="icon" style={{ height: '36px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', padding: '20px', background: 'var(--color-primary-dark)', borderRadius: '12px', marginTop: '12px' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#A0AEC0' }}>Horizontal (Dark bg)</p>
              <Logo variant="horizontal" dark style={{ height: '36px' }} />
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#A0AEC0' }}>Icon Only (Dark bg)</p>
              <Logo variant="icon" dark style={{ height: '36px' }} />
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Buttons</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" disabled>Disabled Primary</Button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="small">Small Button</Button>
            <Button variant="primary" size="medium">Medium Button</Button>
            <Button variant="primary" size="large">Large Button</Button>
          </div>
        </div>

        {/* Badges & Tags Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Badges & Tags</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge variant="q1">Q1 Journal</Badge>
            <Badge variant="q2">Q2 Journal</Badge>
            <Badge variant="q3">Q3 Journal</Badge>
            <Badge variant="q4">Q4 Journal</Badge>
            <Badge variant="dummy">Dummy Data</Badge>
            <Badge variant="default">Default Badge</Badge>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Tag>Python</Tag>
            <Tag>Geospatial</Tag>
            <Tag>AnyLogic</Tag>
            <Tag>Machine Learning</Tag>
            <Tag>React</Tag>
          </div>
        </div>

        {/* Cards Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Cards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <Card>
              <h4>Static Card</h4>
              <p style={{ color: 'var(--color-text-muted)' }}>Standard card container with border and subtle shadow.</p>
            </Card>
            <Card interactive>
              <h4>Interactive Card</h4>
              <p style={{ color: 'var(--color-text-muted)' }}>Hover over this card to see elevation transition.</p>
              <Tag>Interactive</Tag>
            </Card>
          </div>
        </div>

      </Section>

      {/* Section Variants */}
      <Section title="Soft Background Section" subtitle="Section component with soft light tint background." variant="soft">
        <p>Content inside soft background section.</p>
      </Section>

      <Section title="Dark Background Section" subtitle="Section component with primary dark background." variant="dark">
        <p>Content inside dark background section with auto white text contrast.</p>
        <Button variant="primary">Action on Dark</Button>
      </Section>
    </div>
  );
}
