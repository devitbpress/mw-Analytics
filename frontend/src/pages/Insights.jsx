import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Tag from '../components/Tag';

const FALLBACK_INSIGHTS = [
  {
    slug: "agent-based-simulation-population-dynamics",
    title: "Agent-based simulation for population dynamics",
    summary: "Multi-agent modeling provides a structured framework for exploring how individual interaction rules give rise to macro-level demographic and spatial patterns. This note details the formulation, verification, and boundary conditions of agent-based population models.",
    cover: "/images/insights/agent-based-simulation.svg",
    tags: ["Methodology", "simulation", "AnyLogic", "agent-based"]
  },
  {
    slug: "estimating-mangrove-carbon-stock-from-satellite-imagery-and-field-data",
    title: "Estimating mangrove carbon stock from satellite imagery and field data",
    summary: "Combining ground-truth field quadrat sampling with Sentinel-2 multispectral telemetry provides a scalable, verifiable methodology for blue carbon inventory accounting in tropical coastal reserves. This case study details the sensor fusion pipeline.",
    cover: "/images/insights/mangrove-carbon-stock.svg",
    tags: ["Case study", "geospatial", "carbon stock", "remote sensing"]
  },
  {
    slug: "mapping-mangrove-density-with-vegetation-indices",
    title: "Mapping mangrove density with vegetation indices",
    summary: "A technical evaluation of Normalized Difference Vegetation Index (NDVI) and Soil-Adjusted Vegetation Index (SAVI) performance in mapping mangrove canopy density across tidal zones. The study highlights background soil correction methods.",
    cover: "/images/insights/mangrove-density.svg",
    tags: ["Methodology", "NDVI", "remote sensing", "geospatial"]
  },
  {
    slug: "building-a-tourism-atlas-for-a-coastal-village",
    title: "Building a tourism atlas for a coastal village",
    summary: "How open spatial data and interactive web mapping were combined to build a digital destination atlas for community-managed eco-tourism in Pengudang. The platform facilitates sustainable spatial route planning for visitors.",
    cover: "/images/insights/tourism-atlas.svg",
    tags: ["Case study", "tourism", "mapping", "web platform"]
  },
  {
    slug: "choosing-between-machine-learning-and-simulation-for-a-forecasting-problem",
    title: "Choosing between machine learning and simulation for a forecasting problem",
    summary: "A methodological decision framework for determining whether predictive machine learning or dynamic simulation modeling is best suited for complex operational decision problems. We contrast data-driven regression with causal mechanics.",
    cover: "/images/insights/ml-vs-simulation.svg",
    tags: ["Technical note", "machine learning", "simulation", "forecasting"]
  },
  {
    slug: "from-model-to-web-tool-delivering-simulation-results-to-decision-makers",
    title: "From model to web tool: delivering simulation results to decision makers",
    summary: "Translating desktop simulation models into web-based interactive dashboards enables non-technical stakeholders to explore scenario outcomes directly in their browser. We detail REST API integration architectures.",
    cover: "/images/insights/model-to-web.svg",
    tags: ["Technical note", "web app", "decision support", "AnyLogic"]
  }
];

export default function Insights() {
  const [insights, setInsights] = useState(FALLBACK_INSIGHTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Insights | Meditya Wasesa Analytics";

    const loadData = async () => {
      try {
        const res = await fetch('/api/insights');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setInsights(data);
          }
        }
      } catch (err) {
        console.warn("Using fallback insights data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="unicage-products-page">
      <Section variant="default" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Header Block */}
        <div className="unicage-header-block" style={{ marginBottom: '36px' }}>
          <span className="unicage-tag-label">RESEARCH & ARTICLES</span>
          <h1 className="unicage-header-title">Insights</h1>
          <p className="unicage-header-subtitle">
            Technical notes, methodology breakdowns, and case studies across simulation, geospatial analytics, and decision support tools.
          </p>
        </div>

        {/* 2-Column Card Grid (DAQ Reference) */}
        {loading ? (
          <div className="mwa-insights-grid">
            <div className="mwa-skeleton-card" style={{ height: '380px' }} />
            <div className="mwa-skeleton-card" style={{ height: '380px' }} />
          </div>
        ) : (
          <div className="mwa-insights-grid">
            {insights.map((item) => (
              <div key={item.slug || item.title} className="mwa-insight-card">
                <Link to={`/insights/${item.slug}`} className="mwa-insight-card-link">
                  {/* 1. Cover Image */}
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

                    {/* 3. Description / Summary */}
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
        )}
      </Section>
    </div>
  );
}
