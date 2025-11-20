/**
 * Constantes pour les statuts des commandes fournisseur
 */

export const COMMANDE_STATUTS = {
  BROUILLON: 'BROUILLON',
  PASSEE: 'PASSEE',
  PARTIELLE: 'PARTIELLE',
  LIVREE: 'LIVREE',
  VALIDEE: 'VALIDEE',
  ANNULEE: 'ANNULEE',
};

export const STATUT_LABELS = {
  BROUILLON: 'Brouillon',
  PASSEE: 'Passée',
  PARTIELLE: 'Partiellement livrée',
  LIVREE: 'Livrée',
  VALIDEE: 'Validée',
  ANNULEE: 'Annulée',
};

export const STATUT_COLORS = {
  BROUILLON: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  PASSEE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PARTIELLE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  LIVREE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  VALIDEE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  ANNULEE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const STATUT_ICONS = {
  BROUILLON: 'ph:file-text',
  PASSEE: 'ph:paper-plane',
  PARTIELLE: 'ph:truck',
  LIVREE: 'ph:check-circle',
  VALIDEE: 'ph:seal-check',
  ANNULEE: 'ph:x-circle',
};

/**
 * Transitions de statut possibles
 * Définit quels statuts peuvent être atteints depuis chaque statut
 */
export const STATUT_TRANSITIONS = {
  BROUILLON: ['PASSEE', 'ANNULEE'],
  PASSEE: ['PARTIELLE', 'LIVREE', 'ANNULEE'],
  PARTIELLE: ['LIVREE', 'ANNULEE'],
  LIVREE: ['VALIDEE', 'ANNULEE'],
  VALIDEE: ['ANNULEE'],
  ANNULEE: [],
};

/**
 * Vérifie si une transition de statut est valide
 * @param {string} currentStatus - Statut actuel
 * @param {string} newStatus - Nouveau statut
 * @returns {boolean} True si la transition est valide
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = STATUT_TRANSITIONS[currentStatus] || [];
  return validTransitions.includes(newStatus);
};

/**
 * Obtient le label d'un statut
 * @param {string} statut - Le statut
 * @returns {string} Le label du statut
 */
export const getStatutLabel = (statut) => {
  return STATUT_LABELS[statut] || statut;
};

/**
 * Obtient la couleur d'un statut
 * @param {string} statut - Le statut
 * @returns {string} Les classes Tailwind pour la couleur
 */
export const getStatutColor = (statut) => {
  return STATUT_COLORS[statut] || STATUT_COLORS.BROUILLON;
};

/**
 * Obtient l'icône d'un statut
 * @param {string} statut - Le statut
 * @returns {string} L'icône Iconify
 */
export const getStatutIcon = (statut) => {
  return STATUT_ICONS[statut] || STATUT_ICONS.BROUILLON;
};

/**
 * Obtient les transitions possibles depuis un statut
 * @param {string} statut - Le statut
 * @returns {array} Tableau des statuts possibles
 */
export const getAvailableTransitions = (statut) => {
  return STATUT_TRANSITIONS[statut] || [];
};

