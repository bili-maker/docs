import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";

export default defineConfig({
  base: "/docs",
  integrations: [
    starlight({
      title: "bili-maker",
      description: "Futures Imbalance Engine — Binance USDT-M",
      social: {
        github: "https://github.com/bili-maker",
      },
      editLink: {
        baseUrl: "https://github.com/bili-maker/docs/edit/main/src/content/docs/",
      },
      sidebar: [
        {
          label: "User Guide",
          items: [
            { label: "Bắt đầu nhanh", slug: "user-guide/quickstart" },
            { label: "Khái niệm cốt lõi", slug: "user-guide/concepts" },
            { label: "Đọc Alert Telegram", slug: "user-guide/telegram-alerts" },
            { label: "Web Dashboard", slug: "user-guide/dashboard" },
            { label: "API Reference (Pro)", slug: "user-guide/api-reference" },
            { label: "FAQ & Troubleshooting", slug: "user-guide/faq" },
          ],
        },
        {
          label: "Developer",
          items: [
            { label: "Getting Started", slug: "getting-started" },
            { label: "Architecture", slug: "architecture" },
            { label: "Configuration", slug: "config" },
            { label: "Deployment", slug: "deployment" },
            { label: "DB Schema", slug: "schema" },
            { label: "Contributing", slug: "contributing" },
            { label: "Changelog", slug: "changelog" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Collector", slug: "api/collector" },
            { label: "Scorer", slug: "api/scorer" },
            { label: "Alerter", slug: "api/alerter" },
          ],
        },
      ],
    }),
    react(),
  ],
});
