---
title: Getting Started
---

Hướng dẫn setup môi trường phát triển và chạy b-maker-sys từ đầu.

## Prerequisites

- Docker & Docker Compose v2
- `make`
- `gh` CLI (GitHub CLI, đã login)
- Python 3.12 (cho development local)

## 1. Clone Monorepo

```bash
git clone https://github.com/bili-maker/b-maker-sys.git
cd b-maker-sys
```

## 2. Tạo Sub-repos (lần đầu)

> Yêu cầu: đã tạo GitHub org `bili-maker`. Nếu chưa, vào https://github.com/organizations/new.

```bash
make create-repos   # tạo 4 private repos trong org bili-maker
make clone          # clone repos vào repos/
make init           # setup venv + install deps
```

## 3. Cấu hình Environment

```bash
cp .env.example .env
# Sửa .env — bắt buộc:
# TELEGRAM_BOT_TOKEN=<token từ @BotFather>
# TELEGRAM_CHAT_ID=<chat_id>
# SYMBOLS=BTC,ETH,SOL,BNB,XRP,DOGE,ADA,AVAX,LINK,OP
```

## 4. Chạy

```bash
make up         # start PostgreSQL + tất cả services
make migrate    # chạy Alembic migrations (4 bảng)
make logs       # xem logs realtime
```

Sau ~1 phút, kiểm tra:

```bash
docker compose ps   # tất cả services "healthy"
```

## 5. Verify E2E

```bash
make test       # ruff + black + mypy + pytest trên 4 repos
```

## Makefile Commands

| Command | Mô tả |
|---|---|
| `make up` | Start tất cả services |
| `make down` | Stop tất cả services |
| `make logs` | Xem logs realtime |
| `make migrate` | Chạy Alembic migrations |
| `make test` | Chạy full test suite |
| `make clean` | Xoá containers + volumes |
| `make reset` | Clean + re-init từ đầu |
| `make docs-dev` | Dev server VitePress tại localhost:5173 |
| `make docs-build` | Build static docs site |
