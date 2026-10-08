# Meditya Wasesa Analytics Website

Professional portfolio and consulting website for **Meditya Wasesa Analytics**.

## Project Setup & Running

### Prerequisites
- Node.js (v18+) & npm
- Python 3.9+ & pip

### Installation

1. Install root & frontend Node dependencies:
   ```bash
   npm install
   npm install --prefix frontend
   ```

2. Install backend Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running for Development

To run both Flask backend and React + Vite frontend concurrently:

```bash
npm run dev
```

Alternatively, you can run each service in separate terminal windows:

- **Backend API (Flask - port 5000):**
  ```bash
  python3 backend/app.py
  ```

- **Frontend (Vite - port 3000):**
  ```bash
  npm run dev --prefix frontend
  ```

### API Endpoints
- `GET /api/health`
- `GET /api/site`
- `GET /api/profile`
- `GET /api/projects`
- `GET /api/projects/<slug>`
- `GET /api/publications`
- `GET /api/insights`
- `GET /api/insights/<slug>`

### Importing Publications from CSV

To populate or update `content/publications.json` from a CSV file:

1. Prepare your CSV file at `content/publications.csv` using `content/publications.sample.csv` as a template.
2. Ensure required columns are present: `id`, `title`, `authors` (separated by semicolons `;`), `venue`, `type` (`journal`, `conference`, `other`), `year`, `quartile` (`Q1`, `Q2`, `Q3`, `Q4`, or empty), `sjr_year`, `doi`, `url`, `pdf_url`.
3. Run the importer:
   ```bash
   npm run import:publications
   ```
4. The script validates every row and creates a timestamped backup in `content/backups/` before writing to `content/publications.json`.

