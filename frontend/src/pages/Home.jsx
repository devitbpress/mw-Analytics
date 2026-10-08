import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Container from '../components/Container';
import Section from '../components/Section';
import Tag from '../components/Tag';
import { Maximize2, ArrowRight, X, BookOpen, ExternalLink, MessageSquare } from 'lucide-react';
import PublicationDrawer from '../components/PublicationDrawer';
import '../components/PublicationDrawer.css';
import serverRackImg from '../assets/images/server-rack.jpg';
import logoPertamina from '../assets/images/logo-pertamina.png';
import logoPupukIndonesia from '../assets/images/logo-pupuk-indonesia.png';
import logoLapiItb from '../assets/images/logo-lapi-itb.png';

const FALLBACK_TOP_JOURNALS = [
  {
    id: "pub-W7208767358",
    title: "Advancing building information modeling (BIM) maturity in developing economies: lessons from Indonesian action research",
    authors: ["Bernardus Ariono", "Pracayasa Ade Putra", "Meditya Wasesa", "Wawan Dhewanto"],
    venue: "International Journal of Systems Assurance Engineering and Management",
    year: 2026,
    quartile: "Q1",
    type: "journal",
    keywords: ["building information modeling", "BIM adoption", "leadership", "Indonesia"],
    url: "https://doi.org/10.1007/s13198-026-03430-6"
  },
  {
    id: "pub-W7130683072",
    title: "System Dynamics Modeling of Energy Transition Impact on Residential Energy Affordability in Indonesia",
    authors: ["Dwi Irianto", "Meditya Wasesa"],
    venue: "Journal of Asian Energy Studies",
    year: 2026,
    quartile: "Q1",
    type: "journal",
    keywords: ["energy transition", "decarbonization", "system dynamics", "energy policy"],
    url: "https://doi.org/10.24112/jaes.100001"
  },
  {
    id: "pub-W4405179043",
    title: "Enhancing University Building Energy Flexibility Performance Using Reinforcement Learning Control",
    authors: ["Koko Friansa", "Justin Pradipta", "Rezky Mahesa Nanda", "Irsyad Nashirul Haq", "Rizki Armanto Mangkuto", "Reza Fauzi Iskandar", "Meditya Wasesa", "Edi Leksono"],
    venue: "IEEE Access",
    year: 2024,
    quartile: "Q1",
    type: "journal",
    keywords: ["building energy flexibility", "reinforcement learning", "smart buildings", "HVAC control"],
    url: "https://doi.org/10.1109/access.2024.3512543"
  }
];

const FEATURED_PROJECTS = [
  {
    code: "MA",
    title: "Mangrove Analytics",
    subtitle: "Satellite-based web platform mapping Pengudang’s mangroves and estimating carbon stocks.",
    category: "GEOSPATIAL • REMOTE SENSING • ENVIRONMENT",
    description: "Satellite-based web platform mapping Pengudang’s mangroves and estimating carbon stocks.",
    video: "/videos/mangrove-analyticts.mp4",
    url: "https://mangrove-analytics.ganeca10.id",
    features: [
      "Interactive map of the Pengudang mangrove area",
      "Field GPS trajectories shown along the mangrove trail",
      "Mangrove density mapped by color from satellite imagery",
      "Carbon stock estimated from satellite imagery and shown on the web"
    ]
  },
  {
    code: "DP",
    title: "Discover Pengudang",
    subtitle: "Interactive tourism portal showcasing Pengudang’s attractions, activities, and visitor essentials.",
    category: "TOURISM • DESTINATION MAPPING • COMMUNITY",
    description: "Interactive tourism portal showcasing Pengudang’s attractions, activities, and visitor essentials.",
    video: "/videos/discover-pengudang.mp4",
    url: "https://discover-pengudang.ganeca10.id",
    features: [
      "Things To See: tourist spots, restaurants, accommodation, and public facilities",
      "Things To Do: activities available in Pengudang",
      "Atlas view of destinations across the village",
      "Visitor information gathered in one place"
    ]
  }
];

