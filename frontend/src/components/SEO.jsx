import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Meditya Wasesa Analytics | Data Analysis & Simulation';
const DEFAULT_DESC = 'Meditya Wasesa Analytics provides evidence-based decision systems using agent-based simulation modeling, data analytics, and machine learning.';

export default function SEO({ title, description, canonicalPath }) {
  const location = useLocation();

  useEffect(() => {
    // Update Document Title
    document.title = title ? `${title} | Meditya Wasesa Analytics` : DEFAULT_TITLE;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || DEFAULT_DESC);
    }

    // Update OG Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title ? `${title} | Meditya Wasesa Analytics` : DEFAULT_TITLE);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description || DEFAULT_DESC);
    }

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const path = canonicalPath || location.pathname;
    const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    const fullCanonicalUrl = `https://mw-analytics.id${cleanPath}`;

    if (canonicalLink) {
      canonicalLink.setAttribute('href', fullCanonicalUrl);
    }
  }, [title, description, canonicalPath, location.pathname]);

  return null;
}
