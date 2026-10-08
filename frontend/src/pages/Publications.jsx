import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Section from '../components/Section';
import {
  Search,
  ExternalLink,
  Check,
  Award,
  MessageSquare
} from 'lucide-react';
import PublicationDrawer from '../components/PublicationDrawer';
import '../components/PublicationDrawer.css';

const QUARTILE_OPTIONS = ['All', 'Q1', 'Q2', 'Q3', 'Q4', 'No quartile'];

export default function Publications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [publications, setPublications] = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [visibleLimit, setVisibleLimit] = useState(30);
  const [activeCiteDropdownId, setActiveCiteDropdownId] = useState(null);

  // Drawer state & URL Hash sync
  const [activeDrawerPubId, setActiveDrawerPubId] = useState(null);
  const activeTitleRef = useRef(null);

  const citeWrapperRefs = useRef({});

  // Read URL search params with fallback defaults
  const searchFilter = searchParams.get('search') || '';
  const quartileFilter = searchParams.get('quartile') || 'All';
  const yearFilter = searchParams.get('year') || 'All';
  const typeFilter = searchParams.get('type') || 'All';
  const groupMode = searchParams.get('group') || 'quartile'; // 'quartile' or 'newest'

  useEffect(() => {
    document.title = "Publications | Meditya Wasesa Analytics";

    const fetchData = async () => {
      try {
        const [pubRes, siteRes] = await Promise.all([
          fetch('/api/publications'),
          fetch('/api/site')
        ]);

        if (pubRes.ok) {
          const data = await pubRes.json();
          if (Array.isArray(data)) {
            setPublications(data);
          }
        }
        if (siteRes.ok) {
          const siteData = await siteRes.json();
          setSiteConfig(siteData);
        }
      } catch (err) {
        console.error("Error loading publication data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // URL Hash Sync for Publication Detail Drawer
  useEffect(() => {
    const syncHashWithDrawer = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveDrawerPubId(hash);
      } else {
        setActiveDrawerPubId(null);
      }
    };

    syncHashWithDrawer();
    window.addEventListener('popstate', syncHashWithDrawer);
    window.addEventListener('hashchange', syncHashWithDrawer);

    return () => {
      window.removeEventListener('popstate', syncHashWithDrawer);
      window.removeEventListener('hashchange', syncHashWithDrawer);
    };
  }, []);

  const openDrawer = (id, e) => {
    if (e) e.preventDefault();
    setActiveDrawerPubId(id);
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const closeDrawer = () => {
    setActiveDrawerPubId(null);
    const urlWithoutHash = window.location.pathname + window.location.search;
    window.history.pushState(null, '', urlWithoutHash);
    if (activeTitleRef.current) {
      activeTitleRef.current.focus();
    }
  };

  // Close cite dropdown on outside click or ESC key
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeCiteDropdownId) {
        const currentWrapper = citeWrapperRefs.current[activeCiteDropdownId];
        if (currentWrapper && !currentWrapper.contains(e.target)) {
          setActiveCiteDropdownId(null);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeCiteDropdownId) {
        const triggerBtn = document.getElementById(`cite-btn-${activeCiteDropdownId}`);
        setActiveCiteDropdownId(null);
        if (triggerBtn) triggerBtn.focus();
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCiteDropdownId]);

  // Inject ScholarlyArticle JSON-LD schema ONLY for non-dummy entries
  useEffect(() => {
    const nonDummyItems = publications.filter((p) => !p.dummy);
    if (nonDummyItems.length === 0) return;

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": nonDummyItems.map((p) => ({
        "@type": "ScholarlyArticle",
        "headline": p.title,
        "name": p.title,
        "author": Array.isArray(p.authors)
          ? p.authors.map((a) => ({ "@type": "Person", "name": a }))
          : [{ "@type": "Person", "name": p.authors }],
        "datePublished": String(p.year),
        "isPartOf": {
          "@type": "Periodical",
          "name": p.venue
        },
        "sameAs": p.doi ? `https://doi.org/${p.doi}` : p.url
      }))
    };

    let script = document.getElementById('scholarly-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'scholarly-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById('scholarly-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [publications]);

  // Helper to update search params
  const updateParam = (key, value, defaultValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const scholarUrl =
    siteConfig?.links?.scholar ||
    'https://scholar.google.co.id/citations?user=ku9d3YgAAAAJ&hl=id';

  // Dynamic summary metrics
  const summaryMetrics = useMemo(() => {
    const total = publications.length;
    const q1Count = publications.filter((p) => p.quartile === 'Q1').length;
    const years = publications.map((p) => p.year).filter(Boolean);
    const minYear = years.length ? Math.min(...years) : '';
    const maxYear = years.length ? Math.max(...years) : '';
    const yearRange = minYear && maxYear ? (minYear === maxYear ? `${minYear}` : `${minYear} – ${maxYear}`) : '—';

    return { total, q1Count, yearRange };
  }, [publications]);

  // Unique options for filter dropdowns
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(publications.map((p) => p.year).filter(Boolean)));
    return years.sort((a, b) => b - a);
  }, [publications]);

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(publications.map((p) => p.type).filter(Boolean)));
    return types;
  }, [publications]);

  // Filter items
  const filteredPublications = useMemo(() => {
    return publications.filter((item) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const venueMatch = (item.venue || '').toLowerCase().includes(q);
        const authorsStr = Array.isArray(item.authors) ? item.authors.join(' ') : String(item.authors || '');
        const authorMatch = authorsStr.toLowerCase().includes(q);
        if (!titleMatch && !venueMatch && !authorMatch) return false;
      }

      if (quartileFilter !== 'All') {
        if (quartileFilter === 'No quartile' || quartileFilter === 'Not ranked') {
          if (item.quartile) return false;
        } else {
          if (item.quartile !== quartileFilter) return false;
        }
      }

      if (yearFilter !== 'All') {
        if (String(item.year) !== String(yearFilter)) return false;
      }

      if (typeFilter !== 'All') {
        if ((item.type || '').toLowerCase() !== typeFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [publications, searchFilter, quartileFilter, yearFilter, typeFilter]);

  // Group and sort filtered items
  const groupedData = useMemo(() => {
    const sortFn = (a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return (a.title || '').localeCompare(b.title || '');
    };

    if (groupMode === 'newest') {
      const sorted = [...filteredPublications].sort(sortFn);
      return [{ groupName: null, items: sorted }];
    }

    const groups = [
      { key: 'Q1', title: 'Q1' },
      { key: 'Q2', title: 'Q2' },
      { key: 'Q3', title: 'Q3' },
      { key: 'Q4', title: 'Q4' },
      { key: 'No quartile', title: 'No quartile' }
    ];

    return groups
      .map((g) => {
        const items = filteredPublications
          .filter((item) => {
            if (g.key === 'No quartile') return !item.quartile;
            return item.quartile === g.key;
          })
          .sort(sortFn);

        return {
          groupName: g.title,
          items
        };
      })
      .filter((g) => g.items.length > 0);
  }, [filteredPublications, groupMode]);

  // Flatten active grouped items for drawer prev/next navigation
  const flatActiveItems = useMemo(() => {
    return groupedData.flatMap((g) => g.items);
  }, [groupedData]);

  const activeDrawerIndex = useMemo(() => {
    if (!activeDrawerPubId) return -1;
    return flatActiveItems.findIndex((p) => p.id === activeDrawerPubId);
  }, [flatActiveItems, activeDrawerPubId]);

  const activeDrawerPublication = useMemo(() => {
    if (activeDrawerIndex >= 0) {
      return flatActiveItems[activeDrawerIndex];
    }
    if (!activeDrawerPubId) return null;
    return publications.find((p) => p.id === activeDrawerPubId) || null;
  }, [flatActiveItems, activeDrawerIndex, activeDrawerPubId, publications]);

  const handlePrevPub = () => {
    if (activeDrawerIndex > 0) {
      const prevItem = flatActiveItems[activeDrawerIndex - 1];
      openDrawer(prevItem.id);
    }
  };

  const handleNextPub = () => {
    if (activeDrawerIndex >= 0 && activeDrawerIndex < flatActiveItems.length - 1) {
      const nextItem = flatActiveItems[activeDrawerIndex + 1];
      openDrawer(nextItem.id);
    }
  };

  const totalFilteredCount = filteredPublications.length;

  const renderAuthors = (authors) => {
    const authorList = Array.isArray(authors) ? authors : [authors || 'Meditya Wasesa'];

    return authorList.map((author, idx) => {
      const trimmed = author.trim();
      const isFounder = trimmed.includes('Meditya Wasesa') || trimmed.includes('M. Wasesa');
      const isLast = idx === authorList.length - 1;

      return (
        <React.Fragment key={idx}>
          {isFounder ? (
            <strong className="mwa-pub-author-bold">{trimmed}</strong>
          ) : (
            <span>{trimmed}</span>
          )}
          {!isLast && ', '}
        </React.Fragment>
      );
    });
  };

  const handleCopyCite = (item) => {
    const authorsStr = Array.isArray(item.authors) ? item.authors.join(', ') : item.authors;
    const doiStr = item.doi ? ` https://doi.org/${item.doi}` : '';
    const citationText = `${authorsStr} (${item.year}). ${item.title}. ${item.venue}.${doiStr}`;

    navigator.clipboard.writeText(citationText);
    const key = `${item.id}-cite`;
    setCopiedKey(key);
    setActiveCiteDropdownId(null);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyBibtex = (item) => {
    const authorsStr = Array.isArray(item.authors) ? item.authors.join(' and ') : item.authors;
    const bibId = `pub_${item.id || item.year}`;
    const doiLine = item.doi ? `,\n  doi = {${item.doi}}` : '';
    const bibtexText = `@article{${bibId},\n  author = {${authorsStr}},\n  title = {${item.title}},\n  journal = {${item.venue}},\n  year = {${item.year}}${doiLine}\n}`;

    navigator.clipboard.writeText(bibtexText);
    const key = `${item.id}-bib`;
    setCopiedKey(key);
    setActiveCiteDropdownId(null);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCiteKeyDown = (e, itemId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCiteDropdownId(activeCiteDropdownId === itemId ? null : itemId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeCiteDropdownId !== itemId) {
        setActiveCiteDropdownId(itemId);
      }
    }
  };

  const handleCiteMenuKeyDown = (e, item) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setActiveCiteDropdownId(null);
      const triggerBtn = document.getElementById(`cite-btn-${item.id}`);
      if (triggerBtn) triggerBtn.focus();
    }
  };

  const renderQuartileBadge = (quartile) => {
    if (!quartile) return null;
    const qUpper = quartile.toUpperCase();
    if (qUpper.includes('Q1')) return <span className="mwa-badge mwa-pub-badge-q1">Q1</span>;
    if (qUpper.includes('Q2')) return <span className="mwa-badge mwa-pub-badge-q2">Q2</span>;
    if (qUpper.includes('Q3')) return <span className="mwa-badge mwa-pub-badge-q3">Q3</span>;
    if (qUpper.includes('Q4')) return <span className="mwa-badge mwa-pub-badge-q4">Q4</span>;
    return null;
  };

  let displayedItemsCount = 0;

  return (
    <Section variant="default" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div className="mwa-publications-page">
        {/* Header Row */}
        <div className="mwa-pub-header">
          <div className="mwa-pub-header-content">
            <span className="mwa-pub-header-label">PUBLICATIONS</span>
            <h1 className="mwa-pub-header-title">Peer-reviewed research</h1>
            <p className="mwa-pub-header-subtitle">
              Peer-reviewed journal articles, conference papers, and research publications by Meditya Wasesa Analytics.
            </p>
          </div>

          <div className="mwa-pub-header-actions">
            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mwa-pub-scholar-btn"
            >
              <Award size={16} />
              View all on Google Scholar
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Dynamic Summary Row */}
        <div className="mwa-pub-summary-row">
          <div className="mwa-pub-summary-card">
            <span className="mwa-pub-summary-num">{summaryMetrics.total}</span>
            <span className="mwa-pub-summary-label">Total Publications</span>
          </div>
          <div className="mwa-pub-summary-card">
            <span className="mwa-pub-summary-num">{summaryMetrics.q1Count}</span>
            <span className="mwa-pub-summary-label">Q1 Journal Papers</span>
          </div>
          <div className="mwa-pub-summary-card">
            <span className="mwa-pub-summary-num">{summaryMetrics.yearRange}</span>
            <span className="mwa-pub-summary-label">Year Coverage</span>
          </div>
        </div>

        {/* Toolbar & Filter Control Box */}
        <div className="mwa-pub-toolbar">
          <div className="mwa-pub-search-row">
            <div className="mwa-pub-search-input-wrapper">
              <Search size={16} className="mwa-pub-search-icon" />
              <input
                type="text"
                className="mwa-pub-search-input"
                placeholder="Search by title, author, or journal..."
                value={searchFilter}
                onChange={(e) => updateParam('search', e.target.value, '')}
                aria-label="Search publications"
              />
            </div>

            <div className="mwa-pub-select-group">
              <select
                className="mwa-pub-select"
                value={yearFilter}
                onChange={(e) => updateParam('year', e.target.value, 'All')}
                aria-label="Filter by year"
              >
                <option value="All">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>

              <select
                className="mwa-pub-select"
                value={typeFilter}
                onChange={(e) => updateParam('type', e.target.value, 'All')}
                aria-label="Filter by publication type"
              >
                <option value="All">All Types</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quartile Filter Chips */}
          <div className="mwa-pub-chips-row">
            <span className="mwa-pub-chip-label">Quartile:</span>
            {QUARTILE_OPTIONS.map((q) => (
              <button
                key={q}
                className={`mwa-pub-chip ${quartileFilter === q ? 'active' : ''}`}
                onClick={() => updateParam('quartile', q, 'All')}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Grouping Toggle Row (Segmented Control) */}
          <div className="mwa-pub-toggle-row">
            <div
              className="mwa-pub-view-toggle"
              role="radiogroup"
              aria-label="Publication grouping mode"
            >
              <button
                type="button"
                role="radio"
                aria-checked={groupMode === 'quartile'}
                className={`mwa-pub-toggle-btn ${groupMode === 'quartile' ? 'active' : ''}`}
                onClick={() => updateParam('group', 'quartile', 'quartile')}
              >
                Group by quartile
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={groupMode === 'newest'}
                className={`mwa-pub-toggle-btn ${groupMode === 'newest' ? 'active' : ''}`}
                onClick={() => updateParam('group', 'newest', 'quartile')}
              >
                Newest first
              </button>
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Showing {Math.min(totalFilteredCount, visibleLimit)} of {totalFilteredCount} entries
            </span>
          </div>
        </div>

        {/* Content List View */}
        {loading ? (
          <div style={{ padding: '20px 0' }}>
            <div className="mwa-skeleton-card" style={{ height: '100px', marginBottom: '16px' }} />
            <div className="mwa-skeleton-card" style={{ height: '100px', marginBottom: '16px' }} />
            <div className="mwa-skeleton-card" style={{ height: '100px', marginBottom: '16px' }} />
          </div>
        ) : groupedData.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No publications found matching current filters.
          </div>
        ) : (
          groupedData.map((group, gIdx) => {
            const itemsToRender = [];
            for (const item of group.items) {
              if (displayedItemsCount < visibleLimit) {
                itemsToRender.push(item);
                displayedItemsCount++;
              }
            }

            if (itemsToRender.length === 0) return null;

            return (
              <div key={group.groupName || gIdx} className="mwa-pub-group-section">
                {group.groupName && (
                  <h2 className="mwa-pub-group-header">
                    {group.groupName}
                    <span className="mwa-pub-group-count">({group.items.length})</span>
                  </h2>
                )}

                <div className="mwa-pub-list">
                  {itemsToRender.map((item) => {
                    const hasDoiOrUrl = !!(item.doi || item.url);

                    return (
                      <div key={item.id} className="mwa-pub-card">
                        {/* Title (clicking title opens publication drawer) */}
                        <h3 className="mwa-pub-card-title">
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              activeTitleRef.current = e.currentTarget;
                              openDrawer(item.id, e);
                            }}
                          >
                            {item.title}
                          </a>
                        </h3>

                        {/* Authors line */}
                        <div className="mwa-pub-authors">
                          Authors: {renderAuthors(item.authors)}
                        </div>

                        {/* Venue & Year on one line */}
                        <div className="mwa-pub-venue-line">
                          <em className="mwa-pub-venue-name">{item.venue}</em> · {item.year}
                        </div>

                        {/* Meta Tags Row (At most 2 badges) */}
                        <div className="mwa-pub-meta-row">
                          {/* Badge 1: Conference badge OR Quartile badge */}
                          {item.type === 'conference' ? (
                            <span className="mwa-badge mwa-pub-badge-conference">Conference</span>
                          ) : item.quartile ? (
                            renderQuartileBadge(item.quartile)
                          ) : null}

                          {/* Badge 2: Type tag ONLY if type is journal or other (not conference) */}
                          {item.type && item.type !== 'conference' && (
                            <span className="mwa-pub-type-tag">
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          )}

                          {/* Optional Citation Count */}
                          {item.citations !== undefined && item.citations !== null && item.citations_as_of && (
                            <span className="mwa-pub-citations">
                              <MessageSquare size={13} style={{ marginRight: '2px' }} />
                              Cited by {item.citations} (as of {item.citations_as_of})
                            </span>
                          )}
                        </div>

                        {/* Quiet Action Links */}
                        <div className="mwa-pub-actions">
                          {item.doi ? (
                            <a
                              href={`https://doi.org/${item.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mwa-pub-action-link-quiet"
                            >
                              DOI <ExternalLink size={12} />
                            </a>
                          ) : item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mwa-pub-action-link-quiet"
                            >
                              Publisher page <ExternalLink size={12} />
                            </a>
                          ) : null}

                          {item.pdf_url && (
                            <>
                              {hasDoiOrUrl && <span className="mwa-pub-action-sep">·</span>}
                              <a
                                href={item.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mwa-pub-action-link-quiet"
                              >
                                PDF
                              </a>
                            </>
                          )}

                          {(hasDoiOrUrl || item.pdf_url) && <span className="mwa-pub-action-sep">·</span>}

                          {/* Cite Trigger & Dropdown Menu */}
                          <div
                            className="mwa-pub-cite-wrapper"
                            ref={(el) => (citeWrapperRefs.current[item.id] = el)}
                          >
                            <button
                              type="button"
                              id={`cite-btn-${item.id}`}
                              aria-haspopup="true"
                              aria-expanded={activeCiteDropdownId === item.id}
                              className="mwa-pub-action-link-quiet"
                              onClick={() => setActiveCiteDropdownId(activeCiteDropdownId === item.id ? null : item.id)}
                              onKeyDown={(e) => handleCiteKeyDown(e, item.id)}
                            >
                              Cite
                            </button>

                            {copiedKey && copiedKey.startsWith(`${item.id}-`) ? (
                              <span className="mwa-pub-copied-toast">
                                <Check size={12} /> Copied!
                              </span>
                            ) : activeCiteDropdownId === item.id ? (
                              <div
                                className="mwa-pub-cite-dropdown"
                                role="menu"
                                aria-labelledby={`cite-btn-${item.id}`}
                                onKeyDown={(e) => handleCiteMenuKeyDown(e, item)}
                              >
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="mwa-pub-cite-option"
                                  onClick={() => handleCopyCite(item)}
                                >
                                  Copy citation
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="mwa-pub-cite-option"
                                  onClick={() => handleCopyBibtex(item)}
                                >
                                  Copy BibTeX
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {/* Show More Button */}
        {!loading && totalFilteredCount > visibleLimit && (
          <div className="mwa-pub-show-more-wrapper">
            <button
              className="mwa-pub-show-more-btn"
              onClick={() => setVisibleLimit((prev) => prev + 30)}
            >
              Show more ({totalFilteredCount - visibleLimit} remaining)
            </button>
          </div>
        )}

        {/* Publication Detail Drawer */}
        <PublicationDrawer
          isOpen={!!activeDrawerPubId && !!activeDrawerPublication}
          onClose={closeDrawer}
          publication={activeDrawerPublication}
          currentIndex={activeDrawerIndex >= 0 ? activeDrawerIndex : 0}
          totalCount={flatActiveItems.length}
          onPrev={handlePrevPub}
          onNext={handleNextPub}
        />
      </div>
    </Section>
  );
}
