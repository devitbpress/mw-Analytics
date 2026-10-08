// TODO: hapus placeholder setelah proyek asli (20+) dimasukkan ke projects.json.
// Kontrol visibilitas lewat SHOW_MENU_PLACEHOLDERS di src/config.js.

export const menuPlaceholders = [
  // ─── DATA ANALYTICS & BI ───────────────────────────────────────────────────
  {
    id: "ph-bi-dashboard-1",
    menuLabel: "Interactive Dashboard (TBD)",
    menuDescription: "An interactive dashboard for exploring key metrics and operational data.",
    category: "data-analytics-bi",
    subgroup: "Dashboards",
    type: "website",
    placeholder: true
  },
  {
    id: "ph-bi-dashboard-2",
    menuLabel: "Executive KPI Report (TBD)",
    menuDescription: "A structured executive report summarizing organizational key performance indicators.",
    category: "data-analytics-bi",
    subgroup: "Dashboards",
    type: "website",
    placeholder: true
  },
  {
    id: "ph-bi-dataset-1",
    menuLabel: "Kaggle Dataset (TBD)",
    menuDescription: "An open dataset published on Kaggle for research and analytical use.",
    category: "data-analytics-bi",
    subgroup: "Datasets & Notebooks",
    type: "dataset",
    placeholder: true
  },
  {
    id: "ph-bi-dataset-2",
    menuLabel: "Exploratory Data Analysis (TBD)",
    menuDescription: "A documented EDA notebook examining structure and patterns in a real dataset.",
    category: "data-analytics-bi",
    subgroup: "Datasets & Notebooks",
    type: "dataset",
    placeholder: true
  },

  // ─── AI, MACHINE LEARNING & WEB APPS ──────────────────────────────────────
  {
    id: "ph-ml-forecast",
    menuLabel: "Forecasting Model (TBD)",
    menuDescription: "A predictive model for time-series forecasting in a domain application.",
    category: "ai-ml-web-apps",
    subgroup: "Predictive Models",
    type: "external",
    placeholder: true
  },
  {
    id: "ph-ml-classify",
    menuLabel: "Classification Model (TBD)",
    menuDescription: "A supervised classification model applied to a structured real-world dataset.",
    category: "ai-ml-web-apps",
    subgroup: "Predictive Models",
    type: "external",
    placeholder: true
  },

  // ─── OPERATIONS RESEARCH & SIMULATION ─────────────────────────────────────
  {
    id: "ph-sim-sd",
    menuLabel: "AnyLogic System Dynamics Model (TBD)",
    menuDescription: "A system dynamics model exploring feedback loops and long-run system behavior.",
    category: "operations-research-simulation",
    subgroup: "Simulation Models",
    type: "simulation",
    placeholder: true
  },
  {
    id: "ph-sim-abm",
    menuLabel: "Agent-Based Model (TBD)",
    menuDescription: "An agent-based simulation of individual behavior and emergent system outcomes.",
    category: "operations-research-simulation",
    subgroup: "Simulation Models",
    type: "simulation",
    placeholder: true
  },
  {
    id: "ph-or-scm",
    menuLabel: "Supply Chain Simulation (TBD)",
    menuDescription: "A discrete-event simulation of supply chain processes under varying demand conditions.",
    category: "operations-research-simulation",
    subgroup: "Process & Logistics",
    type: "simulation",
    placeholder: true
  },
  {
    id: "ph-or-queue",
    menuLabel: "Queueing / Resource Allocation Model (TBD)",
    menuDescription: "A queuing and resource allocation model for service or production system optimization.",
    category: "operations-research-simulation",
    subgroup: "Process & Logistics",
    type: "simulation",
    placeholder: true
  }
];
