/**
 * DentaFlow Premium Email Templates
 * Responsive HTML with Inline CSS
 */

interface EmailTheme {
  primary: string
  name: string
  logo?: string | null
}

export function getAppointmentConfirmationHtml(data: {
  patientName: string
  serviceName: string
  practitionerName: string
  date: string
  time: string
  location: string
  theme: EmailTheme
}) {
  const { theme } = data
  const primaryColor = theme.primary || '#0F766E'

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de rendez-vous</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: ${primaryColor}; padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.025em;">DentaFlow</h1>
                  <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">${theme.name}</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 800; color: #0f172a;">Bonjour ${data.patientName},</h2>
                  <p style="font-size: 16px; line-height: 1.6; color: #475569;">
                    Votre rendez-vous pour <strong>${data.serviceName}</strong> a été confirmé avec succès. Nous avons hâte de vous recevoir.
                  </p>
                  
                  <!-- Appointment Box -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0; background-color: #f1f5f9; border-radius: 16px; padding: 24px;">
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <span style="font-size: 12px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Date et Heure</span>
                        <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">${data.date} à ${data.time}</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 16px;">
                        <span style="font-size: 12px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Praticien</span>
                        <div style="font-size: 16px; font-weight: 700; color: #334155; margin-top: 4px;">${data.practitionerName}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span style="font-size: 12px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Lieu</span>
                        <div style="font-size: 14px; font-weight: 600; color: #64748b; margin-top: 4px;">${data.location}</div>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Action Button -->
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="#" style="display: inline-block; background-color: ${primaryColor}; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 16px;">
                      Ajouter à mon calendrier
                    </a>
                  </div>
                  
                  <p style="margin-top: 40px; font-size: 14px; color: #94a3b8; text-align: center; font-style: italic;">
                    Si vous devez annuler ou déplacer ce rendez-vous, veuillez nous contacter au moins 24 heures à l'avance.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">
                    Propulsé par DentaFlow — Logiciel Clinique Québécois
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}
