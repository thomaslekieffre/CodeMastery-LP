<template>
  <div
    v-if="!isAuthenticated"
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8"
  >
    <div
      class="max-w-md w-full bg-gray-800/50 backdrop-blur-xl p-8 rounded-xl border border-gray-700"
    >
      <h1 class="text-2xl font-bold text-purple-400 mb-6 text-center">
        Administration
      </h1>

      <form @submit.prevent="checkPassword" class="space-y-4">
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="Mot de passe administrateur"
            class="w-full rounded-lg bg-gray-900/50 border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            required
            :disabled="isLocked"
          />
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="isLocked" class="text-orange-400 text-sm text-center">
          Trop de tentatives. Réessayez dans {{ lockTimeRemaining }} secondes.
        </div>
      </form>
    </div>
  </div>

  <div
    v-else
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8"
  >
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-purple-400">
          Administration Newsletter
        </h1>
        <div class="flex items-center gap-4">
          <div
            class="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700"
          >
            <span class="text-gray-400">Abonnés :</span>
            <span class="text-purple-400 font-bold ml-2">{{
              subscriberCount
            }}</span>
          </div>
          <button
            @click="handleLogout"
            class="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <form
        @submit.prevent="confirmSend"
        class="space-y-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-8"
      >
        <div>
          <label class="block text-gray-300 mb-2">Sujet</label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-purple-500/50"
            required
          />
        </div>

        <div>
          <label class="block text-gray-300 mb-2">Contenu</label>
          <div class="text-sm text-gray-400 mb-2">
            Syntaxe Markdown et variables supportées :
            <ul class="list-disc list-inside ml-4 mt-1">
              <li># à ###### pour les titres</li>
              <li>**texte** pour le gras</li>
              <li>*texte* pour l'italique</li>
              <li>~~texte~~ pour barré</li>
              <li>__texte__ pour souligné</li>
              <li>> pour les citations</li>
              <li v-pre>{{ name }} pour le prénom</li>
              <li v-pre>{{ date }} pour la date du jour</li>
              <li v-pre>{{ year }} pour l'année en cours</li>
              <li v-pre>{{ email_count }} pour le nombre d'abonnés</li>
            </ul>
          </div>
          <textarea
            v-model="form.content"
            rows="8"
            class="w-full bg-gray-900 border-gray-700 rounded-lg text-gray-100 focus:ring-purple-500/50 font-mono"
            required
            v-pre
            placeholder="# Bonjour {{ name }} !

**Bienvenue** dans notre newsletter.

> Une citation inspirante ici

*À bientôt !*"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSending"
          class="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg
            v-if="isSending"
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
          {{ isSending ? "Envoi en cours..." : "Prévisualiser et envoyer" }}
        </button>
      </form>

      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-gray-800 p-6 rounded-xl max-w-2xl w-full">
          <h3 class="text-xl font-bold text-purple-400 mb-4">
            Confirmer l'envoi
          </h3>
          <div class="space-y-4">
            <div class="bg-gray-900 p-4 rounded-lg">
              <p class="text-gray-400">
                Sujet : <span class="text-gray-200">{{ form.subject }}</span>
              </p>
              <p class="text-gray-400 mt-2">Aperçu pour le premier abonné :</p>
              <div
                class="mt-2 text-gray-200 prose prose-invert max-w-none"
                v-html="previewContent"
              ></div>
            </div>
            <p class="text-gray-300">
              Envoyer à {{ subscriberCount }} abonnés ?
            </p>
            <div class="flex gap-4">
              <button
                @click="handleSend"
                class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg"
              >
                Confirmer l'envoi
              </button>
              <button
                @click="showConfirmModal = false"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="sentNewsletters.length > 0" class="space-y-4">
        <h2 class="text-xl font-bold text-purple-400 mb-4">
          Historique des envois
        </h2>
        <div
          v-for="newsletter in sentNewsletters"
          :key="newsletter.date"
          class="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-gray-200">{{ newsletter.subject }}</h3>
              <p class="text-gray-400 text-sm">
                Envoyé le {{ formatDate(newsletter.date) }}
              </p>
            </div>
            <span class="text-gray-400 text-sm"
              >{{ newsletter.recipientCount }} destinataires</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const config = useRuntimeConfig();
const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 30; // secondes

const isAuthenticated = ref(false);
const password = ref("");
const error = ref("");
const attempts = ref(0);
const isLocked = ref(false);
const lockTimeRemaining = ref(0);
let lockTimer = null;
const subscriberCount = ref(0);
const sentNewsletters = ref([]);
const form = ref({ subject: "", content: "" });
const isSending = ref(false);
const showConfirmModal = ref(false);
const previewContent = ref("");

const checkPassword = () => {
  if (isLocked.value) return;

  if (password.value === config.public.adminSecret) {
    isAuthenticated.value = true;
    error.value = "";
    attempts.value = 0;
  } else {
    attempts.value++;
    error.value = `Mot de passe incorrect (${attempts.value}/${MAX_ATTEMPTS} tentatives)`;

    if (attempts.value >= MAX_ATTEMPTS) {
      lockAccount();
    }
  }
  password.value = "";
};

const lockAccount = () => {
  isLocked.value = true;
  lockTimeRemaining.value = LOCK_DURATION;
  error.value = "";

  lockTimer = setInterval(() => {
    lockTimeRemaining.value--;
    if (lockTimeRemaining.value <= 0) {
      clearInterval(lockTimer);
      isLocked.value = false;
      attempts.value = 0;
    }
  }, 1000);
};

const handleLogout = () => {
  isAuthenticated.value = false;
  password.value = "";
  error.value = "";
};

onUnmounted(() => {
  if (lockTimer) clearInterval(lockTimer);
});

async function loadData() {
  const config = useRuntimeConfig();

  try {
    const countResponse = await fetch("/api/subscribers/count", {
      headers: {
        Authorization: `Bearer ${config.public.adminSecret}`,
      },
    });
    const countData = await countResponse.json();
    if (countResponse.ok) {
      subscriberCount.value = countData.count;
    }

    const historyResponse = await fetch("/api/newsletters/history", {
      headers: {
        Authorization: `Bearer ${config.public.adminSecret}`,
      },
    });
    const historyData = await historyResponse.json();
    if (historyResponse.ok) {
      sentNewsletters.value = historyData.newsletters;
    }
  } catch (error) {
    console.error("Erreur d'initialisation:", error);
  }
}

onMounted(() => {
  loadData();
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function confirmSend() {
  try {
    const response = await fetch("/api/newsletters/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.public.adminSecret}`,
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    previewContent.value = data.preview;
    showConfirmModal.value = true;
  } catch (error) {
    console.error("Erreur:", error);
    alert(error.message || "Erreur lors de la prévisualisation");
  }
}

async function handleSend() {
  try {
    isSending.value = true;
    const response = await fetch("/api/send-newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.public.adminSecret}`,
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    showConfirmModal.value = false;
    form.value = { subject: "", content: "" };
    await loadData();
  } catch (error) {
    console.error("Erreur:", error);
    alert(error.message || "Erreur lors de l'envoi");
  } finally {
    isSending.value = false;
  }
}
</script>
