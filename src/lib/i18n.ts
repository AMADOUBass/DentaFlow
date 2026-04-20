/**
 * Simple i18n utility for DentaFlow
 */

export type Locale = 'fr' | 'en'

const translations = {
  fr: {
    common: {
      book: "Prendre rendez-vous",
      emergency: "Urgence",
      services: "Services",
      team: "Notre équipe",
      contact: "Contact",
      confirm: "Confirmer",
      cancel: "Annuler",
    },
    home: {
      hero_title: "Votre santé dentaire, notre priorité",
      hero_subtitle: "Des soins de qualité pour toute la famille.",
    },
    emergencies: {
      title: "Urgence dentaire ?",
      subtitle: "Nous sommes là pour vous aider rapidement.",
      form_firstName: "Prénom",
      form_lastName: "Nom",
      form_phone: "Téléphone",
      form_email: "Courriel",
      form_painLevel: "Niveau de douleur (1-10)",
      form_description: "Décrivez votre problème",
      form_submit: "Envoyer la demande",
      success_title: "Demande envoyée",
      success_desc: "Une personne de notre équipe vous contactera sous peu.",
    }
  },
  en: {
    common: {
      book: "Book Appointment",
      emergency: "Emergency",
      services: "Services",
      team: "Our Team",
      contact: "Contact",
      confirm: "Confirm",
      cancel: "Cancel",
    },
    home: {
      hero_title: "Your dental health, our priority",
      hero_subtitle: "Quality care for the whole family.",
    },
    emergencies: {
      title: "Dental Emergency?",
      subtitle: "We are here to help you quickly.",
      form_firstName: "First Name",
      form_lastName: "Last Name",
      form_phone: "Phone",
      form_email: "Email",
      form_painLevel: "Pain Level (1-10)",
      form_description: "Describe your problem",
      form_submit: "Submit Request",
      success_title: "Request Sent",
      success_desc: "A member of our team will contact you shortly.",
    }
  }
}

export function getTranslations(locale: Locale = 'fr') {
  return translations[locale] || translations.fr
}

/**
 * Hook-like function for server components
 */
export function useTranslations(locale: Locale = 'fr') {
  return getTranslations(locale)
}