const FALLBACK_INSIGHTS = [
  {
    slug: "agent-based-simulation-population-dynamics",
    title: "Agent-based simulation for population dynamics",
    summary: "An overview of how multi-agent modeling reveals emergent macro behaviors from micro interaction rules in complex demographic systems.",
    cover: "/images/insights/agent-based-simulation.svg",
    tags: ["simulation", "AnyLogic", "Agent-Based"]
  },
  {
    slug: "choosing-between-machine-learning-and-simulation",
    title: "Choosing Between Machine Learning and Simulation",
    summary: "A practical guide to deciding when to use predictive machine learning versus dynamic simulation modeling for operational decision-making.",
    cover: "/images/projects/supply-chain-simulation.svg",
    tags: ["Machine Learning", "Simulation", "Decision Support"]
  }
];

export default function Home() {
  const [siteConfig, setSiteConfig] = useState(null);
  const [allPublications, setAllPublications] = useState([]);
  const [topJournals, setTopJournals] = useState(FALLBACK_TOP_JOURNALS);
  const [insights, setInsights] = useState(FALLBACK_INSIGHTS);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [activeDrawerPubId, setActiveDrawerPubId] = useState(null);

  useEffect(() => {
    document.title = "Meditya Wasesa Analytics";

    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => setSiteConfig(data))
      .catch((err) => console.error(err));

    fetch('/api/publications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPublications(data);
          const q1Journals = data.filter((p) => p.type === 'journal' && p.quartile === 'Q1');
          if (q1Journals.length >= 3) {
            setTopJournals(q1Journals.slice(0, 3));
          } else {
            const journals = data.filter((p) => p.type === 'journal');
            if (journals.length > 0) {
              setTopJournals(journals.slice(0, 3));
            }
          }
        }
      })
      .catch((err) => console.warn("Using fallback top journals data:", err));

    fetch('/api/insights')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setInsights(data);
        }
      })
      .catch((err) => console.warn("Using fallback insights data:", err));
  }, []);

  // Sync Hash with Publication Drawer on Home page
  useEffect(() => {
    const syncHashWithDrawer = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash.startsWith('pub-')) {
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
    window.history.pushState(null, '', window.location.pathname + window.location.search);
  };

  const activeDrawerPublication = useMemo(() => {
    if (!activeDrawerPubId) return null;
    const pool = allPublications.length > 0 ? allPublications : topJournals;
    return pool.find((p) => p.id === activeDrawerPubId) || null;
  }, [activeDrawerPubId, allPublications, topJournals]);

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

  const renderQuartileBadge = (quartile) => {
    if (!quartile) return null;
    const qUpper = quartile.toUpperCase();
    if (qUpper.includes('Q1')) return <span className="mwa-badge mwa-pub-badge-q1">Q1</span>;
    if (qUpper.includes('Q2')) return <span className="mwa-badge mwa-pub-badge-q2">Q2</span>;
    if (qUpper.includes('Q3')) return <span className="mwa-badge mwa-pub-badge-q3">Q3</span>;
    if (qUpper.includes('Q4')) return <span className="mwa-badge mwa-pub-badge-q4">Q4</span>;
    return null;
  };

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const email = siteConfig?.email || 'meditya@mw-analytics.id';
  const mailtoUrl = `mailto:${email}`;

  const renderMediaPreview = (p) => {
    const videoSrc = p.video || (p.code === 'MA' ? '/videos/mangrove-analyticts.mp4' : '/videos/discover-pengudang.mp4');

    return (
      <div className="unicage-media-box">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="unicage-media-video"
        />
        <div className="unicage-media-controls">
          <button
            className="unicage-media-btn"
            aria-label="Maximize video"
            onClick={() => setActiveModalVideo({ title: p.title, src: videoSrc })}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mwa-home-page">
      {/* HERO SECTION */}
      <Hero />

      {/* SECTION 1: Have A Data Problem? (Blue CTA Banner) */}
      <section className="mwa-data-problem-section">
        <Container>
          <div className="mwa-data-problem-content">
            <h2 className="mwa-data-problem-title">
              {siteConfig?.home?.cta?.heading || "Have a data problem?"}
            </h2>
            <p className="mwa-data-problem-subtitle">
              {siteConfig?.home?.cta?.subtitle || "Tell us about your problem and the data you have."}
            </p>
            <a href={mailtoUrl} className="mwa-btn-yellow">
              {siteConfig?.home?.cta?.button || "Email us"}
            </a>
          </div>
        </Container>
      </section>

      {/* SECTION 2: How Can We Help? */}
      <section className="mwa-help-section">
        <div className="mwa-help-grid">
          <div className="mwa-help-image-col">
            <img
              src={serverRackImg}
              alt={siteConfig?.home?.help?.image_alt || "Server racks in a data center"}
              className="mwa-help-img"
            />
          </div>
          <div className="mwa-help-text-col">
            <h2 className="mwa-help-title">
              {siteConfig?.home?.help?.heading || "How can we help?"}
            </h2>
            <p className="mwa-help-lead">
              {siteConfig?.home?.help?.intro || "Let's skip the technical language. What can we do for you?"}
            </p>
            <p className="mwa-help-paragraph">
              {siteConfig?.home?.help?.body || "We help organizations decide with evidence. Using simulation, machine learning, and spatial analysis, we test options before resources are spent and deliver the results as research or web tools. Our work spans logistics, tourism, recycling supply chains, and mangrove carbon stock."}
            </p>
            <a href={mailtoUrl} className="mwa-btn-cyan">
              {siteConfig?.home?.help?.button || "Discuss your project"}
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 3: Partner / Client Logos Strip (matching Gambar 3 with local logos) */}
      <section className="mwa-logos-section">
        <Container>
          <div className="mwa-logos-wrapper">
            <img src={logoPertamina} alt="Pertamina" className="mwa-partner-logo" />
            <img src={logoPupukIndonesia} alt="Pupuk Indonesia" className="mwa-partner-logo" />
            <img src={logoLapiItb} alt="LAPI ITB" className="mwa-partner-logo" />
          </div>
        </Container>
      </section>

      {/* SECTION: Top Research & Publications (List View matching Publications page) */}
      <Section variant="default" style={{ paddingTop: '64px', paddingBottom: '72px', backgroundColor: 'var(--color-bg-alt, #f8fafc)' }}>
        <Container>
          <div className="unicage-header-block mwa-top-journals-header" style={{ marginBottom: '28px' }}>
            <div>
              <span className="unicage-tag-label">TOP RESEARCH & PUBLICATIONS</span>
              <h2 className="unicage-header-title" style={{ fontSize: '2rem' }}>Featured Journal Publications</h2>
              <p className="unicage-header-subtitle">
                High-impact peer-reviewed scientific contributions in analytics, system dynamics, and AI modeling.
              </p>
            </div>
            <Link to="/publications" className="mwa-top-journals-header-btn">
              View All Publications <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mwa-pub-list" style={{ marginBottom: '32px' }}>
            {topJournals.map((item) => {
              const hasDoiOrUrl = !!(item.doi || item.url);

              return (
                <div key={item.id} className="mwa-pub-card">
                  {/* Title (clicking title opens publication drawer) */}
                  <h3 className="mwa-pub-card-title">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => openDrawer(item.id, e)}
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

                  {/* Meta Tags Row */}
                  <div className="mwa-pub-meta-row">
                    {item.type === 'conference' ? (
                      <span className="mwa-badge mwa-pub-badge-conference">Conference</span>
                    ) : item.quartile ? (
                      renderQuartileBadge(item.quartile)
                    ) : null}

                    {item.type && item.type !== 'conference' && (
                      <span className="mwa-pub-type-tag">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    )}

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

                    <a
                      href={`#${item.id}`}
                      onClick={(e) => openDrawer(item.id, e)}
                      className="mwa-pub-action-link-quiet"
                    >
                      View details
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mwa-top-journals-bottom-cta">
            <Link to="/publications" className="mwa-btn-cyan">
              EXPLORE ALL PUBLICATIONS <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        </Container>
      </Section>

      {/* SECTION 4: Featured Projects Section (2 projects + 1 empty space on the right) */}
      <Section variant="soft" style={{ paddingTop: '60px', paddingBottom: '72px' }}>
        <Container>
          <div className="unicage-header-block" style={{ marginBottom: '32px' }}>
            <span className="unicage-tag-label">FEATURED PROJECTS</span>
            <h2 className="unicage-header-title" style={{ fontSize: '2rem' }}>Featured Case Studies</h2>
            <p className="unicage-header-subtitle">
              Applied analytics, remote sensing, and destination portal projects.
            </p>
          </div>

          <div className="unicage-products-grid-3col">
            {FEATURED_PROJECTS.map((p) => (
              <div key={p.code} className="unicage-card-col">
                <div className="unicage-card-top-line" />

                <div className="unicage-card-title-row">
                  <span className="unicage-code-bold">{p.code}</span>
                  <span className="unicage-title-sub">{p.title}</span>
                </div>

                <div className="unicage-category-row">
                  {p.category}
                </div>

                <p className="unicage-desc-text">
                  {p.description}
                </p>

                {renderMediaPreview(p)}

                <ul className="unicage-capability-list">
                  {(p.features || []).map((feat, idx) => (
                    <li key={idx} className="unicage-capability-item">
                      <span className="unicage-arrow-icon">→</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="unicage-btn-row">
                  <a
                    href={p.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="unicage-explore-btn"
                  >
                    Open live project <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                  </a>
                </div>
              </div>
            ))}

            {/* 3rd slot left empty as requested */}
            <div className="unicage-card-col unicage-card-empty-slot" style={{ visibility: 'hidden' }} />
          </div>
        </Container>
      </Section>

      {/* SECTION 5: Latest Insights (2-column card grid) */}
      <Section variant="default" style={{ paddingTop: '64px', paddingBottom: '80px' }}>
        <Container>
          <div className="unicage-header-block" style={{ marginBottom: '36px' }}>
            <span className="unicage-tag-label">LATEST INSIGHTS</span>
            <h2 className="unicage-header-title" style={{ fontSize: '2rem' }}>Articles & Insights</h2>
            <p className="unicage-header-subtitle">
              Technical notes, methodology breakdowns, and research articles across simulation and analytics.
            </p>
          </div>

          <div className="mwa-insights-grid">
            {insights.slice(0, 2).map((item) => (
              <div key={item.slug || item.title} className="mwa-insight-card">
                <Link to={`/insights/${item.slug}`} className="mwa-insight-card-link">
                  {/* 1. Gambar */}
                  <div className="mwa-insight-card-image-wrap">
                    <img
                      src={item.cover || item.image || '/images/insights/agent-based-simulation.svg'}
                      alt={item.title}
                      className="mwa-insight-card-image"
                      loading="lazy"
                    />
                  </div>

                  <div className="mwa-insight-card-body">
                    {/* 2. Title */}
                    <h3 className="mwa-insight-card-title">
                      {item.title}
                    </h3>

                    {/* 3. Desc */}
                    <p className="mwa-insight-card-desc">
                      {item.summary || item.description}
                    </p>

                    {/* 4. Tags */}
                    <div className="mwa-insight-card-tags">
                      {(item.tags || []).map((t, idx) => (
                        <Tag key={idx}>{t}</Tag>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Video Lightbox Modal */}
      {activeModalVideo && (
        <div className="unicage-video-modal-backdrop" onClick={() => setActiveModalVideo(null)}>
          <div className="unicage-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="unicage-video-modal-header">
              <span className="unicage-video-modal-title">{activeModalVideo.title}</span>
              <button className="unicage-video-modal-close" onClick={() => setActiveModalVideo(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="unicage-video-modal-body">
              <video
                src={activeModalVideo.src}
                autoPlay
                controls
                loop
                className="unicage-video-modal-player"
              />
            </div>
          </div>
        </div>
      )}

      {/* Publication Detail Drawer */}
      {activeDrawerPublication && (
        <PublicationDrawer
          publication={activeDrawerPublication}
          allPublications={allPublications.length > 0 ? allPublications : topJournals}
          onClose={closeDrawer}
          onSelectPublication={(newId) => {
            setActiveDrawerPubId(newId);
            window.history.pushState(null, '', `#${newId}`);
          }}
        />
      )}
    </div>
  );
}
