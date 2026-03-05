---
title: Contributing
---

Hướng dẫn đóng góp code cho b-maker-sys.

## Workflow

1. Đọc `AGENTS.md` — quy trình planning (Cursor) và coding (opencode)
2. Tạo epic + tasks qua `scripts/bd-plan.sh` (planning session)
3. Implement theo task description trong `bd` (coding session)
4. Chạy quality gate trước khi commit

## Quality Gate (bắt buộc)

```bash
ruff check .
black --check .
mypy .
pytest --cov=. --cov-report=term-missing
```

Tất cả phải pass — zero errors, zero diffs.

## Coding Standards

- Python 3.12 + strict mypy
- Không dùng `Any` trừ khi có comment giải thích
- Không `print()` trong production code
- Mọi hàm/method phải có type annotation
- Không hardcode magic numbers
- Dùng `structlog` cho logging
- Dùng `Decimal` cho financial values

Chi tiết xem [engineering/coding-style](https://github.com/bili-maker/b-maker-sys/blob/main/docs/engineering/coding-style.md).

## Layer Rules

| Layer | Được làm | Không được làm |
|---|---|---|
| `main.py` | Wiring, run loop | Business logic, DB queries |
| `pipeline.py` | Orchestrate, error boundary | HTTP calls, DB queries, math |
| `client/` | HTTP, retry, parse JSON | DB, business logic |
| `repository.py` | SQLAlchemy queries | HTTP, business logic |
| `metrics.py` / `scoring.py` | Pure math | Bất kỳ I/O nào |

## Commit Convention

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

Scopes: `collector`, `scorer`, `alerter`, `shared-lib`, `docs`, `infra`, `monorepo`

Ví dụ:
```
feat(collector): add retry logic with exponential backoff
fix(scorer): handle zero std deviation in z_oi calculation
docs(deployment): add Cloudflare Pages setup guide
```

## Test Standards

- Unit tests: pure functions, không mock gì
- Integration tests: SQLite in-memory
- Mock chỉ ở HTTP boundary (httpx)
- Coverage tối thiểu: 90% cho `metrics.py`, `scoring.py`, `formatter.py`

## PR Checklist

- [ ] `ruff check .` — 0 errors
- [ ] `black --check .` — 0 diffs
- [ ] `mypy .` — 0 errors
- [ ] `pytest` — all pass
- [ ] Không có `print()` trong production code
- [ ] Không có hardcoded credentials
- [ ] Docs đã update nếu có thay đổi behavior
