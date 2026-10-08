import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Link as LinkIcon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export default function PublicationDrawer({
  isOpen,
  onClose,
  publication,
  currentIndex,
  totalCount,
  onPrev,
  onNext
}) {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isCiteOpen, setIsCiteOpen] = useState(false);

  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const citeMenuRef = useRef(null);

  // Reset internal states when active publication changes
  useEffect(() => {
    setIsAbstractExpanded(false);
    setIsCiteOpen(false);
    setCopiedKey(null);
  }, [publication?.id]);

  // Lock body scroll while open and handle ESC key & Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll and prevent background layout shift
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Focus close button on open
    setTimeout(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap within drawer
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const firstElement = focusables[0];
          const lastElement = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close cite dropdown on outside click
  useEffect(() => {
    if (!isCiteOpen) return;
    const handleOutsideClick = (e) => {
      if (citeMenuRef.current && !citeMenuRef.current.contains(e.target)) {
        setIsCiteOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isCiteOpen]);

  if (!isOpen || !publication) return null;

  // Formatting author string with bold founder's name
  const renderAuthors = (authors) => {
    const authorList = Array.isArray(authors) ? authors : [authors || 'Meditya Wasesa'];

    return authorList.map((author, idx) => {
      const trimmed = author.trim();
      const isFounder = trimmed.includes('Meditya Wasesa') || trimmed.includes('M. Wasesa');
      const isLast = idx === authorList.length - 1;

      return (
        <React.Fragment key={idx}>
          {isFounder ? (
            <strong className="mwa-drawer-author-bold">{trimmed}</strong>
          ) : (
            <span>{trimmed}</span>
          )}
          {!isLast && ', '}
        </React.Fragment>
      );
    });
  };

  // Clipboard Helpers
  const triggerCopyToast = (key) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyDoi = () => {
    if (!publication.doi) return;
    navigator.clipboard.writeText(publication.doi);
    triggerCopyToast('doi');
  };

  const handleCopyLink = () => {
    const pubUrl = `${window.location.origin}${window.location.pathname}#${publication.id}`;
    navigator.clipboard.writeText(pubUrl);
    triggerCopyToast('link');
  };

  const handleCopyCite = () => {
    const authorsStr = Array.isArray(publication.authors)
      ? publication.authors.join(', ')
      : publication.authors;
    const doiStr = publication.doi ? ` https://doi.org/${publication.doi}` : '';
    const citationText = `${authorsStr} (${publication.year}). ${publication.title}. ${publication.venue}.${doiStr}`;

    navigator.clipboard.writeText(citationText);
    setIsCiteOpen(false);
    triggerCopyToast('cite');
  };

  const handleCopyBibtex = () => {
    const authorsStr = Array.isArray(publication.authors)
      ? publication.authors.join(' and ')
      : publication.authors;
    const bibId = `pub_${publication.id || publication.year}`;
    const doiLine = publication.doi ? `,\n  doi = {${publication.doi}}` : '';
    const bibtexText = `@article{${bibId},\n  author = {${authorsStr}},\n  title = {${publication.title}},\n  journal = {${publication.venue}},\n  year = {${publication.year}}${doiLine}\n}`;

    navigator.clipboard.writeText(bibtexText);
    setIsCiteOpen(false);
    triggerCopyToast('bibtex');
  };

  const publisherUrl = publication.url || (publication.doi ? `https://doi.org/${publication.doi}` : null);
  const typeLabel = publication.type
    ? publication.type === 'journal'
      ? 'Journal article'
      : publication.type.charAt(0).toUpperCase() + publication.type.slice(1)
    : 'Journal article';

  return (
    <div className="mwa-drawer-backdrop" onClick={onClose}>
      <div
        className="mwa-drawer-panel"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={publication.title}
      >
        {/* Header Badges & Close Button */}
        <div className="mwa-drawer-header">
          <div className="mwa-drawer-badges">
            {publication.type === 'conference' ? (
              <span className="mwa-drawer-badge mwa-drawer-badge-conference">Conference</span>
            ) : publication.quartile ? (
              <span className={`mwa-drawer-badge mwa-drawer-badge-${publication.quartile.toLowerCase()}`}>
                {publication.quartile}
              </span>
            ) : null}

            <span className="mwa-drawer-type-tag">{typeLabel}</span>
          </div>

          <button
            type="button"
            ref={closeBtnRef}
            className="mwa-drawer-close-btn"
            onClick={onClose}
            aria-label="Close publication details"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mwa-drawer-body">
          {/* Title */}
          <h2 className="mwa-drawer-title">{publication.title}</h2>

          {/* Authors */}
          <div className="mwa-drawer-authors">{renderAuthors(publication.authors)}</div>

          {/* Venue & Year */}
          <div className="mwa-drawer-venue-line">
            <em className="mwa-drawer-venue-name">{publication.venue}</em> · {publication.year}
          </div>

          {/* ABSTRACT Section */}
          <div className="mwa-drawer-section">
            <h3 className="mwa-drawer-section-label">ABSTRACT</h3>
            {publication.abstract ? (
              <div className="mwa-drawer-abstract-wrapper">
                <p
                  className={`mwa-drawer-abstract-text ${
                    !isAbstractExpanded ? 'mwa-drawer-abstract-clamped' : ''
                  }`}
                >
                  {publication.abstract}
                </p>
                {publication.abstract.length > 250 && (
                  <button
                    type="button"
                    className="mwa-drawer-abstract-toggle"
                    onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                  >
                    {isAbstractExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            ) : (
              <p className="mwa-drawer-abstract-empty">
                Abstract not available for this entry.
              </p>
            )}
          </div>

          {/* Keywords Tag List */}
          {Array.isArray(publication.keywords) && publication.keywords.length > 0 && (
            <div className="mwa-drawer-keywords">
              {publication.keywords.map((kw, idx) => (
                <span key={idx} className="mwa-drawer-keyword-chip">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* DOI Line */}
          {publication.doi && (
            <div className="mwa-drawer-doi-row">
              <span className="mwa-drawer-doi-label">DOI</span>
              <span className="mwa-drawer-doi-val">{publication.doi}</span>
              <button
                type="button"
                className="mwa-drawer-copy-icon-btn"
                onClick={handleCopyDoi}
                aria-label="Copy DOI"
                title="Copy DOI"
              >
                {copiedKey === 'doi' ? <Check size={14} className="mwa-success-icon" /> : <Copy size={14} />}
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="mwa-drawer-actions">
            {publisherUrl && (
              <a
                href={publisherUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mwa-drawer-btn mwa-drawer-btn-primary"
              >
                Open at publisher <ExternalLink size={14} />
              </a>
            )}

            {publication.pdf_url && (
              <a
                href={publication.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mwa-drawer-btn mwa-drawer-btn-secondary"
              >
                PDF
              </a>
            )}

            {/* Cite Dropdown */}
            <div className="mwa-drawer-cite-wrap" ref={citeMenuRef}>
              <button
                type="button"
                className="mwa-drawer-btn mwa-drawer-btn-secondary"
                aria-haspopup="true"
                aria-expanded={isCiteOpen}
                onClick={() => setIsCiteOpen(!isCiteOpen)}
              >
                Cite <ChevronDown size={14} className={`mwa-drawer-chevron ${isCiteOpen ? 'open' : ''}`} />
              </button>

              {isCiteOpen && (
                <div className="mwa-drawer-cite-menu" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="mwa-drawer-cite-menu-item"
                    onClick={handleCopyCite}
                  >
                    Copy citation
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="mwa-drawer-cite-menu-item"
                    onClick={handleCopyBibtex}
                  >
                    Copy BibTeX
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Copy Link & Toast feedback */}
          <div className="mwa-drawer-link-row">
            <button
              type="button"
              className="mwa-drawer-quiet-btn"
              onClick={handleCopyLink}
            >
              <LinkIcon size={14} /> Copy link
            </button>
            {(copiedKey === 'cite' || copiedKey === 'bibtex' || copiedKey === 'link') && (
              <span className="mwa-drawer-copied-toast">
                <Check size={13} /> Copied to clipboard!
              </span>
            )}
          </div>
        </div>

        {/* Footer Controls (Previous / Next Counter) */}
        <div className="mwa-drawer-footer">
          <button
            type="button"
            className="mwa-drawer-nav-btn"
            onClick={onPrev}
            disabled={currentIndex <= 0}
            aria-label="Previous publication"
          >
            <ArrowLeft size={14} /> Previous
          </button>

          <span className="mwa-drawer-nav-counter">
            {currentIndex + 1} of {totalCount}
          </span>

          <button
            type="button"
            className="mwa-drawer-nav-btn"
            onClick={onNext}
            disabled={currentIndex >= totalCount - 1}
            aria-label="Next publication"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
