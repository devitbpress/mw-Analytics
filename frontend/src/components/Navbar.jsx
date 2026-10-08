import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Container from './Container';
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  BarChart2,
  Cpu,
  Network,
  BookOpen,
  Layers,
  ExternalLink
} from 'lucide-react';
import { buildMenuCategories, buildSearchIndex } from '../data/menuBuilder';

// Build menu data at module level (static, no re-computation on render)
const MENU_CATEGORIES = buildMenuCategories();
const SEARCH_INDEX = buildSearchIndex();

const TYPE_LABEL = {
  website: 'Website',
  simulation: 'Simulation',
  dataset: 'Dataset',
  external: 'Showcase'
};

export default function Navbar({ siteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  // Mobile accordion: which category is expanded
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [mobileExpandedSg, setMobileExpandedSg] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownTimeoutRef = useRef(null);
  const pageTitleRef = useRef(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleMouseEnter = useCallback((menuName) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  }, []);

  const handleMouseLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  }, []);

  const closeMenu = useCallback(() => {
    setActiveDropdown(null);
    setSearchTerm('');
    // Move focus to h1 on the page
    setTimeout(() => {
      const h1 = document.querySelector('h1');
      if (h1) { h1.tabIndex = -1; h1.focus(); }
    }, 50);
  }, []);

  const email = siteConfig?.email || 'meditya@mw-analytics.id';
  const mailtoUrl = `mailto:${email}`;

  const isTransparent = isHome && !scrolled;
  const navbarClass = `mwa-navbar ${isTransparent ? 'mwa-navbar--transparent' : 'mwa-navbar--solid'} ${scrolled ? 'mwa-navbar--scrolled' : ''}`;

  const currentCategoryObj = MENU_CATEGORIES.find(c => c.id === activeCategory) || MENU_CATEGORIES[0];

  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'BarChart2': return <BarChart2 size={18} />;
      case 'Cpu': return <Cpu size={18} />;
      case 'Network': return <Network size={18} />;
      case 'BookOpen': return <BookOpen size={18} />;
      default: return <Layers size={18} />;
    }
  };

  // Search: match on menuLabel, menuDescription, tags (published only)
  const searchResults = searchTerm.trim()
    ? SEARCH_INDEX.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
          item.menuLabel.toLowerCase().includes(term) ||
          item.menuDescription.toLowerCase().includes(term) ||
          item.tags.some(t => t.includes(term))
        );
      })
    : null;

  // Filter sidebar categories by search
  const filteredSidebarCategories = searchTerm.trim()
    ? MENU_CATEGORIES.filter(cat => {
        return cat.subgroups.some(sg =>
          sg.items.some(item =>
            !item.placeholder && (
              item.menuLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.menuDescription.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        );
      })
    : MENU_CATEGORIES;

  // Navigate to project or group
  const handleItemClick = (item) => {
    closeMenu();
    if (item.placeholder) return;
    navigate(`/projects?project=${item.id}`);
  };

  const handleViewAllSubgroup = (sgSlug) => {
    closeMenu();
    navigate(`/projects?group=${sgSlug}`);
  };

  // Keyboard handler for sidebar category list
  const handleSidebarKeyDown = (e, catId, idx) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = MENU_CATEGORIES[idx + 1];
      if (next) setActiveCategory(next.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = MENU_CATEGORIES[idx - 1];
      if (prev) setActiveCategory(prev.id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCategory(catId);
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  };

  return (
    <header className="mwa-header-wrapper" onMouseLeave={handleMouseLeave}>
      {/* Main Navbar */}
      <nav className={navbarClass}>
        <Container className="mwa-navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="mwa-navbar-brand" onClick={() => setActiveDropdown(null)} aria-label="MW Analytics Home">
            <Logo variant="horizontal" dark={isTransparent} style={{ height: '38px' }} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="mwa-navbar-nav mwa-navbar-nav--right">
            <NavLink
              to="/overview"
              className={({ isActive }) => `mwa-nav-link ${isTransparent ? 'mwa-nav-link--light' : ''} ${isActive ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(null)}
            >
              Overview
            </NavLink>

            {/* Projects Dropdown Trigger */}
            <div
              className="mwa-nav-item-has-dropdown"
              onMouseEnter={() => handleMouseEnter('projects')}
            >
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `mwa-nav-link mwa-nav-link-dropdown ${isTransparent ? 'mwa-nav-link--light' : ''} ${
                    isActive || activeDropdown === 'projects' ? 'active' : ''
                  }`
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveDropdown(activeDropdown === 'projects' ? null : 'projects');
                  }
                }}
                aria-haspopup="true"
                aria-expanded={activeDropdown === 'projects'}
              >
                Projects <ChevronDown size={15} className={`mwa-chevron ${activeDropdown === 'projects' ? 'open' : ''}`} />
              </NavLink>
            </div>

            <NavLink
              to="/publications"
              className={({ isActive }) => `mwa-nav-link ${isTransparent ? 'mwa-nav-link--light' : ''} ${isActive ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(null)}
            >
              Publications
            </NavLink>

            <NavLink
              to="/insights"
              className={({ isActive }) => `mwa-nav-link ${isTransparent ? 'mwa-nav-link--light' : ''} ${isActive ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(null)}
            >
              Insights
            </NavLink>

            <a
              href={mailtoUrl}
              className={`mwa-nav-link ${isTransparent ? 'mwa-nav-link--light' : ''}`}
              onMouseEnter={() => handleMouseEnter(null)}
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`mwa-mobile-toggle ${isTransparent ? 'mwa-mobile-toggle--light' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </Container>

        {/* ─── Mega Menu Popup ─────────────────────────────────────────────── */}
        {activeDropdown === 'projects' && (
          <div
            className="mwa-mega-menu-overlay"
            onMouseEnter={() => handleMouseEnter('projects')}
            role="dialog"
            aria-label="Projects mega menu"
          >
            <Container className="mwa-mega-menu-container">
              <div className="mwa-mega-menu">
                {/* Left Sidebar */}
                <div className="mwa-mega-sidebar">
                  {/* Search */}
                  <div className="mwa-mega-search-wrapper">
                    <Search size={16} className="mwa-mega-search-icon" />
                    <input
                      type="text"
                      className="mwa-mega-search-input"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search projects"
                    />
                    {searchTerm && (
                      <button
                        className="mwa-mega-search-clear"
                        onClick={() => setSearchTerm('')}
                        aria-label="Clear search"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Category List */}
                  <ul className="mwa-mega-category-list" role="listbox" aria-label="Project categories">
                    {filteredSidebarCategories.map((cat, idx) => (
                      <li
                        key={cat.id}
                        role="option"
                        aria-selected={activeCategory === cat.id}
                        tabIndex={0}
                        className={`mwa-mega-category-item ${activeCategory === cat.id ? 'active' : ''}`}
                        onMouseEnter={() => setActiveCategory(cat.id)}
                        onClick={() => setActiveCategory(cat.id)}
                        onKeyDown={(e) => handleSidebarKeyDown(e, cat.id, idx)}
                      >
                        <span className="mwa-mega-cat-icon">{renderCategoryIcon(cat.icon)}</span>
                        <span className="mwa-mega-cat-title">{cat.title}</span>
                        <ChevronRight size={14} className="mwa-mega-cat-arrow" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Content Panel */}
                <div className="mwa-mega-content">
                  {/* Search Results Override */}
                  {searchResults !== null ? (
                    <div className="mwa-mega-search-results">
                      <p className="mwa-mega-search-label">
                        {searchResults.length > 0
                          ? `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchTerm}"`
                          : `No results for "${searchTerm}"`}
                      </p>
                      {searchResults.length > 0 && (
                        <ul className="mwa-mega-item-list">
                          {searchResults.map(item => (
                            <li key={item.id}>
                              <button
                                className="mwa-mega-item-link mwa-mega-item-btn"
                                onClick={() => handleItemClick(item)}
                              >
                                <span className="mwa-mega-item-name">{item.menuLabel}</span>
                                <span className="mwa-mega-item-desc">{item.menuDescription}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : currentCategoryObj ? (
                    <>
                      {/* Category Header */}
                      <div className="mwa-mega-header">
                        <span className="mwa-mega-header-icon">{renderCategoryIcon(currentCategoryObj.icon)}</span>
                        <div>
                          <h3 className="mwa-mega-header-title">{currentCategoryObj.title}</h3>
                          <p className="mwa-mega-header-desc">{currentCategoryObj.description}</p>
                        </div>
                        <Link
                          to="/projects"
                          className="mwa-mega-view-all-link"
                          onClick={closeMenu}
                        >
                          View all projects <ArrowRight size={13} />
                        </Link>
                      </div>

                      {/* Subgroups & Items */}
                      <div className="mwa-mega-columns-grid">
                        {currentCategoryObj.subgroups.map((sg, sgIdx) => (
                          <div key={sgIdx} className="mwa-mega-column">
                            {/* Subgroup title hidden if only 1 item */}
                            {!sg.singleItem && (
                              <h4 className="mwa-mega-col-title">{sg.title.toUpperCase()}</h4>
                            )}
                            <ul className="mwa-mega-item-list">
                              {sg.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  {item.placeholder ? (
                                    // Placeholder: not clickable
                                    <span
                                      className="mwa-mega-item-link mwa-mega-item--placeholder"
                                      aria-disabled="true"
                                      role="presentation"
                                    >
                                      <span className="mwa-mega-item-name">
                                        {item.menuLabel}
                                        <span className="mwa-menu-soon-badge">Coming soon</span>
                                      </span>
                                      <span className="mwa-mega-item-desc">{item.menuDescription}</span>
                                    </span>
                                  ) : (
                                    // Real item: clickable
                                    <button
                                      className="mwa-mega-item-link mwa-mega-item-btn"
                                      onClick={() => handleItemClick(item)}
                                    >
                                      <span className="mwa-mega-item-name">
                                        {item.menuLabel}
                                        {item.type && (
                                          <span className={`mwa-menu-type-tag mwa-menu-type--${item.type}`}>
                                            {TYPE_LABEL[item.type] || item.type}
                                          </span>
                                        )}
                                      </span>
                                      <span className="mwa-mega-item-desc">{item.menuDescription}</span>
                                    </button>
                                  )}
                                </li>
                              ))}
                              {/* View all subgroup link if more than 5 */}
                              {sg.hasMore && (
                                <li>
                                  <button
                                    className="mwa-mega-view-more-btn"
                                    onClick={() => handleViewAllSubgroup(sg.slug)}
                                  >
                                    View all {sg.title} <ArrowRight size={12} />
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null}

                  {/* Panel Footer */}
                  <div className="mwa-mega-footer">
                    <div className="mwa-mega-footer-text">
                      <strong>Interested in a similar project?</strong>
                      <p>Tell us about your data, model, or platform idea and we will get back to you.</p>
                    </div>
                    <Link to="/projects" className="mwa-mega-footer-btn" onClick={closeMenu}>
                      Contact us <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        )}

        {/* ─── Mobile Menu (Accordion) ─────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="mwa-mobile-menu">
            <NavLink to="/overview" className={({ isActive }) => `mwa-mobile-link ${isActive ? 'active' : ''}`}>
              Overview
            </NavLink>

            {/* Projects Accordion */}
            <div className="mwa-mobile-accordion">
              <button
                className="mwa-mobile-accordion-toggle"
                onClick={() => setMobileExpandedCat(mobileExpandedCat ? null : 'projects')}
                aria-expanded={mobileExpandedCat === 'projects'}
              >
                <span>Projects</span>
                <ChevronDown size={16} className={`mwa-chevron ${mobileExpandedCat === 'projects' ? 'open' : ''}`} />
              </button>

              {mobileExpandedCat === 'projects' && (
                <div className="mwa-mobile-accordion-body">
                  <Link
                    to="/projects"
                    className="mwa-mobile-sub-link mwa-mobile-sub-link--all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View all projects <ArrowRight size={13} />
                  </Link>

                  {MENU_CATEGORIES.map((cat) => (
                    <div key={cat.id} className="mwa-mobile-cat-group">
                      <button
                        className="mwa-mobile-cat-toggle"
                        onClick={() => setMobileExpandedSg(mobileExpandedSg === cat.id ? null : cat.id)}
                        aria-expanded={mobileExpandedSg === cat.id}
                      >
                        <span className="mwa-mobile-cat-icon">{renderCategoryIcon(cat.icon)}</span>
                        <span>{cat.title}</span>
                        <ChevronDown size={14} className={`mwa-chevron ${mobileExpandedSg === cat.id ? 'open' : ''}`} />
                      </button>

                      {mobileExpandedSg === cat.id && (
                        <div className="mwa-mobile-cat-items">
                          {cat.subgroups.map((sg, sgIdx) => (
                            <div key={sgIdx}>
                              {!sg.singleItem && (
                                <p className="mwa-mobile-sg-label">{sg.title}</p>
                              )}
                              {sg.items.map((item, itemIdx) => (
                                item.placeholder ? (
                                  <span
                                    key={itemIdx}
                                    className="mwa-mobile-item mwa-mobile-item--placeholder"
                                    aria-disabled="true"
                                  >
                                    {item.menuLabel}
                                    <span className="mwa-menu-soon-badge">Coming soon</span>
                                  </span>
                                ) : (
                                  <button
                                    key={itemIdx}
                                    className="mwa-mobile-item"
                                    onClick={() => {
                                      setMobileMenuOpen(false);
                                      navigate(`/projects?project=${item.id}`);
                                    }}
                                  >
                                    {item.menuLabel}
                                  </button>
                                )
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/publications" className={({ isActive }) => `mwa-mobile-link ${isActive ? 'active' : ''}`}>
              Publications
            </NavLink>
            <NavLink to="/insights" className={({ isActive }) => `mwa-mobile-link ${isActive ? 'active' : ''}`}>
              Insights
            </NavLink>
            <a href={mailtoUrl} className="mwa-mobile-link">
              Contact Us
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
