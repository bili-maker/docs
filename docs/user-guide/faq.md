# FAQ & Troubleshooting

## FAQ

**Q: Tôi không nhận được alert dù đang ở channel?**

A: Hệ thống có cooldown để tránh spam. Nếu alert vừa gửi cách đây dưới 30 phút (Squeeze Risk) hoặc dưới 2 giờ (Crowded) cho cùng symbol, alert tiếp theo sẽ bị hold. Kiểm tra lịch sử signal trên dashboard để xác nhận.

---

**Q: Score cao nhưng giá không di chuyển?**

A: Score đo áp lực tích tụ, không đảm bảo giá sẽ move ngay. Squeeze có thể kéo dài vài giờ trước khi xảy ra. Dùng như context để nhận biết môi trường rủi ro, không phải signal buy/sell trực tiếp.

---

**Q: Tại sao chỉ theo dõi 10 symbols?**

A: MVP tập trung vào top 10 USDT-M perpetual pairs có thanh khoản cao nhất để đảm bảo chất lượng signal. Thêm symbols sẽ có trong các phiên bản sau.

---

**Q: Squeeze Risk không có hướng Long/Short — cách dùng thế nào?**

A: Xem Funding trong alert để đoán hướng tiềm năng:
- Funding P > 50 → Long bias → nguy cơ **dump** (Long bị squeeze)
- Funding P < 50 → Short bias → nguy cơ **pump** (Short bị squeeze)

Không có gì đảm bảo — đây chỉ là context về side nào đang bị overloaded.

---

**Q: Pro tier khác Free thế nào?**

| | Free | Pro |
|---|---|---|
| Alert Telegram | ✅ | ✅ |
| Dashboard Overview | ✅ | ✅ |
| Signal History | 20 records | 500 records |
| API Access | ❌ | ✅ |
| Backtest Engine | ❌ | ✅ |
| Rate Limit | 10 req/min | 120 req/min |

---

**Q: Upgrade lên Pro như thế nào?**

A: Chuyển khoản theo thông tin hiển thị tại trang `/account` trên dashboard → nhắn admin xác nhận → được cấp Pro trong 24 giờ.

---

## Troubleshooting

**Dashboard không load hoặc load chậm:**

Clear cache trình duyệt và thử lại. Nếu vẫn lỗi, hệ thống có thể đang bảo trì — thử lại sau 5–10 phút.

---

**API key không hoạt động (401 Unauthorized):**

Kiểm tra các điểm sau:
1. Header phải là `X-API-Key: bms_...` — **không** có prefix `Bearer`
2. API key phải thuộc tài khoản Pro — Free tier không có API access
3. Key phải chính xác, không thừa/thiếu ký tự

---

**Backtest chạy lâu không ra kết quả:**

Poll endpoint `GET /api/v1/backtest/{job_id}` sau 30–60 giây kể từ khi tạo job. Backtest 1 năm × 10 symbols mất khoảng 10–30 giây xử lý. Nếu sau 5 phút vẫn không có kết quả, tạo lại job.
