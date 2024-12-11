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

    const { count, error } = await supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return { count: count || 0 };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors du comptage des abonnés",
    });
  }
});
