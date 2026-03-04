---
layout: home

hero:
  name: "b-maker-sys"
  text: "Futures Imbalance Engine"
  tagline: Phát hiện mất cân bằng Long/Short trên Binance USDT-M và gửi cảnh báo Telegram theo thời gian thực.
  actions:
    - theme: brand
      text: Bắt đầu nhanh
      link: /user-guide/quickstart
    - theme: alt
      text: Developer Guide
      link: /getting-started

features:
  - title: Real-time Detection
    details: Thu thập dữ liệu Binance mỗi 5 phút — Funding Rate, Open Interest, Price, Volume cho 10 symbols USDT-M.
  - title: Imbalance Score 0–100
    details: Tính toán z_OI, z_Volume, funding_percentile, price_stall và tổng hợp thành điểm 0–100 với label rõ ràng.
  - title: Telegram Alerts
    details: Cảnh báo tức thì khi Score > 85 hoặc Crowded + Price Stall. Cooldown thông minh tránh spam.
---
