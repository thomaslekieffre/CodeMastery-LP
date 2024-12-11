import { supabase } from "../utils/supabase";
import { sendEmail } from "../utils/brevo";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      throw createError({
        statusCode: 401,
        message: "Non autorisé",
      });
    }

    const { subject, content } = await readBody(event);

    const { data: subscribers, error: subsError } = await supabase
      .from("subscribers")
      .select("*");

    if (subsError) throw subsError;

    if (!subscribers || subscribers.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Aucun abonné à qui envoyer la newsletter",
      });
    }

    // Envoi des emails
    const emailPromises = subscribers.map((sub) =>
      sendEmail({
        to: sub.email,
        subject,
        content,
        subscriber: {
          ...sub,
          unsubscribeToken: sub.unsubscribe_token,
          totalSubscribers: subscribers.length,
        },
      })
    );

    const emailResults = await Promise.allSettled(emailPromises);
    const successCount = emailResults.filter(
      (r) => r.status === "fulfilled"
    ).length;

    // Sauvegarde dans l'historique
    const { error: historyError } = await supabase.from("newsletters").insert({
      subject,
      content,
      recipient_count: successCount,
      total_attempted: subscribers.length,
    });

    if (historyError) throw historyError;

    return {
      success: true,
      message: `${successCount}/${subscribers.length} emails envoyés avec succès`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de l'envoi",
    });
  }
});
