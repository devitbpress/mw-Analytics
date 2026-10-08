// Utility: build mega menu category data from projects.json + menuPlaceholders.js
// Logika: published projects + (jika SHOW_MENU_PLACEHOLDERS) placeholder items,
// dikompilasi menjadi struktur kategori -> subkelompok -> item.
//
// Aturan:
// - Satu proyek hanya muncul di satu kategori.
// - Subkelompok dengan 1 item: tampilkan item langsung tanpa judul subkelompok.
// - Subkelompok dengan ≥ 5 item: tampilkan 5 lalu tautan "View all {subgroup}".
// - Kategori tanpa item sama sekali: disembunyikan.
// - Placeholder: tidak bisa diklik, redup, badge "Coming soon".
// TODO: hapus placeholder setelah proyek asli (20+) dimasukkan.

import projectsData from './projects.json';
import menuPlaceholders from './menuPlaceholders.json';
import { SHOW_MENU_PLACEHOLDERS } from '../config';

export const CATEGORY_META = {
  'data-analytics-bi': {
    id: 'data-analytics-bi',
    title: 'Data Analytics & BI',
    icon: 'BarChart2',
    description: 'Turn complex data into actionable business intelligence, dashboards, and open datasets.'
  },
  'ai-ml-web-apps': {
    id: 'ai-ml-web-apps',
    title: 'AI, Machine Learning & Web Apps',
    icon: 'Cpu',
    description: 'Deploy predictive models, geospatial web platforms, and applied machine learning solutions.'
  },
  'operations-research-simulation': {
    id: 'operations-research-simulation',
    title: 'Operations Research & Simulation',
    icon: 'Network',
    description: 'Optimize complex systems with agent-based, system dynamics, and discrete-event simulation.'
  }
};

const CATEGORY_ORDER = [
  'data-analytics-bi',
  'ai-ml-web-apps',
  'operations-research-simulation'
];

export function buildMenuCategories() {
  // 1. Collect real published items (non-placeholder)
  const realItems = projectsData
    .filter(p => p.status === 'published' && p.url && p.url.trim() !== '')
    .map(p => ({
      id: p.id,
      menuLabel: p.menuLabel || p.title,
      menuDescription: p.menuDescription || p.description || '',
      category: p.category,
      subgroup: p.subgroup || 'General',
      type: p.type,
      url: p.url,
      tags: p.tags || [],
      placeholder: false
    }));

  // 2. Collect placeholder items from menuPlaceholders.js (if flag enabled)
  const placeholderItems = SHOW_MENU_PLACEHOLDERS ? menuPlaceholders : [];

  // 3. Merge: real items first, then placeholders
  const allItems = [...realItems, ...placeholderItems];

  // 4. Group by category -> subgroup
  const categoryMap = {};
  for (const item of allItems) {
    const catId = item.category;
    if (!catId) continue;
    if (!categoryMap[catId]) categoryMap[catId] = {};
    const sg = item.subgroup || 'General';
    if (!categoryMap[catId][sg]) categoryMap[catId][sg] = [];
    categoryMap[catId][sg].push(item);
  }

  // 5. Build final structure in order, skip empty categories
  const result = [];
  for (const catId of CATEGORY_ORDER) {
    const meta = CATEGORY_META[catId];
    if (!meta) continue;
    const subgroupMap = categoryMap[catId];
    if (!subgroupMap) continue;

    const subgroups = Object.entries(subgroupMap).map(([sgName, items]) => {
      const MAX_ITEMS = 5;
      const visibleItems = items.slice(0, MAX_ITEMS);
      const hasMore = items.length > MAX_ITEMS;
      const sgSlug = sgName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        title: sgName,
        slug: sgSlug,
        items: visibleItems,
        hasMore,
        totalCount: items.length,
        singleItem: items.length === 1
      };
    });

    result.push({ ...meta, subgroups });
  }

  return result;
}

// Build search index: only published (non-placeholder) items
export function buildSearchIndex() {
  return projectsData
    .filter(p => p.status === 'published' && p.url && p.url.trim() !== '')
    .map(p => ({
      id: p.id,
      menuLabel: p.menuLabel || p.title,
      menuDescription: p.menuDescription || p.description || '',
      category: p.category,
      tags: (p.tags || []).map(t => t.toLowerCase()),
      url: p.url
    }));
}
