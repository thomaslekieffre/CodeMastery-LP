import { supabase } from "../../utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      throw createError({
        statusCode: 401,
        message: "Non autorisé",
      });
    }

    const { data: newsletters, error } = await supabase
      .from("newsletters")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      newsletters,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: "Erreur lors de la récupération de l'historique",
    });
  }
});
