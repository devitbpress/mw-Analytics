import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsPath = path.join(__dirname, '../content/projects.json');
const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

console.log(`Checking ${projectsData.length} proof URLs in projects.json...\n`);

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ statusCode: res.statusCode, status: res.statusCode < 400 ? 'OK' : 'FAIL' });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 0, status: 'ERROR', error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 0, status: 'TIMEOUT' });
    });

    req.end();
  });
}

async function runCheck() {
  let unreachableCount = 0;

  for (const project of projectsData) {
    const url = project.proof_url;
    if (!url) {
      console.log(`[MISSING] Project "${project.slug}" has no proof_url`);
      unreachableCount++;
      continue;
    }

    const result = await checkUrl(url);
    if (result.status === 'OK') {
      console.log(`[✓ PASS] ${project.slug} -> ${url} (${result.statusCode})`);
    } else {
      console.log(`[✗ FAIL] ${project.slug} -> ${url} (Status: ${result.status}, Code: ${result.statusCode})`);
      unreachableCount++;
    }
  }

  console.log(`\nLink Check Completed: ${projectsData.length - unreachableCount} reachable, ${unreachableCount} unreachable/dummy.`);
}

runCheck();
