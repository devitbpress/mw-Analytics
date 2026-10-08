import React, { useState, useEffect } from 'react';
import profileData from '../data/profile.json';
import { SHOW_PENDING_BADGES } from '../config';

export default function Overview() {
  const [activeTab, setActiveTab] = useState('standard');
  const [publicationsCount, setPublicationsCount] = useState(null);

  useEffect(() => {
    document.title = `${profileData.person.name} | Overview`;
  }, []);

  useEffect(() => {
    // Try fetching publications count automatically from /api/publications or /content/publications.json
    fetch('/api/publications')
      .then((res) => {
        if (!res.ok) throw new Error('API not ok');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setPublicationsCount(data.length);
        }
      })
      .catch(() => {
        // Fallback: try fetching publications.json directly
        fetch('/content/publications.json')
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setPublicationsCount(data.length);
            }
          })
          .catch(() => {
            setPublicationsCount(null);
          });
      });
  }, []);

  const { person, education, links, company, bios, inHisOwnWords } = profileData;

  const renderPendingBadge = (status) => {
    if (SHOW_PENDING_BADGES && status === 'pending') {
      return <span className="cole-pending-badge">Unconfirmed</span>;
    }
    return null;
  };

  const phQuestion1 = inHisOwnWords?.[0]; // Where are you from?
  const phQuestion2 = inHisOwnWords?.[1]; // What drives your research?
  const phQuestion3 = inHisOwnWords?.[2]; // Favorite chart type
  const phQuestion4 = inHisOwnWords?.[3]; // Outside of work

  return (
    <div className="cole-profile-root">
      {/* ===== Bagian 1: Hero ===== */}
      <div className="cole-profile-wrap">
        <section className="cole-intro">
          <figure className="cole-portrait">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqt_jNrPl2tP9OErIyBpz02-7ZjLPMHz5gY8HZ0_KZV0WYvd0Lus9N-5A&s=10"
              alt={`Portrait of ${person.name}`}
              width="300"
              height="300"
            />
          </figure>
          <div className="cole-intro-text">
            <h1 className="cole-name">{person.name}</h1>
            <p className="cole-role">
              {person.title} {renderPendingBadge(person.titleStatus)}
              {person.affiliation ? `, ${person.affiliation}` : ''}
            </p>

            {/* Render company section if company.visible is true */}
            {company?.visible && company?.founder && (
              <div className="cole-block">
                <h2>Founder, Meditya Wasesa Analytics</h2>
                <p>{company.founder.bio}</p>
              </div>
            )}

            <div className="cole-block">
              <p>
                <span className="cole-label">Specific focus areas:</span>{' '}
                {person.interests && person.interests.length > 0
                  ? person.interests.join(', ')
                  : 'N/A'}
                {person.expertiseGroup ? ` (${person.expertiseGroup})` : ''}
              </p>
            </div>

            <div className="cole-block">
              <h2>Promotional materials</h2>
              <p>
                Need an official bio of {person.name}? See the text and profiles linked below.
              </p>
              <p>
                <span className="cole-label">Official bio:</span> <a href="#bio">click here</a> (or scroll down)
              </p>
              <p>
                <span className="cole-label">Social/Profiles:</span>{' '}
                {links?.googleScholar && (
                  <a href={links.googleScholar} target="_blank" rel="noopener noreferrer">
                    Google Scholar
                  </a>
                )}
                {links?.googleScholar && links?.linkedin && <span className="cole-sep">|</span>}
                {links?.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {links?.linkedin && links?.sbmProfile && <span className="cole-sep">|</span>}
                {links?.sbmProfile && (
                  <a href={links.sbmProfile} target="_blank" rel="noopener noreferrer">
                    SBM Profile
                  </a>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Bagian 2: Grid Section ===== */}
      <section className="cole-grid-section" id="bio">
        <div className="cole-profile-wrap">
          <div className="cole-grid">
            {/* Tagline Card */}
            <div className="cole-cell cole-c-8">
              <p className="cole-lead">
                Turning data into insight for <strong>sustainable decisions</strong>. {/* TODO: Tagline placeholder to be approved */}
              </p>
            </div>

            {/* Ph.D. Stat Card */}
            <div className="cole-cell cole-c-4 cole-stat">
              <div className="cole-num">
                Ph.D.
              </div>
              <div className="cole-cap">
                {education?.[0]?.institution || 'Erasmus University Rotterdam'}
              </div>
            </div>

            {/* Baris Statistik */}
            {/* (a) Jumlah Publikasi (jika tersedia) */}
            {publicationsCount !== null && (
              <div className="cole-cell cole-c-3 cole-stat">
                <div className="cole-num">{publicationsCount}</div>
                <div className="cole-cap">Publications & Reports</div>
              </div>
            )}

            {/* (b) Year Stat Card */}
            <div className="cole-cell cole-c-3 cole-stat">
              <div className="cole-num">
                {education?.[0]?.year || '2017'}
              </div>
              <div className="cole-cap">
                Ph.D., Rotterdam School of Management, Erasmus University
              </div>
            </div>

            {/* (c) Currently focused on */}
            <div className="cole-cell cole-c-6">
              <h3>Currently focused on</h3>
              <ul className="cole-plain">
                {person.interests && person.interests.slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Official Bio */}
            <div className="cole-cell cole-c-7">
              <h3>Official bio</h3>
              <div className="cole-tabs" role="tablist" aria-label="Bio length">
                <button
                  role="tab"
                  aria-selected={activeTab === 'short'}
                  onClick={() => setActiveTab('short')}
                >
                  Short
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'standard'}
                  onClick={() => setActiveTab('standard')}
                >
                  Standard
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'expanded'}
                  onClick={() => setActiveTab('expanded')}
                >
                  Expanded
                </button>
              </div>
              <div className="cole-bio-panel" id="short" hidden={activeTab !== 'short'}>
                <p>{bios?.short}</p>
              </div>
              <div className="cole-bio-panel" id="standard" hidden={activeTab !== 'standard'}>
                <p>{bios?.standard}</p>
              </div>
              <div className="cole-bio-panel" id="expanded" hidden={activeTab !== 'expanded'}>
                <p>{bios?.expanded}</p>
              </div>
            </div>

            {/* In his own words */}
            <div className="cole-cell cole-c-5">
              <h3>In his own words</h3>
              <dl className="cole-qa">
                {phQuestion1 && (
                  <>
                    <dt>{phQuestion1.question}</dt>
                    <dd className={phQuestion1.placeholder || !phQuestion1.answer ? 'cole-placeholder-dim' : ''}>
                      {phQuestion1.answer || 'To be provided'}
                    </dd>
                  </>
                )}
                {phQuestion2 && (
                  <>
                    <dt>{phQuestion2.question}</dt>
                    <dd className={phQuestion2.placeholder || !phQuestion2.answer ? 'cole-placeholder-dim' : ''}>
                      {phQuestion2.answer || 'To be provided'}
                    </dd>
                  </>
                )}
              </dl>
            </div>

            {/* Kartu kiri-kanan (ganti Favorite chart type / Outside of work) */}
            <div className="cole-cell cole-c-6">
              <h3>{phQuestion3?.question || 'Favorite chart type'}</h3>
              <p className={phQuestion3?.placeholder || !phQuestion3?.answer ? 'cole-placeholder-dim' : ''}>
                {phQuestion3?.answer || 'To be provided'}
              </p>
            </div>

            <div className="cole-cell cole-c-6">
              <h3>{phQuestion4?.question || 'Outside of work'}</h3>
              <p className={phQuestion4?.placeholder || !phQuestion4?.answer ? 'cole-placeholder-dim' : ''}>
                {phQuestion4?.answer || 'To be provided'}
              </p>
            </div>

            {/* Connect */}
            <div className="cole-cell cole-c-12">
              <h3>Connect</h3>
              <p>
                {links?.googleScholar && (
                  <a href={links.googleScholar} target="_blank" rel="noopener noreferrer">
                    Google Scholar
                  </a>
                )}
                {links?.googleScholar && links?.linkedin && <span className="cole-sep">•</span>}
                {links?.linkedin && (
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {links?.linkedin && links?.sbmProfile && <span className="cole-sep">•</span>}
                {links?.sbmProfile && (
                  <a href={links.sbmProfile} target="_blank" rel="noopener noreferrer">
                    SBM Profile
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
