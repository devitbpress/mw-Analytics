import os
import json
import sqlite3
import logging
import math
import re
import xml.etree.ElementTree as ET
import frontmatter
from flask import Flask, jsonify, abort, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(BASE_DIR, 'content')

_cache = {}
_mtimes = {}

def get_file_mtime(filepath):
    try:
        return os.path.getmtime(filepath)
    except OSError:
        return 0

def read_json_file(filename):
    filepath = os.path.join(CONTENT_DIR, filename)
    if not os.path.exists(filepath):
        return [] if filename.endswith('s.json') else {}
    
    current_mtime = get_file_mtime(filepath)
    if filename in _cache and _mtimes.get(filename) == current_mtime:
        return _cache[filename]

    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        _cache[filename] = data
        _mtimes[filename] = current_mtime
        return data

def sanitize_project(project):
    proof_url = project.get('proof_url', '')
    if not proof_url or not isinstance(proof_url, str) or not proof_url.startswith('https://'):
        return None

    sanitized = dict(project)
    if not sanitized.get('client_public', False):
        sanitized['client_name'] = None

    return sanitized

def calculate_reading_time(text):
    words = len(re.findall(r'\w+', text))
    minutes = max(1, math.ceil(words / 220))
    return f"{minutes} min read"

def extract_headings(markdown_text):
    """
    Extract h2 and h3 headings for TOC table of contents generation.
    Returns list of dicts: [{'id': 'slug', 'text': 'Heading Text', 'level': 2}]
    """
    headings = []
    lines = markdown_text.splitlines()
    for line in lines:
        match = re.match(r'^(#{2,3})\s+(.+)$', line.strip())
        if match:
            level = len(match.group(1))
            raw_text = match.group(2).strip()
            # Clean markdown formatting inside heading text
            clean_text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', raw_text)
            clean_text = re.sub(r'[*`_]', '', clean_text)
            slug_id = re.sub(r'[^\w\s-]', '', clean_text.lower()).strip().replace(' ', '-')
            headings.append({
                'id': slug_id,
                'text': clean_text,
                'level': level
            })
    return headings

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled Exception: {e}", exc_info=True)
    return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/api/site', methods=['GET'])
def get_site():
    site_data = read_json_file('site.json')
    return jsonify(site_data)

@app.route('/api/profile', methods=['GET'])
def get_profile():
    profile_data = read_json_file('profile.json')
    return jsonify(profile_data)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_sqlite_products():
    if not os.path.exists(DB_PATH):
        return []
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM products ORDER BY id ASC')
        rows = cursor.fetchall()
        conn.close()
        
        products = []
        for r in rows:
            p = dict(r)
            p['features'] = json.loads(p['features'])
            p['badges'] = json.loads(p['badges'])
            p['engine_info'] = json.loads(p['engine_info'])
            products.append(p)
        return products
    except Exception as e:
        logger.error(f"SQLite error: {e}")
        return []

@app.route('/api/products', methods=['GET'])
def get_products():
    products = get_sqlite_products()
    return jsonify(products)

@app.route('/api/projects', methods=['GET'])
def get_projects():
    # Return SQLite products data for projects page
    products = get_sqlite_products()
    if products:
        return jsonify(products)
    
    raw_projects = read_json_file('projects.json')
    sanitized_projects = []
    for p in raw_projects:
        clean_p = sanitize_project(p)
        if clean_p:
            sanitized_projects.append(clean_p)
    return jsonify(sanitized_projects)

@app.route('/api/projects/<slug>', methods=['GET'])
def get_project_by_slug(slug):
    raw_projects = read_json_file('projects.json')
    all_clean = [sanitize_project(p) for p in raw_projects if sanitize_project(p)]

    target = None
    target_idx = -1

    for idx, p in enumerate(all_clean):
        if p.get('slug') == slug:
            target = p
            target_idx = idx
            break

    if not target:
        abort(404, description=f"Project '{slug}' not found or invalid proof_url")

    related = []
    t_category = target.get('category')
    t_tags = set(target.get('tags', []))

    for p in all_clean:
        if p.get('slug') != slug:
            p_cat = p.get('category')
            p_tags = set(p.get('tags', []))
            if p_cat == t_category or len(t_tags.intersection(p_tags)) > 0:
                related.append(p)
                if len(related) >= 3:
                    break

    prev_slug = all_clean[target_idx - 1]['slug'] if target_idx > 0 else None
    next_slug = all_clean[target_idx + 1]['slug'] if target_idx < len(all_clean) - 1 else None

    result = dict(target)
    result['related_projects'] = related
    result['prev_slug'] = prev_slug
    result['next_slug'] = next_slug

    return jsonify(result)

@app.route('/api/publications', methods=['GET'])
def get_publications():
    raw_pubs = read_json_file('publications.json')
    return jsonify(raw_pubs)

