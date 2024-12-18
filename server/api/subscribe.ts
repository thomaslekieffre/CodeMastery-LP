import { supabase } from "../utils/supabase";
import { randomBytes } from "crypto";
import { sendEmail } from "../utils/brevo";

const generateUnsubscribeToken = () => {
  return randomBytes(32).toString("hex");
};

const welcomeEmailContent = `# Bienvenue {{name}} ! 🎉

Merci de vous être inscrit à la newsletter CodeMastery !

Vous faites maintenant partie d'une communauté de {{email_count}} passionnés du développement web.

Voici ce que tu peux attendre de nous chaque semaine :
- Des conseils pratiques pour débuter en développement web
- Des idées de projets concrets pour t'améliorer
- Une roadmap claire pour définir ton projet d'apprentissage
- Des astuces en tout genre pour progresser !

> Vous recevrez régulièrement des conseils, des tutoriels et des astuces pour progresser en développement web.

> En cadeau, recevez l'accès à notre serveur discord : https://discord.gg/kBpc9gqn

À très bientôt !

*L'équipe CodeMastery*`;

export default defineEventHandler(async (event: any) => {
  try {
    const { email, name } = await readBody(event);
    const unsubscribeToken = generateUnsubscribeToken();

    const { error } = await supabase.from("subscribers").insert({
      email,
      name,
      unsubscribe_token: unsubscribeToken,
    });

    if (error?.code === "23505") {
      throw createError({
        statusCode: 400,
        message: "Cet email est déjà inscrit !",
      });
    }

    if (error) throw error;

    // Récupération du nombre total d'abonnés
    const { count } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true });

    // Envoi de l'email de bienvenue
    await sendEmail({
      to: email,
      subject: "Bienvenue sur CodeMastery ! 🚀",
      content: welcomeEmailContent,
      subscriber: {
        name,
        email,
        unsubscribeToken,
        totalSubscribers: count || 1,
      },
    });

    return {
      success: true,
      message: "Inscription réussie !",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'inscription",
    });
  }
});
