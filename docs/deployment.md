# Deployment

Hướng dẫn deploy b-maker-sys lên VPS với Docker Compose.

## Prerequisites

- VPS với Ubuntu 22.04+ / Debian 12+
- Docker Engine + Docker Compose v2
- `git`

## 1. Clone & Configure

```bash
git clone https://github.com/bili-maker/b-maker-sys.git
cd b-maker-sys

# Sub-repos
./repos.sh clone all

# Environment
cp .env.example .env
nano .env   # điền TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SYMBOLS
```

## 2. Start Services

```bash
docker compose up -d        # start tất cả services
docker compose ps           # kiểm tra status
docker compose logs -f      # xem logs realtime
```

## 3. Chạy Migrations

```bash
docker compose run --rm migrations alembic upgrade head
```

Hoặc qua Makefile:

```bash
make migrate
```

## 4. Verify

Sau 2–3 phút:

```bash
docker compose ps
# Tất cả services phải ở trạng thái "healthy"
```

Kiểm tra DB có data:

```bash
docker compose exec postgres psql -U bmaker -d bmaker \
  -c "SELECT COUNT(*) FROM market_snapshots;"
```

## Health Checks

Mỗi service (collector, scorer, alerter) có heartbeat file tại `/tmp/<service>.heartbeat`. Docker healthcheck kiểm tra file không quá 10 phút cũ:

```yaml
healthcheck:
  test: ["CMD-SHELL", "python -c \"import os,time; age=time.time()-os.path.getmtime('/tmp/collector.heartbeat'); exit(1 if age>600 else 0)\""]
  interval: 60s
  timeout: 5s
  retries: 3
  start_period: 30s
```

## Data Retention

Alerter tự động purge data cũ hơn 30 ngày mỗi 24h. Không cần cron job riêng.

## Update

```bash
git pull
docker compose build        # rebuild images nếu có thay đổi code
docker compose up -d        # rolling restart
```

## Cloudflare Pages (Docs Site)

Docs site deploy tự động khi push lên `main` branch của `bili-maker/docs` repo thông qua GitHub Actions → Cloudflare Pages.

**Setup lần đầu:**

1. Tạo Cloudflare Pages project tại [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
2. Connect to Git → chọn repo `bili-maker/docs`
3. Build settings:
   - Framework preset: VitePress
   - Build command: `npm run build`
   - Build output: `docs/.vitepress/dist`
4. Thêm Secrets vào GitHub repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

**Bảo mật (Cloudflare Access):**

Bật Zero Trust → Access → Applications → thêm email được phép truy cập.
