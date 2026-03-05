---
title: Architecture
---

b-maker-sys là hệ thống pipeline xử lý dữ liệu thị trường Futures theo thời gian thực, phát hiện mất cân bằng Long/Short và gửi cảnh báo qua Telegram.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Binance USDT-M                      │
│  (public REST API — no auth required)                │
│  /fapi/v1/premiumIndex  /fapi/v1/openInterest        │
│  /fapi/v1/fundingRate   /fapi/v1/klines              │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP (httpx, retry w/ tenacity)
                      ▼
         ┌────────────────────┐
         │     collector      │  Cron mỗi 5 phút
         │  (Python service)  │  Fetch 10 symbols
         └─────────┬──────────┘
                   │ INSERT market_snapshots
                   ▼
         ┌─────────────────────────────────┐
         │          PostgreSQL 16           │
         │  market_snapshots               │
         │  imbalance_scores               │
         │  alert_log                      │
         └───────┬─────────────┬───────────┘
                 │ SELECT      │ SELECT + INSERT
                 ▼             ▼
    ┌────────────────┐   ┌─────────────────┐
    │     scorer     │   │     alerter     │
    │ Cron mỗi 5ph  │   │ Poll mỗi 5ph   │
    │ Tính metrics   │   │ Kiểm tra score  │
    │ INSERT scores  │   │ Gửi Telegram    │
    └────────────────┘   └────────┬────────┘
                                  │ HTTPS
                                  ▼
                      ┌──────────────────────┐
                      │   Telegram Bot API   │
                      └──────────────────────┘
```

## Principles

**1. Single-direction data flow**
Dữ liệu chỉ đi một chiều: `Binance → collector → DB → scorer → DB → alerter → Telegram`. Không có callback, không có event bus.

**2. Shared-nothing services**
Mỗi service chỉ giao tiếp với nhau qua database. Không gọi HTTP trực tiếp sang service khác.

**3. Stateless compute**
`scorer` và `alerter` không giữ state trong memory. Mỗi vòng lặp đọc DB từ đầu. Crash và restart không mất data.

**4. Fail-safe collection**
`collector` không crash khi một symbol lỗi. Log lỗi, tiếp tục symbol tiếp theo.

## Service Responsibilities

| Service | Cron | Input | Output | Failure mode |
|---|---|---|---|---|
| `collector` | 5 phút | Binance API | `market_snapshots` rows | Log + skip symbol, retry 3x |
| `scorer` | 5 phút | `market_snapshots` | `imbalance_scores` rows | Log + skip symbol |
| `alerter` | 5 phút | `imbalance_scores` | Telegram message + `alert_log` | Log + retry send 3x |
| `shared-lib` | — | — | Library code, migrations | — |

## Tech Stack

| Layer | Technology | Lý do chọn |
|---|---|---|
| Language | Python 3.12 | Ecosystem data/finance tốt |
| HTTP client | `httpx` | Async-friendly, timeout/retry cấu hình tốt |
| Retry | `tenacity` | Declarative retry |
| ORM | SQLAlchemy 2.x | Type-safe với `Mapped[]` |
| Migrations | Alembic | Tích hợp tốt với SQLAlchemy |
| Config | `pydantic-settings` | Type validation, env parsing tự động |
| Math | `numpy`, `scipy` | zscore, percentile |
| Lint | `ruff` + `black` | Nhanh, strict |
| Type check | `mypy` strict | Bắt lỗi sớm |
| Container | Docker Compose v2 | Single-node deploy |
| DB | PostgreSQL 16-alpine | Reliable, `NUMERIC` type cho financial data |

Chi tiết về data flow xem [docs/architecture/data-flow.md](https://github.com/bili-maker/b-maker-sys/blob/main/docs/architecture/data-flow.md).
