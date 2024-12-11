import { generateEmailTemplate } from "./emailTemplate";

export const sendEmail = async ({
  to,
  subject,
  content,
  subscriber,
}: {
  to: string;
  subject: string;
  content: string;
  subscriber: any;
}) => {
  const config = useRuntimeConfig();
  const apiKey = config.brevoApiKey;

  console.log("Tentative d'envoi d'email avec les paramètres:", {
    to,
    subject,
    apiKeyExists: !!apiKey,
  });

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY manquante dans les variables d'environnement"
    );
  }

  try {
    const htmlContent = await generateEmailTemplate({
      content,
      name: subscriber.name,
      unsubscribeToken: subscriber.unsubscribeToken,
      subscriberCount: subscriber.totalSubscribers || 0,
    });

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "CodeMastery", email: "newsletter@zonetactics.fr" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur réponse Brevo:", errorData);
      throw new Error(
        `Erreur Brevo: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Email envoyé avec succès:", data);
    return data;
  } catch (error) {
    console.error("Erreur détaillée envoi email:", error);
    throw error;
  }
};
