import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Tag from './Tag';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const {
    slug,
    title,
    summary,
    thumbnail,
    highlights = [],
    tags = [],
    proof_type = 'website',
    dummy = false
  } = project;

  // Format proof type badge label
  const proofLabel = proof_type.charAt(0).toUpperCase() + proof_type.slice(1);

  return (
    <Card className="mwa-featured-card">
      {/* Thick Primary Top Accent Bar */}
      <div className="mwa-featured-card-topbar" />

      <div className="mwa-featured-card-body">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Badge variant="default">{proofLabel}</Badge>
          {dummy && <Badge variant="dummy">Dummy</Badge>}
        </div>
        
        <h3 className="mwa-featured-card-title">{title}</h3>
        <p className="mwa-featured-card-summary">{summary}</p>

        {/* Project Thumbnail Image */}
        <div className="mwa-featured-card-image-wrap">
          <img src={thumbnail} alt={title} className="mwa-featured-card-image" loading="lazy" />
        </div>

        {/* Highlights List with Arrow Bullet Markers */}
        {highlights.length > 0 && (
          <ul className="mwa-featured-card-highlights">
            {highlights.slice(0, 3).map((item, idx) => (
              <li key={idx}>
                <span className="mwa-featured-card-arrow">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Technology Tags */}
        <div className="mwa-featured-card-tags">
          {tags.slice(0, 3).map((t, idx) => (
            <Tag key={idx}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Dark Filled Bottom Action Button */}
      <div className="mwa-featured-card-footer">
        <Link to={`/projects/${slug}`} className="mwa-featured-card-btn">
          View project <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
}
