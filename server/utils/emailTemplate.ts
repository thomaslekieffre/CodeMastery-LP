import { marked } from "marked";

export const generateEmailTemplate = ({
  content,
  name,
  unsubscribeToken,
}: {
  content: string;
  name: string;
  unsubscribeToken: string;
}) => {
  // Convertir le Markdown en HTML
  const parsedContent = marked(content.replace("{{name}}", name), {
    gfm: true,
    breaks: true,
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CodeMastery Newsletter</title>
        <style>
          h1, h2, h3, h4, h5, h6 {
            color: #e2e8f0;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          h1 { font-size: 2em; }
          h2 { font-size: 1.5em; }
          h3 { font-size: 1.25em; }
          h4 { font-size: 1em; }
          h5 { font-size: 0.875em; }
          h6 { font-size: 0.85em; }
          
          strong { color: #e2e8f0; }
          em { color: #cbd5e1; }
          del { color: #94a3b8; }
          u { color: #e2e8f0; }
          
          blockquote {
            border-left: 4px solid #6d28d9;
            margin: 1em 0;
            padding: 0.5em 1em;
            background: rgba(109, 40, 217, 0.1);
            color: #94a3b8;
          }
          
          code {
            background: rgba(0, 0, 0, 0.2);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
          }
          
          pre {
            background: rgba(0, 0, 0, 0.2);
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
          }
        </style>
      </head>
      <body style="background-color: #0f172a; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 40px 20px; text-align: center; position: relative;">
            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #6d28d9, #9333ea); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(109, 40, 217, 0.4);">
              <span style="color: white; font-size: 32px; font-weight: bold; font-family: 'Arial', sans-serif;">CM</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">CodeMastery</h1>
            <p style="color: #94a3b8; margin-top: 10px; font-size: 16px;">Votre source d'apprentissage du développement web</p>
          </div>
          
          <div style="padding: 40px 30px; background: #1e293b;">
            <div style="color: #e2e8f0; font-size: 16px; line-height: 1.8;">
              ${parsedContent}
            </div>
          </div>
          
          <!-- Séparateur -->
          <div style="height: 2px; background: linear-gradient(90deg, #6d28d9, #9333ea);"></div>
          
          <!-- Pied de page -->
          <div style="background-color: #0f172a; padding: 30px 20px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <a href="https://twitter.com/CodeMastery" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Twitter</a>
              <a href="https://github.com/CodeMastery" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">GitHub</a>
              <a href="https://discord.gg/CodeMastery" style="color: #94a3b8; text-decoration: none; margin: 0 10px;">Discord</a>
            </div>
            <p style="color: #64748b; margin-bottom: 15px; font-size: 14px;">
              © ${new Date().getFullYear()} CodeMastery. Tous droits réservés.
            </p>
            <p style="color: #64748b; font-size: 12px; margin-bottom: 10px;">
              Vous recevez cet email car vous êtes inscrit à notre newsletter.
            </p>
            <a href="http://localhost:3000/unsubscribe?token=${unsubscribeToken}" 
               style="display: inline-block; color: #94a3b8; text-decoration: none; font-size: 12px; border: 1px solid #4c5563; border-radius: 6px; padding: 8px 20px; transition: all 0.3s ease;">
              Se désabonner
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
};
