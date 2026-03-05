---
title: Collector API
---

`collector` service — thu thập dữ liệu thị trường từ Binance mỗi 5 phút.

## Endpoints Binance (public, no auth)

| Dữ liệu | Endpoint | Ghi chú |
|---|---|---|
| Funding Rate + Mark Price | `GET /fapi/v1/premiumIndex` | Gọi mỗi 5 phút |
| Open Interest | `GET /fapi/v1/openInterest` | Gọi mỗi 5 phút |
| Volume 5m | `GET /fapi/v1/klines?interval=5m&limit=2` | `klines[-2][5]` = volume nến đã đóng |
| Funding Settle | `GET /fapi/v1/fundingRate?limit=2` | Chỉ gọi khi ≤ 10 phút tới settle window |
| Funding Bootstrap | `GET /fapi/v1/fundingRate?limit=1000` | 1 lần khi startup nếu thiếu 7d history |

## Key Interfaces

```python
@dataclass(frozen=True)
class BinanceSnapshotResponse:
    symbol: str          # e.g. "BTCUSDT"
    funding_rate: str    # lastFundingRate (raw string)
    open_interest: str
    mark_price: str
    volume_5m: str       # volume nến 5m đã đóng
    ts: datetime         # làm tròn về 5 phút

class BinanceClient:
    def fetch_snapshot(self, symbol: str) -> BinanceSnapshotResponse: ...
    def fetch_latest_settle(self, symbol: str) -> BinanceSettleResponse: ...
    def fetch_settle_history(self, symbol: str) -> list[BinanceSettleResponse]: ...
```

## Error Handling

| Exception | Trigger | Pipeline behavior |
|---|---|---|
| `BinanceFetchError` | HTTP 4xx/5xx | Log warning, skip symbol, tiếp tục |
| `RateLimitError` | HTTP 429 | Log warning, tenacity retry 3x |

## Retry Strategy

Tenacity: 3 attempts, exponential backoff (min=2s, max=30s), retry on `RateLimitError` + `httpx.HTTPStatusError`.

## Heartbeat

File `/tmp/collector.heartbeat` được cập nhật sau mỗi run thành công. Docker healthcheck kiểm tra file không quá 10 phút cũ.
