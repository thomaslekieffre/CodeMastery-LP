import { supabase } from "../../utils/supabase";
import { generateEmailTemplate } from "../../utils/emailTemplate";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, "authorization");
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      throw createError({
        statusCode: 401,
        message: "Non autorisé",
      });
    }

    const { content } = await readBody(event);

    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("*")
      .limit(1);

    if (error) throw error;

    if (!subscribers || subscribers.length === 0) {
      return {
        preview: "Aucun abonné pour prévisualiser",
      };
    }

    const preview = await generateEmailTemplate({
      content,
      name: subscribers[0].name,
      unsubscribeToken: subscribers[0].unsubscribe_token,
      subscriberCount: subscribers.length,
    });

    return {
      preview,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Erreur lors de la prévisualisation",
    });
  }
});
