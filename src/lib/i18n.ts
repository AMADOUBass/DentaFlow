/**
 * Simple i18n utility for Oros
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
      login: "Connexion",
      demo: "Essai Gratuit",
      start: "Démarrer maintenant",
      see_demo: "Voir la démo",
      soon: "Bientôt disponible",
    },
    nav: {
      features: "Fonctionnalités",
      solutions: "Solutions",
      pricing: "Tarifs",
      contact: "Contact",
    },
    home: {
      badge: "Plateforme n°1 au Québec",
      hero_title_part1: "Redéfinissez la gestion",
      hero_title_accent: "dentaire",
      hero_subtitle: "La plateforme multi-tenant nouvelle génération conçue pour l'efficacité, la conformité Loi 25 et une expérience patient d'exception.",
      stats_save_time: "Temps gagné",
      stats_per_week: "par semaine",
      stats_satisfaction: "Satisfaction Patients",
    },
    features: {
      title: "Tout ce dont vous avez besoin.",
      subtitle: "Une suite d'outils puissants intégrés pour propulser votre clinique.",
      items: {
        booking: {
          title: "Réservation IA",
          desc: "Calcul automatique des créneaux selon vos spécialités et praticiens."
        },
        law25: {
          title: "Conformité Loi 25",
          desc: "Chiffrement de bout en bout et hébergement sécurisé au Canada."
        },
        dashboard: {
          title: "Tableau de Bord Live",
          desc: "Suivez vos indicateurs de performance en temps réel."
        },
        pwa: {
          title: "Portail Patient PWA",
          desc: "Une expérience native sur mobile sans téléchargement requis."
        },
        emergency: {
          title: "Module d'Urgences",
          desc: "Gérez les cas critiques avec un tunnel de tri prioritaire."
        },
        practitioner: {
          title: "Suivi Praticien",
          desc: "Outils dédiés pour optimiser le temps des dentistes."
        }
      }
    },
    testimonials: {
      title: "Ils font confiance à Oros.",
      subtitle: "Découvrez pourquoi les professionnels du Québec ont choisi notre solution.",
      items: [
        {
          name: "Dr. Marc-Antoine Roy",
          role: "Chirurgien-dentiste",
          clinic: "Clinique Dentaire de la Gatineau",
          content: "Oros a simplifié toute notre gestion Loi 25. C'est un poids énorme en moins sur nos épaules."
        },
        {
          name: "Julie Tremblay",
          role: "Gestionnaire de centre",
          clinic: "Centre Dentaire Orizon",
          content: "L'interface est d'une fluidité incroyable. Nos secrétaires ont gagné 1h par jour sur la prise de RDV."
        },
        {
          name: "Dr. Sophie Lefebvre",
          role: "Orthodontiste",
          clinic: "Smile Design Montréal",
          content: "La prise de rendez-vous en ligne est la plus intelligente du marché. Mes patients l'adorent."
        }
      ]
    },
    contact_page: {
      title: "Contactez-nous",
      subtitle: "Notre équipe est là pour propulser votre clinique au prochain niveau.",
      form_name: "Nom complet",
      form_email: "Courriel professionnel",
      form_clinic: "Nom de la clinique",
      form_message: "Comment pouvons-nous vous aider ?",
      form_submit: "Envoyer le message",
      success_title: "Message reçu !",
      success_desc: "Nous vous recontacterons dans les prochaines 24 heures.",
      info_title: "Nos bureaux",
      info_address: "1230 Rue de la Montagne, Montréal, QC H3G 1Z1",
      info_phone: "+1 (514) 555-0199",
      info_support: "support@oros.ca"
    },
    solutions_page: {
      hero_title: "Une technologie au service de votre ",
      hero_accent: "vision clinique",
      hero_subtitle: "Découvrez comment Oros transforme chaque aspect de votre gestion quotidienne avec des outils conçus pour le futur de la dentisterie.",
      section_law25_title: "Conformité Loi 25 Sans Effort",
      section_law25_desc: "Oros intègre nativement toutes les exigences de la Loi 25. Chiffrement AES-256, logs d'audit exhaustifs et hébergement sécurisé au Canada. Vous n'avez plus à vous soucier des risques légaux.",
      section_booking_title: "Moteur de Réservation IA",
      section_booking_desc: "Notre futur moteur de prise de rendez-vous ne se contente pas de remplir des cases. Il optimisera l'agenda de chaque praticien en fonction de leurs spécialités et du temps réel requis par chaque type de soin (en cours de développement).",
      section_patient_title: "L'Expérience Patient Réinventée",
      section_patient_desc: "Offrez à vos patients un portail moderne et intuitif. Prise de RDV, demandes d'urgence et gestion de profil, le tout accessible sur mobile sans installation.",
    },
    pricing_page: {
      hero_title: "Un investissement dans votre ",
      hero_accent: "croissance",
      hero_subtitle: "Choisissez le plan qui correspond à la taille et aux ambitions de votre centre dentaire.",
      plans: {
        essentiel: {
          name: "Essentiel",
          price: "199",
          desc: "Idéal pour les nouvelles cliniques.",
          features: ["1 Praticien", "Agenda intelligent", "Loi 25 de base", "Portail Patient"]
        },
        complet: {
          name: "Complet",
          price: "349",
          desc: "Le choix préféré des cabinets établis.",
          features: ["Jusqu'à 5 Praticiens", "Module d'Urgences 24/7", "Loi 25 avancée (Audit)", "Support prioritaire"]
        },
        premium: {
          name: "Premium",
          price: "599",
          desc: "Pour les centres multi-spécialités.",
          features: ["Praticiens illimités", "Analytics avancés", "Domaine personnalisé", "Intégration API"]
        }
      }
    },
    trust: {
      title: "Prêt à transformer votre clinique ?",
      subtitle: "Rejoignez plus de 150 centres dentaires au Québec.",
      availability: "Disponibilité",
      appointments: "RDV Gérés",
      cta: "Demander un essai"
    },
    clinic: {
      clinic_label: "Clinique Dentaire",
      home: "Accueil",
      team: "Équipe",
      urgencies: "Urgences",
      need_help: "Besoin d'aide ?",
      privacy: "Politique de confidentialité",
      law25_officer: "Loi 25 - Responsable",
      powered_by: "Propulsé par",
    },
    login_page: {
      headline_part1: "La plateforme de gestion",
      headline_accent: "la plus intelligente",
      headline_part2: " au Québec.",
      feature_law25: "Protection des données Loi 25 intégrée",
      feature_ai: "Moteur de prise de rendez-vous IA",
      feature_ui: "Interface moderne et intuitive pour l'équipe",
      testimonial: "Oros a littéralement transformé notre façon de travailler. C'est l'outil que nous attendions.",
      secure_space: "Espace Sécurisé",
      portal_title: "Portail Direction",
      portal_desc: "Accédez à votre tableau de bord clinique.",
      email_label: "Courriel professionnel",
      password_label: "Mot de passe",
      forgot_password: "Oublié ?",
      submit: "Se connecter",
      submitting: "Authentification...",
      help_text: "Besoin d'aide pour accéder à votre plateforme ?",
      contact_support: "Contactez le support",
    },
    clinic_home: {
      badge: "Expertise de pointe",
      hero_title_part1: "Votre sourire mérite",
      hero_title_accent: "l'excellence.",
      hero_desc: "Nous combinons technologie moderne et soins personnalisés pour assurer votre santé bucco-dentaire au quotidien.",
      patients_count: "Déjà +2k Patients",
      team_title: "Une équipe à votre écoute",
      team_desc: "6 Praticiens spécialisés pour vous accompagner dans tous vos soins.",
      reviews: "Avis Google",
      location: "Notre Emplacement",
      hours: "Heures d'ouverture",
      emergency_support: "Urgences 24/7",
      emergency_desc: "Réponse sous 30 mins",
      cta_title_part1: "Prêt à prendre soin de",
      cta_title_accent: "votre santé dentaire",
      cta_title_part2: " ?",
      manage_emergency: "Gérer une urgence",
    },
    footer_ext: {
      product: "Produit",
      solutions: "Solutions",
      pricing: "Tarifs",
      demo: "Voir la démo",
      legal: "Légal",
      privacy: "Confidentialité (Loi 25)",
      terms: "Conditions d'utilisation",
      contact: "Contact",
      support: "Support technique",
    },
    footer: {
      copy: "© 2026 Oros. La technologie au service du sourire."
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
    },
    patient_login: {
      title: "Espace Patient",
      subtitle: "Connectez-vous pour gérer vos rendez-vous.",
      card_title: "Connexion sécurisée",
      card_desc: "Pas besoin de mot de passe. Saisissez votre courriel pour recevoir un lien de connexion.",
      email_label: "Adresse courriel",
      submit: "Envoyer le lien",
      success_title: "Vérifiez vos courriels !",
      success_desc: "Nous venons d'envoyer un lien de connexion magique à votre adresse. Cliquez sur le lien pour accéder à votre portail.",
      retry: "Renvoyer un lien",
      terms: "Conditions d'utilisation",
    },
    patient_portal: {
      upcoming: "Prochains rendez-vous",
      past: "Historique",
      none_upcoming: "Aucun rendez-vous prévu",
      none_past: "Aucun historique de soins",
      book_now: "Prendre RDV",
      actions: "Actions rapides",
      profile_cta: "Mon Profil",
      new_apt: "Nouveau RDV",
      my_clinic: "Ma Clinique",
      open_today: "Ouvert aujourd'hui",
      cancel_apt: "Annuler",
      cancel_confirm_title: "Annuler ce rendez-vous ?",
      cancel_confirm_desc: "Souhaitez-vous vraiment annuler votre rendez-vous ? Cette action est irréversible.",
      cancel_too_late: "Délai d'annulation en ligne dépassé (moins de 24h)",
      cancel_success: "Le rendez-vous a été annulé avec succès.",
      profile: {
        title: "Mon Profil",
        subtitle: "Gérez vos informations personnelles et vos préférences.",
        personal_info: "Informations Personnelles",
        personal_desc: "Vos coordonnées de base utilisées pour les rendez-vous.",
        firstname: "Prénom",
        lastname: "Nom",
        email_readonly: "Courriel (non modifiable)",
        phone: "Téléphone",
        address_insurance: "Adresse & Assurance",
        address_desc: "Informations pour la facturation et les envois.",
        address_label: "Adresse complète",
        insurance_label: "Numéro de police d'assurance",
        insurance_help: "Pour accélérer vos réclamations en clinique.",
        comm_prefs: "Préférences de communication",
        comm_desc: "Accepter de recevoir les rappels et confirmations par SMS.",
        sms_label: "Activer les rappels SMS",
        save: "Enregistrer les modifications",
        success: "Profil mis à jour avec succès",
        error: "Erreur lors de la mise à jour",
        data_protection: "Protection des données (Loi 25)",
        data_protection_desc: "Vos données sont hébergées de manière sécurisée au Canada. Vous disposez d'un droit d'accès, de rectification et d'effacement de vos informations personnelles en contactant la clinique.",
      },
      privacy: {
        title: "Loi 25 & Vie privée",
        desc: "Vous avez le contrôle total sur vos renseignements personnels. Utilisez les outils ci-dessous pour exercer vos droits.",
        export_btn: "Exporter mes données (JSON)",
        export_success: "Vos données ont été exportées avec succès (Loi 25)",
        delete_btn: "Droit à l'oubli",
        delete_confirm: "Êtes-vous certain de vouloir demander la suppression de votre compte ? Vos données identifiables seront anonymisées conformément à la loi.",
        delete_success: "Demande de suppression enregistrée. Vous allez être déconnecté.",
        encrypted_notice: "Vos données sont chiffrées (AES-256)",
        export_error: "Erreur lors de l'exportation",
        delete_error: "Erreur lors de la suppression",
      },
    },
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
      login: "Login",
      demo: "Free Trial",
      start: "Get Started",
      see_demo: "See Live Demo",
      soon: "Coming Soon",
    },
    nav: {
      features: "Features",
      solutions: "Solutions",
      pricing: "Pricing",
      contact: "Contact",
    },
    home: {
      badge: "#1 Platform in Quebec",
      hero_title_part1: "Redefine dental",
      hero_title_accent: "management",
      hero_subtitle: "The next-generation multi-tenant platform designed for efficiency, Law 25 compliance, and exceptional patient experience.",
      stats_save_time: "Time Saved",
      stats_per_week: "per week",
      stats_satisfaction: "Patient Satisfaction",
    },
    features: {
      title: "Everything you need.",
      subtitle: "A suite of powerful integrated tools to propel your clinic.",
      items: {
        booking: {
          title: "AI Booking Engine",
          desc: "Automatic time slot calculation based on specialties and practitioners."
        },
        law25: {
          title: "Law 25 Compliance",
          desc: "End-to-end encryption and secure hosting in Canada."
        },
        dashboard: {
          title: "Live Dashboard",
          desc: "Track your performance indicators in real-time."
        },
        pwa: {
          title: "Patient Portal PWA",
          desc: "A native mobile experience without required downloads."
        },
        emergency: {
          title: "Emergency Module",
          desc: "Manage critical cases with a priority sorting tunnel."
        },
        practitioner: {
          title: "Practitioner Tracking",
          desc: "Dedicated tools to optimize dentists' time."
        }
      }
    },
    testimonials: {
      title: "They trust Oros.",
      subtitle: "Discover why professionals in Quebec have chosen our solution.",
      items: [
        {
          name: "Dr. Marc-Antoine Roy",
          role: "Surgeon-dentist",
          clinic: "Gatineau Dental Clinic",
          content: "Oros has simplified all our Law 25 management. It's a huge weight off our shoulders."
        },
        {
          name: "Julie Tremblay",
          role: "Center Manager",
          clinic: "Orizon Dental Center",
          content: "The interface is incredibly fluid. Our secretaries have saved 1h per day on booking appointments."
        },
        {
          name: "Dr. Sophie Lefebvre",
          role: "Orthodontist",
          clinic: "Smile Design Montreal",
          content: "Online appointment booking is the smartest on the market. My patients love it."
        }
      ]
    },
    contact_page: {
      title: "Contact Us",
      subtitle: "Our team is here to propel your clinic to the next level.",
      form_name: "Full Name",
      form_email: "Professional Email",
      form_clinic: "Clinic Name",
      form_message: "How can we help you?",
      form_submit: "Send Message",
      success_title: "Message received!",
      success_desc: "We will get back to you within the next 24 hours.",
      info_title: "Our Offices",
      info_address: "1230 Rue de la Montagne, Montreal, QC H3G 1Z1",
      info_phone: "+1 (514) 555-0199",
      info_support: "support@oros.ca"
    },
    solutions_page: {
      hero_title: "Technology at the service of your ",
      hero_accent: "clinical vision",
      hero_subtitle: "Discover how Oros transforms every aspect of your daily management with tools designed for the future of dentistry.",
      section_law25_title: "Effortless Law 25 Compliance",
      section_law25_desc: "Oros natively integrates all Law 25 requirements. AES-256 encryption, exhaustive audit logs, and secure hosting in Canada. No more legal worries.",
      section_booking_title: "AI Booking Engine",
      section_booking_desc: "Our upcoming appointment engine does more than just fill slots. It will optimize each practitioner's schedule based on their specialties and the real-time required for each treatment (currently in development).",
      section_patient_title: "The Patient Experience Reimagined",
      section_patient_desc: "Offer your patients a modern and intuitive portal. Booking, emergency requests, and profile management, all accessible on mobile without installation.",
    },
    pricing_page: {
      hero_title: "An investment in your ",
      hero_accent: "growth",
      hero_subtitle: "Choose the plan that matches the size and ambitions of your dental center.",
      plans: {
        essentiel: {
          name: "Essential",
          price: "199",
          desc: "Ideal for new clinics.",
          features: ["1 Practitioner", "Smart agenda", "Basic Law 25", "Patient Portal"]
        },
        complet: {
          name: "Complete",
          price: "349",
          desc: "The preferred choice for established practices.",
          features: ["Up to 5 Practitioners", "24/7 Emergency Module", "Advanced Law 25 (Audit)", "Priority support"]
        },
        premium: {
          name: "Premium",
          price: "599",
          desc: "For multi-specialty centers.",
          features: ["Unlimited Practitioners", "Advanced Analytics", "Custom Domain", "API Integration"]
        }
      }
    },
    trust: {
      title: "Ready to transform your clinic?",
      subtitle: "Join over 150 dental centers in Quebec.",
      availability: "Availability",
      appointments: "Appointments Managed",
      cta: "Request a trial"
    },
    clinic: {
      clinic_label: "Dental Clinic",
      home: "Home",
      team: "Team",
      urgencies: "Emergencies",
      need_help: "Need help?",
      privacy: "Privacy Policy",
      law25_officer: "Law 25 - Officer",
      powered_by: "Powered by",
    },
    login_page: {
      headline_part1: "The",
      headline_accent: "smartest",
      headline_part2: " management platform in Quebec.",
      feature_law25: "Integrated Law 25 data protection",
      feature_ai: "AI appointment booking engine",
      feature_ui: "Modern and intuitive team interface",
      testimonial: "Oros has literally transformed the way we work. It's the tool we've been waiting for.",
      secure_space: "Secure Space",
      portal_title: "Management Portal",
      portal_desc: "Access your clinical dashboard.",
      email_label: "Professional email",
      password_label: "Password",
      forgot_password: "Forgot?",
      submit: "Login",
      submitting: "Authenticating...",
      help_text: "Need help accessing your platform?",
      contact_support: "Contact support",
    },
    clinic_home: {
      badge: "Cutting-edge expertise",
      hero_title_part1: "Your smile deserves",
      hero_title_accent: "excellence.",
      hero_desc: "We combine modern technology and personalized care to ensure your oral health every day.",
      patients_count: "Already +2k Patients",
      team_title: "A team at your service",
      team_desc: "6 Specialized practitioners to accompany you in all your care.",
      reviews: "Google Reviews",
      location: "Our Location",
      hours: "Opening Hours",
      emergency_support: "24/7 Emergencies",
      emergency_desc: "Response within 30 mins",
      cta_title_part1: "Ready to take care of",
      cta_title_accent: "your dental health",
      cta_title_part2: " ?",
      manage_emergency: "Manage an emergency",
    },
    footer_ext: {
      product: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      demo: "See demo",
      legal: "Legal",
      privacy: "Privacy (Law 25)",
      terms: "Terms of Use",
      contact: "Contact",
      support: "Technical Support",
    },
    footer: {
      copy: "© 2026 Oros. Technology at the service of your smile."
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
    },
    patient_login: {
      title: "Patient Space",
      subtitle: "Log in to manage your appointments.",
      card_title: "Secure connection",
      card_desc: "No password needed. Enter your email to receive a login link.",
      email_label: "Email address",
      submit: "Send link",
      success_title: "Check your emails!",
      success_desc: "We just sent a magic login link to your address. Click the link to access your portal.",
      retry: "Resend link",
      terms: "Terms of use",
    },
    patient_portal: {
      upcoming: "Upcoming appointments",
      past: "History",
      none_upcoming: "No appointments scheduled",
      none_past: "No care history",
      book_now: "Book Now",
      actions: "Quick Actions",
      profile_cta: "My Profile",
      new_apt: "New Appointment",
      my_clinic: "My Clinic",
      open_today: "Open today",
      cancel_apt: "Cancel",
      cancel_confirm_title: "Cancel this appointment?",
      cancel_confirm_desc: "Are you sure you want to cancel your appointment? This action is irreversible.",
      cancel_too_late: "Online cancellation deadline passed (less than 24h)",
      cancel_success: "The appointment has been successfully cancelled.",
      profile: {
        title: "My Profile",
        subtitle: "Manage your personal information and preferences.",
        personal_info: "Personal Information",
        personal_desc: "Your basic contact details used for appointments.",
        firstname: "First Name",
        lastname: "Last Name",
        email_readonly: "Email (read-only)",
        phone: "Phone",
        address_insurance: "Address & Insurance",
        address_desc: "Information for billing and shipping.",
        address_label: "Full Address",
        insurance_label: "Insurance Policy Number",
        insurance_help: "To speed up your claims in clinic.",
        comm_prefs: "Communication Preferences",
        comm_desc: "Agree to receive reminders and confirmations by SMS.",
        sms_label: "Enable SMS reminders",
        save: "Save Changes",
        success: "Profile updated successfully",
        error: "Error during update",
        data_protection: "Data Protection (Law 25)",
        data_protection_desc: "Your data is securely hosted in Canada. You have the right to access, rectify, and erase your personal information by contacting the clinic.",
      },
      privacy: {
        title: "Law 25 & Privacy",
        desc: "You have full control over your personal information. Use the tools below to exercise your rights.",
        export_btn: "Export my data (JSON)",
        export_success: "Your data has been successfully exported (Law 25)",
        delete_btn: "Right to be forgotten",
        delete_confirm: "Are you sure you want to request the deletion of your account? Your identifiable data will be anonymized in accordance with the law.",
        delete_success: "Deletion request registered. You will be logged out.",
        encrypted_notice: "Your data is encrypted (AES-256)",
        export_error: "Error during export",
        delete_error: "Error during deletion",
      },
    },
  },
}

export function getTranslations(locale: Locale = 'fr') {
  return translations[locale] || translations.fr
}

/**
 * Devrait être appelé uniquement dans les Server Components
 */
export async function getLocaleServer() {
  const { headers } = require('next/headers')
  const headerList = await headers()
  return (headerList.get('x-locale') as Locale) || 'fr'
}

/**
 * Hook-like function for server components
 */
export function useTranslations(locale: Locale = 'fr') {
  return getTranslations(locale)
}
