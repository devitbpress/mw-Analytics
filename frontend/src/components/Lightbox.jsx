import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ isOpen, screenshots = [], currentIndex = 0, onClose, onPrev, onNext }) {
  if (!isOpen || screenshots.length === 0) return null;

  const current = screenshots[currentIndex] || screenshots[0];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="mwa-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mwa-lightbox-container" onClick={(e) => e.stopPropagation()}>
        <button className="mwa-lightbox-close" onClick={onClose} aria-label="Close image preview">
          <X size={24} />
        </button>

        {screenshots.length > 1 && (
          <>
            <button className="mwa-lightbox-prev" onClick={onPrev} aria-label="Previous image">
              <ChevronLeft size={32} />
            </button>
            <button className="mwa-lightbox-next" onClick={onNext} aria-label="Next image">
              <ChevronRight size={32} />
            </button>
          </>
        )}

        <div className="mwa-lightbox-content">
          <img src={current.src} alt={current.alt || 'Screenshot'} className="mwa-lightbox-image" />
          {current.caption && <p className="mwa-lightbox-caption">{current.caption}</p>}
        </div>
      </div>
    </div>
  );
}
