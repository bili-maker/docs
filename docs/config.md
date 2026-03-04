# Configuration

Tất cả cấu hình đọc từ file `.env` qua `pydantic-settings`. Không có hardcoded value nào trong code.

## Environment Variables

### Required

| Variable | Example | Mô tả |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@postgres:5432/bmaker` | PostgreSQL connection string |
| `TELEGRAM_BOT_TOKEN` | `123456:ABC-...` | Token từ @BotFather |
| `TELEGRAM_CHAT_ID` | `-100123456789` | Channel hoặc group chat ID |
| `SYMBOLS` | `BTC,ETH,SOL,...` | Danh sách symbols (comma-separated, không có USDT) |

### Optional (có default)

| Variable | Default | Mô tả |
|---|---|---|
| `COLLECT_INTERVAL_SECONDS` | `300` | Interval collector fetch data (giây) |
| `SCORE_INTERVAL_SECONDS` | `300` | Interval scorer tính toán (giây) |
| `ALERT_SCORE_THRESHOLD` | `85` | Score tối thiểu để trigger alert |
| `ALERT_COOLDOWN_SQUEEZE_SECONDS` | `1800` | Cooldown Squeeze Risk alert (30 phút) |
| `ALERT_COOLDOWN_CROWDED_SECONDS` | `7200` | Cooldown Crowded alert (2 giờ) |
| `MIN_FUNDING_WINDOW` | `21` | Số settle tối thiểu để tính funding_percentile (7d × 3/ngày) |
| `STALE_DATA_THRESHOLD_MINUTES` | `15` | Snapshot cũ hơn X phút → InsufficientDataError |
| `BINANCE_API_KEY` | `""` | Binance API key (public endpoints không cần) |
| `BINANCE_API_SECRET` | `""` | Binance API secret |

## `.env.example`

```bash
# Database
DATABASE_URL=postgresql://bmaker:bmaker@postgres:5432/bmaker

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Symbols (top 10 USDT-M)
SYMBOLS=BTC,ETH,SOL,BNB,XRP,DOGE,ADA,AVAX,LINK,OP

# Alert thresholds (optional — defaults shown)
ALERT_SCORE_THRESHOLD=85
ALERT_COOLDOWN_SQUEEZE_SECONDS=1800
ALERT_COOLDOWN_CROWDED_SECONDS=7200
```

## Thay đổi config

Sửa `.env` rồi restart service:

```bash
docker compose restart scorer alerter
```

Không cần rebuild image khi chỉ thay đổi env vars.
