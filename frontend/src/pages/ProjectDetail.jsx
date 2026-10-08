import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Section from '../components/Section';
import Container from '../components/Container';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Tag from '../components/Tag';
import ProjectCard from '../components/ProjectCard';
import Lightbox from '../components/Lightbox';
import NotFound from './NotFound';
import {
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Tag as TagIcon,
  User,
  Building
} from 'lucide-react';

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetch(`/api/projects/${slug}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setProject(data);
          document.title = `${data.title} | Meditya Wasesa Analytics`;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <Section variant="default">
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading project details...</p>
        </div>
      </Section>
    );
  }

  if (notFound || !project) {
    return <NotFound />;
  }

  const {
    title,
    summary,
    description,
    year,
    category,
    role,
    client_label,
    proof_url,
    proof_type = 'website',
    technologies = [],
    outcomes = [],
    screenshots = [],
    related_projects = [],
    prev_slug,
    next_slug,
    dummy
  } = project;

  // Proof button CTA label determination
  let buttonCtaText = 'Open live project';
  if (proof_type === 'website') buttonCtaText = 'Open live website';
  if (proof_type === 'simulation') buttonCtaText = 'Open interactive simulation';
  if (proof_type === 'dashboard') buttonCtaText = 'Open live dashboard';
  if (proof_type === 'paper') buttonCtaText = 'View publication paper';

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      <Section variant="default" style={{ paddingTop: '32px' }}>
        {/* Breadcrumb Navigation */}
        <div className="mwa-breadcrumb">
          <Link to="/projects">Projects</Link>
          <ChevronRight size={14} />
          <span>{title}</span>
        </div>

        {/* Header Block */}
        <div className="mwa-detail-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <Badge variant="default">{proof_type.toUpperCase()}</Badge>
            {dummy && <Badge variant="dummy">Dummy</Badge>}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '12px' }}>{title}</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-muted)', maxWidth: '780px', lineHeight: '1.6' }}>{summary}</p>

          {/* Meta Info Row */}
          <div className="mwa-detail-meta">
            <div className="mwa-meta-item">
              <span className="mwa-meta-label">Year</span>
              <span className="mwa-meta-val">{year}</span>
            </div>
            <div className="mwa-meta-item">
              <span className="mwa-meta-label">Category</span>
              <span className="mwa-meta-val">{category}</span>
            </div>
            {role && (
              <div className="mwa-meta-item">
                <span className="mwa-meta-label">Role</span>
                <span className="mwa-meta-val">{role}</span>
              </div>
            )}
            {client_label && (
              <div className="mwa-meta-item">
                <span className="mwa-meta-label">Client / Context</span>
                <span className="mwa-meta-val">{client_label}</span>
              </div>
            )}
          </div>

          {/* Primary Action Button (Proof Link) */}
          <div style={{ marginTop: '28px' }}>
            <Button
              href={proof_url}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="large"
              data-umami-event="proof-click"
              data-umami-event-project={slug}
            >
              {buttonCtaText} <ExternalLink size={18} />
            </Button>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Opens an external site in a new tab
            </span>
          </div>
        </div>

        {/* Overview Description (Markdown) */}
        {description && (
          <div style={{ marginTop: '40px', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>Project Overview</h2>
            <div className="mwa-article-content">
              <ReactMarkdown>{description}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Outcomes Section */}
        {outcomes.length > 0 && (
          <div style={{ marginTop: '40px', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>Key Outcomes & Results</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {outcomes.map((out, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '1rem', lineHeight: '1.5' }}>
                  <CheckCircle2 size={18} color="var(--color-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Section */}
        {technologies.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>Technologies & Tools</h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {technologies.map((tech, idx) => (
                <Tag key={idx}>{tech}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots Gallery & Lightbox */}
        {screenshots.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary-dark)' }}>Screenshots & Visuals</h2>
            <div className="mwa-screenshots-grid">
              {screenshots.map((sc, idx) => (
                <div key={idx} className="mwa-screenshot-item" onClick={() => openLightbox(idx)}>
                  <img src={sc.src} alt={sc.alt || title} className="mwa-screenshot-img" loading="lazy" />
                  {sc.caption && (
                    <p style={{ padding: '8px 12px', fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      {sc.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Lightbox
              isOpen={lightboxOpen}
              screenshots={screenshots}
              currentIndex={lightboxIndex}
              onClose={() => setLightboxOpen(false)}
              onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : screenshots.length - 1))}
              onNext={() => setLightboxIndex((prev) => (prev < screenshots.length - 1 ? prev + 1 : 0))}
            />
          </div>
        )}

        {/* Previous / Next Links Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '64px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
          {prev_slug ? (
            <Link to={`/projects/${prev_slug}`} className="mwa-button mwa-button--secondary mwa-button--small">
              <ArrowLeft size={16} /> Previous Project
            </Link>
          ) : <div />}

          {next_slug && (
            <Link to={`/projects/${next_slug}`} className="mwa-button mwa-button--secondary mwa-button--small">
              Next Project <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </Section>

      {/* Related Projects Section */}
      {related_projects.length > 0 && (
        <Section variant="soft" title="Related Projects" subtitle="Other analytics and simulation projects in related domains.">
          <div className="mwa-featured-grid">
            {related_projects.map((rel) => (
              <ProjectCard key={rel.slug} project={rel} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
