export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    brevoApiKey: process.env.BREVO_API_KEY,
    adminSecret: process.env.ADMIN_SECRET,
    public: {
      adminSecret: process.env.ADMIN_SECRET,
    },
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
  app: {
    head: {
      title: "CodeMastery - Apprenez le développement web",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Apprenez le développement web de 0 à Nuxt.js avec CodeMastery",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
});
