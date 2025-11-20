// Constants pour la gestion des stocks avec qualité

// Options pour les qualités de produits (correspondant exactement à l'enum QualiteProduit Java)
export const QUALITE_PRODUIT_OPTIONS = [
  { value: "PREMIERE_QUALITE", label: "Première qualité", color: "bg-green-100 text-green-800", badgeColor: "success" },
  { value: "DEUXIEME_QUALITE", label: "Deuxième qualité", color: "bg-yellow-100 text-yellow-800", badgeColor: "warning" },
  { value: "TROISIEME_QUALITE", label: "Troisième qualité", color: "bg-orange-100 text-orange-800", badgeColor: "info" },
];

// Fonction utilitaire pour obtenir le label d'une qualité
export const getQualiteLabel = (qualite) => {
  const option = QUALITE_PRODUIT_OPTIONS.find(opt => opt.value === qualite);
  return option ? option.label : qualite;
};

// Fonction utilitaire pour obtenir la couleur d'une qualité
export const getQualiteColor = (qualite) => {
  const option = QUALITE_PRODUIT_OPTIONS.find(opt => opt.value === qualite);
  return option ? option.color : "bg-gray-100 text-gray-800";
};

// Fonction utilitaire pour obtenir la couleur de badge d'une qualité
export const getQualiteBadgeColor = (qualite) => {
  const option = QUALITE_PRODUIT_OPTIONS.find(opt => opt.value === qualite);
  return option ? option.badgeColor : "secondary";
};

// Types de mouvements de stock
export const TYPE_MOUVEMENT_STOCK = [
  { value: "ENTREE", label: "Entrée", icon: "ph:arrow-down", color: "text-green-600" },
  { value: "SORTIE", label: "Sortie", icon: "ph:arrow-up", color: "text-red-600" },
  { value: "TRANSFERT", label: "Transfert", icon: "ph:arrows-left-right", color: "text-blue-600" },
  { value: "AJUSTEMENT", label: "Ajustement", icon: "ph:gear", color: "text-orange-600" },
  { value: "INVENTAIRE", label: "Inventaire", icon: "ph:list-checks", color: "text-purple-600" },
];

// Statuts des mouvements de stock
export const STATUT_MOUVEMENT_STOCK = [
  { value: "EN_ATTENTE", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "VALIDE", label: "Validé", color: "bg-green-100 text-green-800" },
  { value: "ANNULE", label: "Annulé", color: "bg-red-100 text-red-800" },
];

// Niveaux d'alerte stock
export const NIVEAU_ALERTE_STOCK = {
  CRITIQUE: { seuil: 0, label: "Critique", color: "text-red-600", bgColor: "bg-red-100" },
  FAIBLE: { seuil: 0.2, label: "Faible", color: "text-orange-600", bgColor: "bg-orange-100" },
  MOYEN: { seuil: 0.5, label: "Moyen", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  BON: { seuil: 1, label: "Bon", color: "text-green-600", bgColor: "bg-green-100" },
};

// Fonction pour déterminer le niveau d'alerte
export const getNiveauAlerte = (quantiteDisponible, seuilAlerte) => {
  if (quantiteDisponible <= 0) return NIVEAU_ALERTE_STOCK.CRITIQUE;
  if (quantiteDisponible <= seuilAlerte * 0.2) return NIVEAU_ALERTE_STOCK.CRITIQUE;
  if (quantiteDisponible <= seuilAlerte * 0.5) return NIVEAU_ALERTE_STOCK.FAIBLE;
  if (quantiteDisponible <= seuilAlerte) return NIVEAU_ALERTE_STOCK.MOYEN;
  return NIVEAU_ALERTE_STOCK.BON;
};

// Configuration pour les tableaux de stock
export const STOCK_TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 15,
  PAGE_SIZE_OPTIONS: [10, 15, 25, 50],
  COLUMNS_VISIBILITY: {
    image: true,
    reference: true,
    description: true,
    depot: true,
    qualites: true,
    quantiteTotal: true,
    quantiteReservee: true,
    alertes: true,
    actions: true,
  },
};

// Messages pour les stocks
export const STOCK_MESSAGES = {
  SUCCESS: {
    STOCK_INITIALISE: "Stock initialisé avec succès",
    STOCK_AJOUTE: "Stock ajouté avec succès",
    STOCK_RETIRE: "Stock retiré avec succès",
    STOCK_TRANSFERE: "Stock transféré avec succès",
    QUALITE_AJOUTEE: "Qualité ajoutée au stock",
    QUALITE_MODIFIEE: "Qualité de stock modifiée",
  },
  ERROR: {
    STOCK_INSUFFISANT: "Stock insuffisant pour cette opération",
    QUALITE_INEXISTANTE: "Cette qualité n'existe pas pour ce produit",
    DEPOT_INEXISTANT: "Dépôt non trouvé",
    PRODUIT_INEXISTANT: "Produit non trouvé",
    QUANTITE_INVALIDE: "Quantité invalide",
    SEUIL_INVALIDE: "Seuil d'alerte invalide",
  },
  WARNING: {
    STOCK_FAIBLE: "Attention: Stock faible",
    SEUIL_ATTEINT: "Seuil d'alerte atteint",
    STOCK_CRITIQUE: "Stock critique",
  },
};

// Règles de validation pour les stocks
export const STOCK_VALIDATION_RULES = {
  QUANTITE_MIN: 0,
  QUANTITE_MAX: 999999.99,
  SEUIL_ALERTE_MIN: 0,
  SEUIL_ALERTE_MAX: 99999.99,
  DECIMAL_PLACES: 2,
};

// Configuration pour les graphiques de stock
export const STOCK_CHART_CONFIG = {
  COLORS: {
    PREMIERE_QUALITE: "#22c55e",      // green-500
    DEUXIEME_QUALITE: "#eab308",      // yellow-500
    TROISIEME_QUALITE: "#f97316",     // orange-500
  },
  CHART_HEIGHT: 300,
  ANIMATION_DURATION: 750,
};
