<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8"
  >
    <div class="max-w-md w-full bg-gray-800 rounded-xl p-8 text-center">
      <div v-if="loading" class="text-gray-300">Traitement en cours...</div>

      <div v-else-if="error" class="text-red-400">
        {{ error }}
      </div>

      <div v-else class="space-y-4">
        <div
          class="h-16 w-16 mx-auto rounded-xl bg-purple-500/10 flex items-center justify-center mb-6"
        >
          <span class="text-3xl">👋</span>
        </div>
        <h1 class="text-2xl font-bold text-purple-400">
          Désabonnement confirmé
        </h1>
        <p class="text-gray-300">
          Vous avez été désabonné avec succès de notre newsletter.
        </p>
        <p class="text-gray-400 text-sm">
          Vous pouvez toujours vous réinscrire depuis la page d'accueil.
        </p>
        <div class="pt-4">
          <a href="/" class="text-purple-400 hover:text-purple-300 text-sm">
            Retourner à l'accueil
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const token = route.query.token;
    const response = await fetch(`/api/unsubscribe?token=${token}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
  } catch (err) {
    error.value = err.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
});
</script>
