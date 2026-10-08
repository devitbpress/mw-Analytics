import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Re-create products table cleanly
    cursor.execute('DROP TABLE IF EXISTS products')
    cursor.execute('''
        CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            subtitle TEXT NOT NULL,
            tagline TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            features TEXT NOT NULL,
            badges TEXT NOT NULL,
            color TEXT NOT NULL,
            image TEXT NOT NULL,
            video TEXT NOT NULL,
            url TEXT NOT NULL,
            engine_info TEXT NOT NULL
        )
    ''')

    # MW Analytics Featured Projects
    products_data = [
        {
            "code": "MA",
            "title": "Mangrove Analytics",
            "subtitle": "Satellite-based web platform mapping Pengudang’s mangroves and estimating carbon stocks.",
            "tagline": "Open live project →",
            "category": "GEOSPATIAL • REMOTE SENSING • ENVIRONMENT",
            "description": "Satellite-based web platform mapping Pengudang’s mangroves and estimating carbon stocks.",
            "features": json.dumps([
                "Interactive map of the Pengudang mangrove area",
                "Field GPS trajectories shown along the mangrove trail",
                "Mangrove density mapped by color from satellite imagery",
                "Carbon stock estimated from satellite imagery and shown on the web"
            ]),
            "badges": json.dumps(["GEOSPATIAL", "REMOTE SENSING", "ENVIRONMENT"]),
            "color": "#063499",
            "image": "ma-preview",
            "video": "/videos/mangrove-analyticts.mp4",
            "url": "https://mangrove-analytics.ganeca10.id",
            "engine_info": json.dumps({})
        },
        {
            "code": "DP",
            "title": "Discover Pengudang",
            "subtitle": "Interactive tourism portal showcasing Pengudang’s attractions, activities, and visitor essentials.",
            "tagline": "Open live project →",
            "category": "TOURISM • DESTINATION MAPPING • COMMUNITY",
            "description": "Interactive tourism portal showcasing Pengudang’s attractions, activities, and visitor essentials.",
            "features": json.dumps([
                "Things To See: tourist spots, restaurants, accommodation, and public facilities",
                "Things To Do: activities available in Pengudang",
                "Atlas view of destinations across the village",
                "Visitor information gathered in one place"
            ]),
            "badges": json.dumps(["TOURISM", "DESTINATION MAPPING", "COMMUNITY"]),
            "color": "#063499",
            "image": "dp-preview",
            "video": "/videos/discover-pengudang.mp4",
            "url": "https://discover-pengudang.ganeca10.id",
            "engine_info": json.dumps({})
        }
    ]

    for p in products_data:
        cursor.execute('''
            INSERT INTO products (code, title, subtitle, tagline, category, description, features, badges, color, image, video, url, engine_info)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p['code'], p['title'], p['subtitle'], p['tagline'], p['category'],
            p['description'], p['features'], p['badges'], p['color'], p['image'], p['video'], p['url'], p['engine_info']
        ))

    conn.commit()
    conn.close()
    print(f"Database initialized successfully with 3-grid products and video paths at {DB_PATH}")

if __name__ == '__main__':
    init_db()
