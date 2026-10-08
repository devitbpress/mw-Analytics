import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Publications from './pages/Publications';
import Insights from './pages/Insights';
import InsightDetail from './pages/InsightDetail';
import Styleguide from './pages/Styleguide';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function MainLayout({ siteConfig }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar siteConfig={siteConfig} />
      
      <main className={`mwa-main-content ${!isHome ? 'mwa-main-content--has-padding' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<InsightDetail />} />
          <Route path="/styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer siteConfig={siteConfig} />
    </div>
  );
}

export default function App() {
  const [siteConfig, setSiteConfig] = useState(null);

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((data) => setSiteConfig(data))
      .catch((err) => console.error('Failed to load site config:', err));
  }, []);

  return (
    <BrowserRouter>
      <MainLayout siteConfig={siteConfig} />
    </BrowserRouter>
  );
}
