import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Tag from './Tag';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProjectCard({ project }) {
  const {
    slug,
    title,
    summary,
    thumbnail,
    highlights = [],
    tags = [],
    dummy = false
  } = project;

  return (
    <Card className="mwa-featured-card">
      {/* Thick Primary Top Accent Bar (IMAGE 2 reference) */}
      <div className="mwa-featured-card-topbar" />

      <div className="mwa-featured-card-body">
        {dummy && <Badge variant="dummy" className="mwa-featured-card-dummy">Dummy</Badge>}
        
        <h3 className="mwa-featured-card-title">{title}</h3>
        <p className="mwa-featured-card-summary">{summary}</p>

        {/* Project Thumbnail Image */}
        <div className="mwa-featured-card-image-wrap">
          <img src={thumbnail} alt={title} className="mwa-featured-card-image" />
        </div>

        {/* Highlights List with Arrow Bullet Markers (IMAGE 2 reference) */}
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

        {/* Tags */}
        <div className="mwa-featured-card-tags">
          {tags.slice(0, 3).map((t, idx) => (
            <Tag key={idx}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Dark Filled Bottom Action Button with Arrow (IMAGE 2 reference) */}
      <div className="mwa-featured-card-footer">
        <Link to={`/projects/${slug}`} className="mwa-featured-card-btn">
          View project <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
}
