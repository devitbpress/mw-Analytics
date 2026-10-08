import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../content/publications.csv');
const jsonPath = path.join(__dirname, '../content/publications.json');
const backupDir = path.join(__dirname, '../content/backups');

if (!fs.existsSync(csvPath)) {
  console.error(`[ERROR] File not found: ${csvPath}`);
  console.log(`Please create content/publications.csv using content/publications.sample.csv as a guide.`);
  process.exit(1);
}

// Simple CSV parser handling quoted values and semicolon-separated lists
function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Regex matching CSV tokens with comma separators and double quotes
    const values = [];
    let insideQuote = false;
    let token = '';

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(token.trim());
        token = '';
      } else {
        token += char;
      }
    }
    values.push(token.trim());

    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx].replace(/^"|"$/g, '');
      });
      rows.push({ lineNum: i + 1, data: row });
    }
  }

  return rows;
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(csvContent);

console.log(`Parsing ${rows.length} rows from content/publications.csv...`);

const validQuartiles = ['Q1', 'Q2', 'Q3', 'Q4', ''];
const validTypes = ['journal', 'conference', 'other'];
const errors = [];
const parsedData = [];

rows.forEach(({ lineNum, data }) => {
  const { id, title, authors, venue, type, year, quartile, sjr_year, doi, url, pdf_url } = data;

  if (!id) errors.push(`Line ${lineNum}: Missing required field 'id'`);
  if (!title) errors.push(`Line ${lineNum}: Missing required field 'title'`);
  if (!authors) errors.push(`Line ${lineNum}: Missing required field 'authors'`);
  if (!venue) errors.push(`Line ${lineNum}: Missing required field 'venue'`);

  const numYear = parseInt(year, 10);
  if (isNaN(numYear)) {
    errors.push(`Line ${lineNum}: 'year' must be a valid number (got "${year}")`);
  }

  const cleanQuartile = (quartile || '').toUpperCase().trim();
  if (!validQuartiles.includes(cleanQuartile)) {
    errors.push(`Line ${lineNum}: Invalid quartile "${quartile}". Allowed: Q1, Q2, Q3, Q4, or empty`);
  }

  const cleanType = (type || 'journal').toLowerCase().trim();
  if (!validTypes.includes(cleanType)) {
    errors.push(`Line ${lineNum}: Invalid type "${type}". Allowed: journal, conference, other`);
  }

  if (!url && !doi) {
    errors.push(`Line ${lineNum}: Either 'url' or 'doi' must be present`);
  }

  const authorsArray = (authors || '').split(';').map((a) => a.trim()).filter((a) => a !== '');

  parsedData.push({
    id: id || `pub-${lineNum}`,
    title,
    authors: authorsArray,
    venue,
    type: cleanType,
    year: numYear,
    quartile: cleanQuartile !== '' ? cleanQuartile : null,
    sjr_year: sjr_year ? parseInt(sjr_year, 10) : null,
    doi: doi || '',
    url: url || (doi ? `https://doi.org/${doi}` : ''),
    pdf_url: pdf_url || '',
    abstract: '',
    keywords: [],
    dummy: false
  });
});

if (errors.length > 0) {
  console.error('\n[IMPORT FAILED] Validation errors encountered:');
  errors.forEach((err) => console.error(` - ${err}`));
  console.error('\nNo changes written to content/publications.json.');
  process.exit(1);
}

// Validation passed: create timestamped backup
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (fs.existsSync(jsonPath)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupDir, `publications_${timestamp}.json`);
  fs.copyFileSync(jsonPath, backupPath);
  console.log(`[BACKUP] Saved backup to ${backupPath}`);
}

// Write updated JSON
fs.writeFileSync(jsonPath, JSON.stringify(parsedData, null, 2), 'utf8');
console.log(`[SUCCESS] Successfully imported ${parsedData.length} publications to content/publications.json!`);
