import { supabase } from "../utils/supabase";
import { randomBytes } from "crypto";

const generateUnsubscribeToken = () => {
  return randomBytes(32).toString("hex");
};

export default defineEventHandler(async (event) => {
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
