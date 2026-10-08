import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import 'katex/dist/katex.min.css';

const DEFAULT_SECTIONS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'problem-setting', title: 'Problem setting' },
  { id: 'data', title: 'Data' },
  { id: 'method', title: 'Method' },
  { id: 'validation', title: 'Validation' },
  { id: 'limitations', title: 'Limitations' },
  { id: 'conclusion', title: 'Conclusion' },
  { id: 'references', title: 'References' }
];

export default function InsightDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTocId, setActiveTocId] = useState('introduction');

  useEffect(() => {
    setLoading(true);

    fetch(`/api/insights/${slug}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) {
          setArticle(data);
          document.title = `${data.title} | Insights | Meditya Wasesa Analytics`;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching insight article:", err);
        setLoading(false);
      });
  }, [slug]);

  // Scroll listener for TOC active highlighting
  useEffect(() => {
    const sectionIds = DEFAULT_SECTIONS.map((s) => s.id);

    const handleScroll = () => {
      let currentId = 'introduction';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            currentId = id;
          }
        }
      }
      setActiveTocId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '80px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="mwa-skeleton-card" style={{ height: '40px', marginBottom: '20px' }} />
          <div className="mwa-skeleton-card" style={{ height: '20px', marginBottom: '40px' }} />
          <div className="mwa-skeleton-card" style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Article Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            The requested technical note or case study could not be located.
          </p>
          <Link to="/insights" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
            ← Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const pageTitle = article.title;
  const pageSubtitle = article.summary;
  const pageAuthors = article.author || 'Meditya Wasesa';
  const pageAffiliation = article.affiliation || 'Institut Teknologi Bandung · Meditya Wasesa Analytics';
  const pageDate = article.date ? String(article.date) : '2026';

  // Determine RELATED column value
  let relatedContent = null;
  if (article.related_project) {
    relatedContent = (
      <Link to={`/projects/${article.related_project}`}>
        {article.related_project === 'mangrove-analytics'
          ? 'Mangrove Analytics'
          : article.related_project === 'discover-pengudang'
          ? 'Discover Pengudang'
          : article.related_project}
      </Link>
    );
  } else if (article.related_publication) {
    relatedContent = <Link to="/publications">Publication</Link>;
  } else {
    relatedContent = <span>{article.type || 'Technical note'}</span>;
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Top Title and Metadata Block */}
      <header className="distill-top">
        <div style={{ marginBottom: '16px' }}>
          <Link to="/insights" style={{ fontSize: '13px', color: 'rgba(0,0,0,0.5)', borderBottom: 'none' }}>
            ← Back to Insights
          </Link>
        </div>

        <h1>{pageTitle}</h1>
        {pageSubtitle && <p className="subtitle">{pageSubtitle}</p>}

        <div className="distill-meta">
          <div>
            <h4>AUTHORS</h4>
            <p>{pageAuthors}</p>
          </div>
          <div>
            <h4>AFFILIATION</h4>
            <p>{pageAffiliation}</p>
          </div>
          <div>
            <h4>PUBLISHED</h4>
            <p>{pageDate}</p>
          </div>
          <div>
            <h4>RELATED</h4>
            <p>{relatedContent}</p>
          </div>
          {article.doi && (
            <div>
              <h4>DOI</h4>
              <p>
                <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer">
                  {article.doi}
                </a>
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout: Sticky TOC Sidebar (230px) + Article Column (704px) */}
      <div className="distill-layout">
        <aside className="distill-aside">
          <nav className="distill-toc" id="toc" aria-label="Contents">
            <h4>Contents</h4>
            <ul>
              {DEFAULT_SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className={activeTocId === sec.id ? 'active' : ''}
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Article Main Body */}
        <article className="distill-article">
          <div className="mwa-markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeSlug]}
            >
              {article.content || ''}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}
