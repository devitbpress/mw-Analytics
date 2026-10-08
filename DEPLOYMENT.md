# Panduan Deployment MW Analytics di Server VPS (Ubuntu / Debian)

Panduan langkah demi langkah untuk melakukan instalasi dan deployment aplikasi **MW Analytics** di server VPS baru.

---

## Architecture Overview
- **Frontend**: Single Page Application (React / Vite) yang dicompile menjadi file statis HTML/JS/CSS dan dilayani oleh **NGINX**.
- **Backend**: Flask Python API yang dijalankan oleh **Gunicorn** sebagai daemon process (Systemd Service) di port `5000`.
- **Reverse Proxy & SSL**: **NGINX** menangani trafik HTTP/HTTPS, sertifikat SSL Let's Encrypt (Certbot), dan memproxikan permintaan `/api/*` ke Flask.

---

## 1. Persiapan Server VPS & System Packages

Login ke server VPS menggunakan SSH:
```bash
ssh root@IP_SERVER_ANDA
```

Update package list dan install dependensi dasar (Node.js, Python3, NGINX, Git, Certbot):
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install tools dasar & Python 3 + venv
sudo apt install -y git curl build-essential python3 python3-venv python3-pip nginx certbot python3-certbot-nginx

# Install Node.js 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verifikasi versi terinstall:
```bash
node -v   # Output: v20.x.x
npm -v    # Output: 10.x.x
python3 --version
nginx -v
```

---

## 2. Clone Repositori GitHub

Buat folder proyek di `/var/www/` dan clone repositori:
```bash
# Pindah ke direktori www
cd /var/www

# Clone dari GitHub
sudo git clone https://github.com/devitbpress/mw-Analytics.git mw-analytics

# Ubah kepemilikan folder ke user aktif (atau www-data)
sudo chown -R $USER:$USER /var/www/mw-analytics
cd /var/www/mw-analytics
```

---

## 3. Setup Backend Flask (Python Virtual Environment & Gunicorn)

### A. Buat Virtual Environment & Install Dependensi
```bash
cd /var/www/mw-analytics/backend

# Buat virtual environment
python3 -m venv venv

# Aktifkan virtual environment
source venv/bin/activate

# Upgrade pip & install requirements
pip install --upgrade pip
pip install -r requirements.txt

# Install Gunicorn (Production WSGI Server)
pip install gunicorn

# Tes jalankan backend dengan Gunicorn (Port 5000)
gunicorn --bind 127.0.0.1:5000 app:app
# Tekan CTRL+C untuk menghentikan tes
```

### B. Buat Service Daemon Systemd untuk Backend
Buat file service agar Flask backend berjalan otomatis saat VPS dinyalakan (*auto-restart* jika crash):

```bash
sudo nano /etc/systemd/system/mw-backend.service
```

Isi file dengan konfigurasi berikut (sesuaikan username jika bukan `root` atau `ubuntu`):
```ini
[Unit]
Description=MW Analytics Flask Backend Service
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/mw-analytics/backend
ExecStart=/var/var/www/mw-analytics/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:5000 app:app
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

Jalankan dan aktifkan service backend:
```bash
# Reload systemd configuration
sudo systemctl daemon-reload

# Start service & enable on boot
sudo systemctl start mw-backend
sudo systemctl enable mw-backend

# Cek status service
sudo systemctl status mw-backend
```

---

## 4. Setup Frontend React (Vite Build)

Kompilasi aplikasi React menjadi file statis di folder `dist`:
```bash
cd /var/www/mw-analytics/frontend

# Install dependensi frontend
npm install

# Build bundel produksi
npm run build
```
File hasil kompilasi akan berada di `/var/var/www/mw-analytics/frontend/dist`.

---

## 5. Konfigurasi NGINX Reverse Proxy

Buat konfigurasi virtual host NGINX untuk melayani frontend statis dan memproxikan `/api`:

```bash
sudo nano /etc/nginx/sites-available/mw-analytics
```

Isikan konfigurasi berikut (ganti `ganeca10.id` dengan domain/IP server Anda):
```nginx
server {
    listen 80;
    server_name ganeca10.id www.ganeca10.id;

    # Root folder hasil build frontend
    root /var/www/mw-analytics/frontend/dist;
    index index.html;

    # Gzip Compression untuk performa cepat
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Route Frontend (Single Page Application fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (images, fonts, js, css)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Proxy API Requests ke Flask Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan konfigurasi NGINX & tes syntax:
```bash
# Enable site config
sudo ln -s /etc/nginx/sites-available/mw-analytics /etc/nginx/sites-enabled/

# Hapus default site jika ada
sudo rm -f /etc/nginx/sites-enabled/default

# Tes syntax NGINX
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

---

## 6. Pasang Sertifikat SSL / HTTPS (Let's Encrypt)

Pastikan Domain (`ganeca10.id`) sudah di-pointing A record-nya ke IP VPS Anda, lalu jalankan Certbot:
```bash
sudo certbot --nginx -d ganeca10.id -d www.ganeca10.id
```

Certbot akan otomatis memperbarui file NGINX dengan enkripsi HTTPS 443 dan pengalihan otomatis HTTP ke HTTPS.

---

## 7. Pembaruan Aplikasi di Masa Mendatang (Update / Deployment Ulang)

Ketika ada update baru dari GitHub, jalankan perintah berikut di VPS:

```bash
cd /var/www/mw-analytics

# 1. Pull update terbaru dari GitHub
git pull origin main

# 2. Re-build frontend jika ada perubahan UI
cd /var/www/mw-analytics/frontend
npm install
npm run build

# 3. Restart backend service jika ada perubahan Python/data
sudo systemctl restart mw-backend
```

---

## 8. Ringkasan Status & Perintah Maintenance

| Operasi | Perintah |
| :--- | :--- |
| **Cek Status Backend** | `sudo systemctl status mw-backend` |
| **Restart Backend** | `sudo systemctl restart mw-backend` |
| **Cek Log Backend** | `sudo journalctl -u mw-backend -f` |
| **Cek Status NGINX** | `sudo systemctl status nginx` |
| **Reload NGINX** | `sudo systemctl reload nginx` |
| **Cek Log NGINX Error** | `sudo tail -f /var/log/nginx/error.log` |
