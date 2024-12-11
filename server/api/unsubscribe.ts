import { supabase } from "../utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const { token } = getQuery(event);

    if (!token) {
      throw createError({
        statusCode: 400,
        message: "Token manquant",
      });
    }

    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("unsubscribe_token", token);

    if (error) throw error;

    return {
      message: "Désabonnement effectué avec succès",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors du désabonnement",
    });
  }
});
