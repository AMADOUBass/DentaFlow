/**
 * Dictionnaire de codes d'actes standards (ACDQ - Mockup pour démo)
 */
export const DENTAL_FEE_GUIDE = [
  {
    code: '01103',
    description: 'Examen complet de la dentition (adulte)',
    unitPrice: 10500, // 105.00$
    isTaxable: false
  },
  {
    code: '01202',
    description: 'Examen de rappel (nettoyage)',
    unitPrice: 6500, // 65.00$
    isTaxable: false
  },
  {
    code: '11111',
    description: 'Détartrage (1 unité de temps - 15 min)',
    unitPrice: 5800, // 58.00$
    isTaxable: false
  },
  {
    code: '11112',
    description: 'Polissage sélectif',
    unitPrice: 3500, // 35.00$
    isTaxable: false
  },
  {
    code: '21211',
    description: 'Restauration composite (1 surface - dent postérieure)',
    unitPrice: 14500, // 145.00$
    isTaxable: false
  },
  {
    code: '21212',
    description: 'Restauration composite (2 surfaces - dent postérieure)',
    unitPrice: 18500, // 185.00$
    isTaxable: false
  },
  {
    code: '90001',
    description: 'Blanchiment des dents (Electif)',
    unitPrice: 45000, // 450.00$
    isTaxable: true // Soumis à la TPS/TVQ
  }
]

export type DentalService = (typeof DENTAL_FEE_GUIDE)[0]
