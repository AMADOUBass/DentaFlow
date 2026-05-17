const _styles = {
  wrapper: `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;margin:0;padding:0;`,
  container: `max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;`,
  body: `padding:40px 48px;`,
  footer: `background:#f1f5f9;padding:24px 48px;text-align:center;`,
  label: `font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 4px;`,
  value: `font-size:16px;color:#0f172a;font-weight:700;margin:0 0 20px;`,
  divider: `border:none;border-top:1px solid #e2e8f0;margin:28px 0;`,
  btn: (color: string) =>
    `display:inline-block;background:${color};color:#ffffff;font-weight:800;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;`,
}

export interface AppointmentEmailData {
  patientFirstName: string
  clinicName: string
  clinicPhone: string
  clinicAddress?: string
  practitionerTitle: string
  practitionerLastName: string
  serviceName: string
  dateFormatted: string
  timeFormatted: string
  clinicColor?: string
  portalUrl?: string
}

export function emailConfirmation(data: AppointmentEmailData): string {
  const color = data.clinicColor ?? '#0f766e'
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${_styles.wrapper}">
  <div style="padding:32px 16px;">
    <div style="${_styles.container}">
      <div style="background:${color};padding:40px 48px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#fff;">${data.clinicName.charAt(0)}</div>
          <span style="color:rgba(255,255,255,0.85);font-size:14px;font-weight:700;">${data.clinicName}</span>
        </div>
        <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0;letter-spacing:-0.5px;">Rendez-vous confirmé ✓</h1>
        <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:15px;">Bonjour ${data.patientFirstName}, votre rendez-vous est bien enregistré.</p>
      </div>
      <div style="${_styles.body}">
        <div style="background:#f8fafc;border-radius:16px;padding:24px;margin-bottom:28px;">
          <p style="${_styles.label}">Soin</p>
          <p style="${_styles.value}">${data.serviceName}</p>
          <p style="${_styles.label}">Praticien</p>
          <p style="${_styles.value}">${data.practitionerTitle} ${data.practitionerLastName}</p>
          <p style="${_styles.label}">Date &amp; Heure</p>
          <p style="font-size:20px;color:#0f172a;font-weight:900;margin:0;">${data.dateFormatted} à ${data.timeFormatted}</p>
        </div>
        <hr style="${_styles.divider}">
        ${data.clinicAddress ? `<p style="${_styles.label}">Adresse</p><p style="${_styles.value}">${data.clinicAddress}</p>` : ''}
        <p style="${_styles.label}">Téléphone</p>
        <p style="${_styles.value}">${data.clinicPhone}</p>
        ${data.portalUrl ? `<div style="text-align:center;margin-top:32px;"><a href="${data.portalUrl}" style="${_styles.btn(color)}">Voir mes rendez-vous</a></div>` : ''}
      </div>
      <div style="${_styles.footer}">
        <p style="font-size:12px;color:#94a3b8;margin:0;">Envoyé automatiquement par <strong>Oros</strong> pour ${data.clinicName} · ${data.clinicPhone}</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function emailReminder24h(data: AppointmentEmailData): string {
  const color = data.clinicColor ?? '#0f766e'
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${_styles.wrapper}">
  <div style="padding:32px 16px;">
    <div style="${_styles.container}">
      <div style="background:#0f172a;padding:40px 48px;">
        <div style="margin-bottom:20px;"><span style="background:${color};color:#fff;font-size:11px;font-weight:800;padding:6px 14px;border-radius:6px;letter-spacing:1px;text-transform:uppercase;">Rappel · 24h</span></div>
        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0;letter-spacing:-0.5px;">Votre rendez-vous est demain</h1>
        <p style="color:#94a3b8;margin:8px 0 0;font-size:15px;">Bonjour ${data.patientFirstName}, un petit rappel.</p>
      </div>
      <div style="${_styles.body}">
        <div style="background:#f8fafc;border-radius:16px;padding:24px;margin-bottom:28px;border-left:4px solid ${color};">
          <p style="${_styles.label}">Clinique</p>
          <p style="${_styles.value}">${data.clinicName}</p>
          <p style="${_styles.label}">Soin · Praticien</p>
          <p style="${_styles.value}">${data.serviceName} — ${data.practitionerTitle} ${data.practitionerLastName}</p>
          <p style="${_styles.label}">Date &amp; Heure</p>
          <p style="font-size:20px;color:#0f172a;font-weight:900;margin:0;">${data.dateFormatted} à ${data.timeFormatted}</p>
        </div>
        ${data.clinicAddress ? `<p style="font-size:13px;color:#64748b;text-align:center;margin-bottom:16px;">📍 ${data.clinicAddress}</p>` : ''}
        ${data.portalUrl ? `<div style="text-align:center;margin-top:16px;"><a href="${data.portalUrl}" style="${_styles.btn(color)}">Gérer mon rendez-vous</a></div>` : ''}
      </div>
      <div style="${_styles.footer}">
        <p style="font-size:12px;color:#94a3b8;margin:0;">Oros pour ${data.clinicName} · ${data.clinicPhone}</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function emailCancellation(data: AppointmentEmailData & { reason?: string }): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${_styles.wrapper}">
  <div style="padding:32px 16px;">
    <div style="${_styles.container}">
      <div style="background:#ef4444;padding:40px 48px;">
        <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0;">Rendez-vous annulé</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:15px;">Bonjour ${data.patientFirstName}, votre rendez-vous a été annulé.</p>
      </div>
      <div style="${_styles.body}">
        <div style="background:#fef2f2;border-radius:16px;padding:24px;margin-bottom:28px;border:1px solid #fecaca;">
          <p style="${_styles.label}">Rendez-vous annulé</p>
          <p style="${_styles.value}">${data.serviceName} — ${data.dateFormatted} à ${data.timeFormatted}</p>
          ${data.reason ? `<p style="font-size:14px;color:#64748b;margin:4px 0 0;"><strong>Raison :</strong> ${data.reason}</p>` : ''}
        </div>
        <p style="font-size:15px;color:#475569;text-align:center;margin-bottom:28px;">Contactez-nous au <strong>${data.clinicPhone}</strong> pour prendre un nouveau rendez-vous.</p>
        ${data.portalUrl ? `<div style="text-align:center;"><a href="${data.portalUrl}" style="${_styles.btn('#0f766e')}">Prendre un nouveau rendez-vous</a></div>` : ''}
      </div>
      <div style="${_styles.footer}">
        <p style="font-size:12px;color:#94a3b8;margin:0;">Oros pour ${data.clinicName} · ${data.clinicPhone}</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

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
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.025em;">Oros</h1>
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
                    Propulsé par Oros — Logiciel Clinique Québécois
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
