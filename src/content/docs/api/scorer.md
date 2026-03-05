---
title: Scorer API
---

`scorer` service — tính toán Imbalance Score từ dữ liệu thị trường.

## Metrics

### z_OI — Z-score Open Interest

```python
delta_oi = [oi[t] - oi[t-1] for t in window]  # 24h window
z_oi = (delta_oi[-1] - mean(delta_oi)) / std(delta_oi)
```

Clamp: `[-5, 5]`. Returns `0.0` khi std = 0 (chuỗi flat).

### z_Volume — Z-score Volume

```python
z_volume = (vol[-1] - mean(vol)) / std(vol)  # 24h window, 288 điểm × 5m
```

Clamp: `[-5, 5]`.

### funding_percentile — Phân vị Funding

```python
# window = 21 settle gần nhất (7 ngày × 3/ngày) từ funding_settlements
funding_percentile = percentileofscore(window_values, float(current_funding), kind="rank")
# range [0, 100]: 0 = thấp nhất, 100 = cao nhất toàn 7d
```

### price_stall — Boolean

```python
return abs(price_return_15m) < 0.002 and z_oi > 1.5
```

## Imbalance Score Formula

```python
funding_extreme = abs(funding_percentile - 50) / 50  # 0.0–1.0

score = clip(
    40 * normalize(z_oi, 0, 3)       # 0–40 pts
  + 25 * normalize(z_volume, 0, 3)   # 0–25 pts
  + 25 * funding_extreme              # 0–25 pts
  + 10 * (1 if price_stall else 0),  # 0–10 pts
  0.0, 100.0
)
```

## Label Classification

| Label | Điều kiện |
|---|---|
| `Squeeze Risk` | `score > 85 AND price_stall` |
| `Crowded Long` | `funding_percentile > 80 AND z_oi > 1.0` |
| `Crowded Short` | `funding_percentile < 20 AND z_oi > 1.0` |
| `Neutral` | Không thoả điều kiện nào |

Squeeze Risk được check đầu tiên (priority).

## Key Interfaces

```python
class MetricInput(BaseModel):
    symbol: str
    oi_window: list[Decimal]         # 24h, len >= 2
    volume_5m_window: list[Decimal]  # 24h, len >= 2
    funding_window: list[Decimal]    # 7d settle, len >= 21
    current_funding: Decimal         # = funding_window[-1]
    price_window_15m: list[Decimal]  # 3 điểm gần nhất

class ScoreResult(BaseModel):
    symbol: str
    ts: datetime
    z_oi: float
    z_volume: float
    funding_percentile: float
    price_stall: bool
    score: float
    label: Literal["Crowded Long", "Crowded Short", "Squeeze Risk", "Neutral"]
```

## Error Handling

| Exception | Trigger | Pipeline behavior |
|---|---|---|
| `InsufficientDataError` | Window quá ngắn (< 2 OI, < 21 settle) | Log warning, skip symbol |
