import { defineConfig } from "vitepress";

export default defineConfig({
  title: "b-maker-sys",
  description: "Futures Imbalance Engine — Binance USDT-M",
  base: "/docs/",
  themeConfig: {
    nav: [
      { text: "User Guide", link: "/user-guide/quickstart" },
      { text: "Developer", link: "/getting-started" },
      { text: "API", link: "/api/collector" },
      { text: "Schema", link: "/schema" },
      { text: "Changelog", link: "/changelog" },
    ],
    sidebar: {
      "/user-guide/": [
        { text: "Bắt đầu nhanh", link: "/user-guide/quickstart" },
        { text: "Khái niệm cốt lõi", link: "/user-guide/concepts" },
        { text: "Đọc Alert Telegram", link: "/user-guide/telegram-alerts" },
        { text: "Web Dashboard", link: "/user-guide/dashboard" },
        { text: "API Reference (Pro)", link: "/user-guide/api-reference" },
        { text: "FAQ & Troubleshooting", link: "/user-guide/faq" },
      ],
      "/": [
        { text: "Overview", link: "/" },
        { text: "Architecture", link: "/architecture" },
        { text: "Getting Started", link: "/getting-started" },
        { text: "Configuration", link: "/config" },
        { text: "DB Schema", link: "/schema" },
        { text: "Deployment", link: "/deployment" },
        { text: "Contributing", link: "/contributing" },
        { text: "Changelog", link: "/changelog" },
      ],
      "/api/": [
        { text: "Collector", link: "/api/collector" },
        { text: "Scorer", link: "/api/scorer" },
        { text: "Alerter", link: "/api/alerter" },
      ],
    },
    socialLinks: [{ icon: "github", link: "https://github.com/bili-maker" }],
    editLink: {
      pattern:
        "https://github.com/bili-maker/docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});
