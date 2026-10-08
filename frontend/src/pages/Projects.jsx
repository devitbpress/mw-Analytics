import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Section from '../components/Section';
import { Maximize2, ExternalLink, ArrowRight, X } from 'lucide-react';
import projectsData from '../data/projects.json';

const TYPE_CONFIG = {
  website: {
    badge: "Interactive Website",
    btnPrefix: "Open live project",
    defaultPlatform: ""
  },
  simulation: {
    badge: "Simulation Model",
    btnPrefix: "Run simulation",
    defaultPlatform: "AnyLogic Cloud"
  },
  dataset: {
    badge: "Dataset",
    btnPrefix: "View dataset",
    defaultPlatform: "Kaggle"
  },
  external: {
    badge: "External Showcase",
    btnPrefix: "View on",
    defaultPlatform: "Platform"
  }
};

const TAB_CATEGORIES = [
  { id: 'all', label: 'All', type: null },
  { id: 'website', label: 'Websites', type: 'website' },
  { id: 'simulation', label: 'Simulations', type: 'simulation' },
  { id: 'dataset', label: 'Datasets', type: 'dataset' },
  { id: 'external', label: 'Showcases', type: 'external' }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeModalMedia, setActiveModalMedia] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Our Work | Meditya Wasesa Analytics";
  }, []);

  const projectIdParam = searchParams.get('project');
  const groupParam = searchParams.get('group');

  // Filter published projects (status === "published" AND url is non-empty)
  const publishedProjects = projectsData.filter(
    (p) => p.status === 'published' && p.url && p.url.trim() !== ''
  );

  // Helper to slugify subgroup name
  const slugifySubgroup = (sg) => (sg || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Determine active query filter and its label
  let queryFilteredProjects = publishedProjects;
  let activeFilterLabel = null;

  if (projectIdParam) {
    const matched = publishedProjects.filter((p) => p.id === projectIdParam);
    if (matched.length > 0) {
      queryFilteredProjects = matched;
      activeFilterLabel = matched[0].menuLabel || matched[0].title;
    }
  } else if (groupParam) {
    const matched = publishedProjects.filter((p) => slugifySubgroup(p.subgroup) === groupParam);
    if (matched.length > 0) {
      queryFilteredProjects = matched;
      activeFilterLabel = matched[0].subgroup || groupParam;
    }
  }

  const isQueryFilterActive = !!activeFilterLabel;

  const clearQueryFilter = () => {
    setSearchParams({});
  };

  // Compute counts for each category tab based on query-filtered set
  const getCategoryCount = (type) => {
    if (!type) return queryFilteredProjects.length;
    return queryFilteredProjects.filter((p) => p.type === type).length;
  };

  // Visible tabs (Tab "All" always shown; others shown if count > 0)
  const visibleTabs = TAB_CATEGORIES.filter((cat) => {
    if (cat.id === 'all') return true;
    return getCategoryCount(cat.type) > 0;
  });

  // Filter projects by active tab
  const activeCategoryObj = TAB_CATEGORIES.find((cat) => cat.id === activeTab) || TAB_CATEGORIES[0];
  const finalFilteredProjects = activeCategoryObj.type
    ? queryFilteredProjects.filter((p) => p.type === activeCategoryObj.type)
    : queryFilteredProjects;

  // Handle ESC key to close media modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getButtonText = (project) => {
    const config = TYPE_CONFIG[project.type] || TYPE_CONFIG.website;
    if (project.type === 'external') {
      const platformName = project.platform || config.defaultPlatform;
      return `${config.btnPrefix} ${platformName}`;
    }
    return config.btnPrefix;
  };

  const renderMediaPreview = (project) => {
    const thumbnailSrc = project.thumbnail;
    const videoSrc = project.video;
    const altText = project.title || 'Project thumbnail';

    return (
      <div className="unicage-media-box">
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="unicage-media-video"
          />
        ) : (
          <img
            src={thumbnailSrc || '/images/placeholder.svg'}
            alt={altText}
            className="unicage-media-img"
          />
        )}
        <div className="unicage-media-controls">
          <button
            className="unicage-media-btn"
            aria-label={`Maximize preview of ${project.title}`}
            onClick={() => setActiveModalMedia({ title: project.title, videoSrc, thumbnailSrc, altText })}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="unicage-products-page">
      <Section variant="default" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* HEADER HALAMAN */}
        <div className="unicage-header-block">
          <span className="unicage-tag-label">PROJECTS</span>
          <h1 className="unicage-header-title" tabIndex={-1}>Our work in practice.</h1>
          <p className="unicage-header-subtitle">
            Interactive platforms, simulation models, and open datasets from our data analysis and applied research.
          </p>
        </div>

        {/* ACTIVE FILTER CHIP (if query params active) */}
        {isQueryFilterActive && (
          <div className="mwa-active-filter-strip">
            <span className="mwa-filter-chip">
              Showing: <strong>{activeFilterLabel}</strong>
              <button
                className="mwa-filter-clear-btn"
                onClick={clearQueryFilter}
                aria-label="Show all projects"
              >
                · Show all projects <X size={13} style={{ marginLeft: '4px' }} />
              </button>
            </span>
          </div>
        )}

        {/* FILTER TABS */}
        <div className="mwa-projects-tabs" role="tablist" aria-label="Project Categories">
          {visibleTabs.map((tab) => {
            const count = getCategoryCount(tab.type);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={`mwa-projects-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label} <span className="mwa-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* GRID KARTU */}
        {finalFilteredProjects.length === 0 ? (
          <div className="mwa-projects-empty">
            <p>No projects in this category yet.</p>
          </div>
        ) : (
          <div className="unicage-products-grid-3col" id={`panel-${activeTab}`} role="tabpanel">
            {finalFilteredProjects.map((p) => {
              const typeConfig = TYPE_CONFIG[p.type] || TYPE_CONFIG.website;
              const isExternalType = p.type === 'simulation' || p.type === 'dataset' || p.type === 'external';
              const platformText = p.platform || typeConfig.defaultPlatform;

              return (
                <div key={p.id} className="unicage-card-col">
                  <div className="unicage-card-top-line" />

                  {/* Header Kartu: Output Type Badge */}
                  <div className="mwa-project-badge-row">
                    <span className={`mwa-output-type-badge mwa-badge--${p.type}`}>
                      {typeConfig.badge}
                    </span>
                    {isExternalType && platformText && (
                      <span className="mwa-platform-tag">{platformText}</span>
                    )}
                  </div>

                  <div className="unicage-card-title-row">
                    {p.abbr && <span className="unicage-code-bold">{p.abbr}</span>}
                    <span className="unicage-title-sub">{p.title}</span>
                  </div>

                  <div className="unicage-category-row">
                    {(p.tags || []).join(' • ')}
                  </div>

                  <p className="unicage-desc-text">
                    {p.description}
                  </p>

                  {renderMediaPreview(p)}

                  <ul className="unicage-capability-list">
                    {(p.bullets || []).map((feat, idx) => (
                      <li key={idx} className="unicage-capability-item">
                        <span className="unicage-arrow-icon">→</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="unicage-btn-row">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unicage-explore-btn"
                    >
                      {getButtonText(p)}{' '}
                      {isExternalType ? (
                        <ExternalLink size={14} style={{ marginLeft: '6px' }} />
                      ) : (
                        <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PENUTUP HALAMAN */}
        <div className="mwa-projects-footer-cta">
          <p className="mwa-cta-text">Looking for the research behind these projects?</p>
          <div className="mwa-cta-links">
            <Link to="/publications" className="mwa-cta-link">
              See publications <ArrowRight size={14} />
            </Link>
            <span className="mwa-cta-sep">•</span>
            <a href="mailto:meditya@mw-analytics.id" className="mwa-cta-link">
              Get in touch <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </Section>

      {/* Video / Image Maximize Modal */}
      {activeModalMedia && (
        <div className="unicage-video-modal-backdrop" onClick={() => setActiveModalMedia(null)}>
          <div className="unicage-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="unicage-video-modal-header">
              <span className="unicage-video-modal-title">{activeModalMedia.title}</span>
              <button className="unicage-video-modal-close" onClick={() => setActiveModalMedia(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="unicage-video-modal-body">
              {activeModalMedia.videoSrc ? (
                <video
                  src={activeModalMedia.videoSrc}
                  autoPlay
                  controls
                  loop
                  className="unicage-video-modal-player"
                />
              ) : (
                <img
                  src={activeModalMedia.thumbnailSrc}
                  alt={activeModalMedia.altText}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
