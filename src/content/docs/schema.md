---
title: DB Schema
---

PostgreSQL 16. Tất cả bảng được tạo qua Alembic migration `0001_init.py`.

## `market_snapshots`

Lưu snapshot 5 phút từ Binance. Primary data source cho scorer.

| Column | Type | Nullable | Ghi chú |
|---|---|---|---|
| `id` | bigint PK | NOT NULL | |
| `symbol` | varchar(20) | NOT NULL | BTC, ETH, ... |
| `ts` | timestamptz | NOT NULL | Làm tròn về 5 phút |
| `funding_rate` | numeric | NOT NULL | `lastFundingRate` từ premiumIndex (dùng cho alert display) |
| `open_interest` | numeric | **NULL OK** | NULL khi bootstrap từ funding history |
| `price` | numeric | **NULL OK** | NULL khi bootstrap |
| `volume_5m` | numeric | **NULL OK** | NULL khi bootstrap. Volume nến 5m đã đóng |
| `created_at` | timestamptz | NOT NULL | `now()` |

**Constraints:**
- `UNIQUE (symbol, ts)` — `uq_market_snapshots_symbol_ts`
- Index: `ix_market_snapshots_symbol_ts`

## `funding_settlements`

Lưu funding settle 8h/lần. Dùng riêng để tính `funding_percentile`.

> Tách riêng khỏi `market_snapshots` vì `lastFundingRate` (premiumIndex) và settle rate có ngữ nghĩa khác nhau. Xem [ADR-0004](https://github.com/bili-maker/b-maker-sys/blob/main/docs/decisions/ADR-0004-funding-settle-source.md).

| Column | Type | Nullable | Ghi chú |
|---|---|---|---|
| `id` | bigint PK | NOT NULL | |
| `symbol` | varchar(20) | NOT NULL | |
| `funding_time` | timestamptz | NOT NULL | Thời điểm settle chính xác (00:00/08:00/16:00 UTC) |
| `funding_rate` | numeric | NOT NULL | Giá trị đã settle |
| `created_at` | timestamptz | NOT NULL | `now()` |

**Constraints:**
- `UNIQUE (symbol, funding_time)` — `uq_funding_settlements_symbol_time`
- Index: `ix_funding_settlements_symbol_time`

## `imbalance_scores`

Kết quả tính toán của scorer. Alerter đọc từ bảng này.

| Column | Type | Nullable | Ghi chú |
|---|---|---|---|
| `id` | bigint PK | NOT NULL | |
| `symbol` | varchar(20) | NOT NULL | |
| `ts` | timestamptz | NOT NULL | |
| `z_oi` | numeric | NOT NULL | Z-score ΔOI trong 24h |
| `z_volume` | numeric | NOT NULL | Z-score Volume trong 24h |
| `funding_percentile` | numeric | NOT NULL | 0–100 — phân vị settle 7d |
| `price_stall` | boolean | NOT NULL | |
| `score` | numeric | NOT NULL | 0–100 |
| `label` | varchar(30) | NOT NULL | `Crowded Long` / `Crowded Short` / `Squeeze Risk` / `Neutral` |
| `created_at` | timestamptz | NOT NULL | `now()` |

**Constraints:**
- `UNIQUE (symbol, ts)` — `uq_imbalance_scores_symbol_ts`
- Index: `ix_imbalance_scores_symbol_ts`

## `alert_log`

Lịch sử alert đã gửi. Dùng bởi CooldownChecker.

| Column | Type | Nullable | Ghi chú |
|---|---|---|---|
| `id` | bigint PK | NOT NULL | |
| `symbol` | varchar(20) | NOT NULL | |
| `score_id` | bigint FK → imbalance_scores | **NULL OK** | `ondelete="SET NULL"` — tự NULL khi score row bị purge |
| `alert_type` | varchar(20) | NOT NULL | `"squeeze"` hoặc `"crowded"` |
| `sent_at` | timestamptz | NOT NULL | `now()` |
| `message` | text | NOT NULL | Nội dung đã gửi |

**Index:** `ix_alert_log_symbol_sent_at` — cho query cooldown `WHERE symbol=? AND sent_at >= now()-interval`.

## Migration Convention

Alembic migrations trong `repos/shared-lib/alembic/versions/`.

```bash
make migrate    # apply tất cả pending migrations
```

Tên file: `NNNN_<description>.py` (4 chữ số). Không được sửa migration đã apply vào production — tạo migration mới.
