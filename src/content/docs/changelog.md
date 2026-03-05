---
title: Changelog
---

Ghi lại tất cả thay đổi đáng kể theo thứ tự thời gian ngược.

## Index

| Date | Entry | Type | Scope |
|---|---|---|---|
| 2026-03-04 | [Phase 6 — VitePress Docs Site](#2026-03-04-phase-6-docs) | ✨ Feature | docs |
| 2026-03-03 | [Phase 5 — Integration & QA complete, MVP live](#2026-03-03-phase-5) | ✨ Feature | monorepo |
| 2026-03-03 | [Alerter service — Phase 4](#2026-03-03-phase-4) | ✨ Feature | alerter |
| 2026-03-03 | [Scorer service — Phase 3](#2026-03-03-phase-3) | ✨ Feature | scorer |
| 2026-03-03 | [Collector service — Phase 2](#2026-03-03-phase-2) | ✨ Feature | collector |
| 2026-03-02 | [Initial monorepo setup](#2026-03-02-init) | Setup | monorepo |
| 2026-03-02 | [Docs site với Cloudflare Pages](#2026-03-02-docs) | ✨ Feature | docs |

---

## 2026-03-04: Phase 6 — VitePress Docs Site {#2026-03-04-phase-6-docs}

**Scope:** docs

Khởi tạo `repos/docs` với VitePress 1.x. Setup navigation 2 section: User Guide (tiếng Việt cho traders) và Developer docs. GitHub Actions deploy tự động lên Cloudflare Pages.

**Added:**
- `repos/docs/package.json` — VitePress devDep, scripts dev/build/preview
- `repos/docs/.vitepress/config.ts` — nav với User Guide + Developer sections, sidebar đầy đủ
- Developer docs: index, architecture, getting-started, config, schema, deployment, contributing, changelog
- Developer API docs: collector, scorer, alerter
- User Guide: quickstart, concepts, telegram-alerts, dashboard, api-reference, faq
- `.github/workflows/deploy.yml` — Cloudflare Pages auto-deploy on push main

---

## 2026-03-03: Phase 5 — Integration & QA {#2026-03-03-phase-5}

**Scope:** monorepo

MVP live. E2E test pass: collector → scorer → alerter → Telegram. Tất cả 5 Docker services healthy. Cron purge 30 ngày hoạt động.

---

## 2026-03-03: Alerter service — Phase 4 {#2026-03-03-phase-4}

**Scope:** alerter

Implements `alerter` service: poll imbalance_scores, kiểm tra threshold + cooldown per type (squeeze: 30m, crowded: 2h), gửi Telegram với format đầy đủ. Strategy Pattern với `Notifier` Protocol.

---

## 2026-03-03: Scorer service — Phase 3 {#2026-03-03-phase-3}

**Scope:** scorer

Implements `scorer` service: Functional Core pattern. Pure functions `compute_z_oi`, `compute_z_volume`, `compute_funding_percentile`, `compute_price_stall`. Score 0–100, label classification.

---

## 2026-03-03: Collector service — Phase 2 {#2026-03-03-phase-2}

**Scope:** collector

Implements `collector` service: Pipeline pattern. Fetch 5 trường cho 10 symbols mỗi 5 phút. Bootstrap funding history 7d. Funding settle window detection. 52 tests, 93% coverage.

---

## 2026-03-02: Initial monorepo setup {#2026-03-02-init}

**Scope:** monorepo

Tạo monorepo `b-maker-sys` với Docker Compose, 4 sub-repos, Makefile, `repos.sh`, `AGENTS.md` workflow, toàn bộ docs structure.

---

## 2026-03-02: Docs site với Cloudflare Pages {#2026-03-02-docs}

**Scope:** docs

ADR-0003: chọn Cloudflare Pages thay GitHub Pages vì hỗ trợ private repo miễn phí. Tạo toàn bộ docs structure trong monorepo.