@app.route('/api/insights', methods=['GET'])
def get_insights():
    insights_dir = os.path.join(CONTENT_DIR, 'insights')
    insights = []
    if os.path.exists(insights_dir):
        for fname in os.listdir(insights_dir):
            if fname.endswith('.md') and not fname.startswith('_'):
                fpath = os.path.join(insights_dir, fname)
                try:
                    post = frontmatter.load(fpath)
                    meta = dict(post.metadata)
                    
                    # Exclude draft articles
                    if meta.get('draft', False):
                        continue

                    slug = os.path.splitext(fname)[0]
                    meta['slug'] = slug
                    meta['reading_time'] = calculate_reading_time(post.content)
                    meta['author'] = meta.get('author', 'Dr. Meditya Wasesa')
                    insights.append(meta)
                except Exception as e:
                    logger.warning(f"Error parsing insight file {fname}: {e}")

    # Sort newest date descending
    insights.sort(key=lambda x: str(x.get('date', '')), reverse=True)
    return jsonify(insights)

@app.route('/api/insights/<slug>', methods=['GET'])
def get_insight_by_slug(slug):
    insights_dir = os.path.join(CONTENT_DIR, 'insights')
    fpath = os.path.join(insights_dir, f"{slug}.md")
    
    if not os.path.exists(fpath) or slug.startswith('_'):
        abort(404, description=f"Insight article '{slug}' not found")

    try:
        post = frontmatter.load(fpath)
        meta = dict(post.metadata)

        # Exclude draft articles
        if meta.get('draft', False):
            abort(404, description=f"Insight article '{slug}' is a draft")

        meta['slug'] = slug
        meta['reading_time'] = calculate_reading_time(post.content)
        meta['author'] = meta.get('author', 'Dr. Meditya Wasesa')
        meta['content'] = post.content
        meta['headings'] = extract_headings(post.content)

        # Find related articles and prev/next
        all_articles = []
        for fname in os.listdir(insights_dir):
            if fname.endswith('.md') and not fname.startswith('_'):
                p = frontmatter.load(os.path.join(insights_dir, fname))
                m = dict(p.metadata)
                if not m.get('draft', False):
                    m['slug'] = os.path.splitext(fname)[0]
                    all_articles.append(m)

        all_articles.sort(key=lambda x: str(x.get('date', '')), reverse=True)
        
        target_idx = -1
        for idx, item in enumerate(all_articles):
            if item['slug'] == slug:
                target_idx = idx
                break

        prev_slug = all_articles[target_idx - 1]['slug'] if target_idx > 0 else None
        next_slug = all_articles[target_idx + 1]['slug'] if target_idx < len(all_articles) - 1 else None

        related = []
        t_tags = set(meta.get('tags', []))
        for item in all_articles:
            if item['slug'] != slug:
                p_tags = set(item.get('tags', []))
                if len(t_tags.intersection(p_tags)) > 0:
                    related.append(item)
                    if len(related) >= 3:
                        break

        meta['related_articles'] = related
        meta['prev_slug'] = prev_slug
        meta['next_slug'] = next_slug

        return jsonify(meta)

    except Exception as e:
        logger.warning(f"Error reading insight '{slug}': {e}")
        abort(500, description="Error processing insight article")

@app.route('/insights/feed.xml', methods=['GET'])
def get_insights_rss():
    """Generate RSS 2.0 XML Feed for published insights"""
    site_data = read_json_file('site.json')
    site_name = site_data.get('name', 'Meditya Wasesa Analytics')
    
    insights_dir = os.path.join(CONTENT_DIR, 'insights')
    articles = []
    
    if os.path.exists(insights_dir):
        for fname in os.listdir(insights_dir):
            if fname.endswith('.md') and not fname.startswith('_'):
                post = frontmatter.load(os.path.join(insights_dir, fname))
                meta = dict(post.metadata)
                if not meta.get('draft', False):
                    meta['slug'] = os.path.splitext(fname)[0]
                    articles.append(meta)

    articles.sort(key=lambda x: str(x.get('date', '')), reverse=True)

    rss = ET.Element('rss', version='2.0')
    channel = ET.SubElement(rss, 'channel')
    
    ET.SubElement(channel, 'title').text = f"{site_name} - Insights"
    ET.SubElement(channel, 'link').text = "https://ganeca10.id/insights"
    ET.SubElement(channel, 'description').text = "Notes on analysis, simulation modeling, and machine learning."

    for item in articles:
        i_elem = ET.SubElement(channel, 'item')
        ET.SubElement(i_elem, 'title').text = item.get('title', '')
        ET.SubElement(i_elem, 'link').text = f"https://ganeca10.id/insights/{item['slug']}"
        ET.SubElement(i_elem, 'description').text = item.get('summary', '')
        ET.SubElement(i_elem, 'pubDate').text = str(item.get('date', ''))
        ET.SubElement(i_elem, 'guid').text = f"https://ganeca10.id/insights/{item['slug']}"

    xml_str = ET.tostring(rss, encoding='utf-8', xml_declaration=True)
    return Response(xml_str, mimetype='application/rss+xml')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
