import { Resend } from "resend";
import { generateEmailTemplate } from "./emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    const htmlContent = generateEmailTemplate({
      content,
      name: subscriber.name,
      unsubscribeToken: subscriber.unsubscribeToken,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email simulé :");
      console.log("À:", to);
      console.log("Sujet:", subject);
      console.log("Contenu HTML:", htmlContent);
      console.log("------------------------");
      return { id: "local-" + Date.now() };
    }

    const data = await resend.emails.send({
      from: "CodeMastery <newsletter@codemastery.dev>",
      to,
      subject,
      html: htmlContent,
    });
    return data;
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }
};
