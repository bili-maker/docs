# Alerter API

`alerter` service — kiểm tra score và gửi Telegram alert.

## Alert Trigger Conditions

Alert được gửi khi thoả **một trong hai điều kiện**:

| Điều kiện | alert_type | Cooldown |
|---|---|---|
| `score > 85` hoặc `label == "Squeeze Risk"` | `"squeeze"` | 30 phút |
| `label in ("Crowded Long", "Crowded Short") AND price_stall` | `"crowded"` | 2 giờ |

> Cooldown per type là **độc lập**: squeeze cooldown không block crowded alert cho cùng symbol.

## Alert Format (Telegram Markdown)

```
🚨 *BTCUSDT* — Crowded Long

Score:    92/100
Funding:  +0.0312% (P85)
ΔOI:      +2.3%  (z=2.1)
Volume:   ×3.2 avg (z=1.9)
Stall:    YES — price flat 15m

📊 TradingView: https://www.tradingview.com/chart/?symbol=BINANCE:BTCUSDT.P
```

## Cooldown Configuration

Giá trị mặc định trong `Settings`, có thể override qua `.env`:

```bash
ALERT_COOLDOWN_SQUEEZE_SECONDS=1800   # 30 phút
ALERT_COOLDOWN_CROWDED_SECONDS=7200   # 2 giờ
```

## Key Interfaces

```python
class Notifier(Protocol):
    def send(self, message: str) -> None: ...

class TelegramNotifier:
    def __init__(self, token: str, chat_id: str) -> None: ...
    def send(self, message: str) -> None: ...  # raises NotificationError on failure

class CooldownChecker:
    def is_cooling_down(self, symbol: str, alert_type: str) -> bool: ...

@dataclass(frozen=True)
class AlertResult:
    alerts_sent: int
    symbols_triggered: list[str]
    symbols_skipped: list[str]
```

## Error Handling

| Exception | Trigger | Behavior |
|---|---|---|
| `NotificationError` | Telegram API thất bại sau 3 retry | Log error, tiếp tục symbol tiếp theo |

## DB Query

Alerter dùng `DISTINCT ON` để lấy latest score của tất cả symbols trong **1 query** (không N+1):

```sql
SELECT DISTINCT ON (symbol) *
FROM imbalance_scores
ORDER BY symbol, ts DESC
```
