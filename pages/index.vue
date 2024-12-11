<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
  >
    <div
      class="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
    ></div>

    <header class="container mx-auto py-16 relative">
      <div
        class="absolute top-10 left-1/2 -translate-x-1/2 h-64 w-64 bg-purple-500 rounded-full blur-3xl opacity-20"
      ></div>
      <h1
        class="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center font-space-grotesk"
      >
        Maîtrisez le code grâce à CodeMastery
      </h1>
      <p class="text-xl text-center mt-6 text-gray-300 max-w-2xl mx-auto">
        Découvrez l'art du développement web moderne à travers des formations
        exclusives et immersives.
      </p>
    </header>

    <main class="container mx-auto py-12 px-4 relative z-10">
      <form
        @submit.prevent="handleSubmit"
        class="max-w-md mx-auto backdrop-blur-xl bg-gray-900/50 p-8 rounded-2xl border border-gray-700 shadow-xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        ></div>

        <div class="space-y-6 relative z-10">
          <div class="space-y-2">
            <label
              for="name"
              class="block text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors"
            >
              Prénom
            </label>
            <div class="relative">
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 pl-10"
                required
              />
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >👤</span
              >
            </div>
          </div>

          <div class="space-y-2">
            <label
              for="email"
              class="block text-sm font-medium text-gray-300 group-hover:text-purple-300 transition-colors"
            >
              Email
            </label>
            <div class="relative">
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="mt-1 block w-full rounded-lg bg-gray-800/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 pl-10"
                required
              />
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >✉️</span
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium relative overflow-hidden group"
          >
            <span
              class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></span>
            <span class="relative flex items-center justify-center gap-2">
              <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{
                isLoading ? "Inscription en cours..." : "Commencer l'aventure"
              }}
              <svg
                v-if="!isLoading"
                class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </button>

          <div
            v-if="showSuccess"
            class="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-fade-in"
          >
            <p
              class="text-green-400 text-center flex items-center justify-center gap-2"
            >
              <span class="animate-bounce">🚀</span>
              Super ! Bienvenue dans l'aventure CodeMastery
            </p>
          </div>

          <div
            v-if="errorMessage"
            class="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-fade-in"
          >
            <p
              class="text-red-400 text-center flex items-center justify-center gap-2"
            >
              <span>⚠️</span>
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </form>

      <section class="mt-24">
        <h2
          class="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-12"
        >
          Pourquoi choisir CodeMastery ?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            class="p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div
              class="h-16 w-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6"
            >
              <span class="text-3xl">💻</span>
            </div>
            <h3
              class="font-bold text-2xl mb-4 text-gray-100 group-hover:text-purple-400 transition-colors"
            >
              Projets Concrets
            </h3>
            <p class="text-gray-400 text-lg leading-relaxed">
              Apprenez en construisant de vrais projets. Pas de théorie
              abstraite, que du concret applicable immédiatement.
            </p>
          </div>

          <div
            class="p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div
              class="h-16 w-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6"
            >
              <span class="text-3xl">📊</span>
            </div>
            <h3
              class="font-bold text-2xl mb-4 text-gray-100 group-hover:text-purple-400 transition-colors"
            >
              Schémas Explicatifs
            </h3>
            <p class="text-gray-400 text-lg leading-relaxed">
              Des concepts complexes rendus simples grâce à nos schémas
              détaillés et nos explications visuelles.
            </p>
          </div>

          <div
            class="p-8 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div
              class="h-16 w-16 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6"
            >
              <span class="text-3xl">👥</span>
            </div>
            <h3
              class="font-bold text-2xl mb-4 text-gray-100 group-hover:text-purple-400 transition-colors"
            >
              Communauté Active
            </h3>
            <p class="text-gray-400 text-lg leading-relaxed">
              Ne codez plus seul. Rejoignez une communauté dynamique de
              développeurs passionnés prêts à vous aider.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup>
import { ref } from "vue";

const formData = ref({
  name: "",
  email: "",
});

const isLoading = ref(false);
const showSuccess = ref(false);
const errorMessage = ref("");
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const handleSubmit = async () => {
  try {
    console.log("Soumission du formulaire...");
    isLoading.value = true;
    errorMessage.value = "";

    if (!emailRegex.test(formData.value.email)) {
      throw new Error("Adresse email invalide");
    }

    const response = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(formData.value),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Réponse reçue:", data);

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de l'inscription");
    }

    showSuccess.value = true;
    formData.value = { name: "", email: "" };
  } catch (error) {
    console.error("Erreur:", error);
    errorMessage.value = error.message || "Une erreur est survenue";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
.font-space-grotesk {
  font-family: "Space Grotesk", sans-serif;
}
</style>
