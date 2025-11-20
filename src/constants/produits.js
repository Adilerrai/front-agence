// Options pour les unités de mesure (correspondant à l'enum backend)
export const UNITE_MESURE_OPTIONS = [
  { value: "M2", label: "Mètre carré (m²)" },
  { value: "PIECE", label: "Pièce" },
  { value: "KG", label: "Kilogramme" },
  { value: "LITRE", label: "Litre" },
  { value: "METRE", label: "Mètre" },
];

// Fonction utilitaire pour obtenir le label d'une unité de mesure
export const getUniteMesureLabel = (uniteMesure) => {
  const option = UNITE_MESURE_OPTIONS.find(opt => opt.value === uniteMesure);
  return option ? option.label : uniteMesure;
};

// Options pour les groupes d'articles
export const GROUPE_ARTICLE_OPTIONS = [
  { value: "PRODUIT_FINI", label: "Produit fini" },
  { value: "MATIERE_PREMIERE", label: "Matière première" },
  { value: "PRODUIT_SEMI_FINI", label: "Produit semi-fini" },
  { value: "CONSOMMABLE", label: "Consommable" },
  { value: "FOURNITURE", label: "Fourniture" },
  { value: "SERVICE", label: "Service" },
  { value: "EMBALLAGE", label: "Emballage" },
  { value: "OUTILLAGE", label: "Outillage" },
];

// Types d'articles prédéfinis
export const TYPE_ARTICLE_OPTIONS = [
  "Alimentaire",
  "Électronique",
  "Vêtement",
  "Mobilier",
  "Automobile",
  "Cosmétique",
  "Livre",
  "Jouet",
  "Sport",
  "Jardin",
  "Bricolage",
  "Informatique",
  "Téléphonie",
  "Électroménager",
  "Décoration",
  "Santé",
  "Beauté",
  "Bijouterie",
  "Maroquinerie",
  "Chaussure",
];

// Options pour le format de carrelage
export const FORMAT_CARRELAGE_OPTIONS = [
  { value: 'FORMAT_20x20', label: '20x20' },
  { value: 'FORMAT_30x30', label: '30x30' },
  { value: 'FORMAT_45x45', label: '45x45' },
  { value: 'FORMAT_60x60', label: '60x60' },
  { value: 'FORMAT_80x80', label: '80x80' },
  { value: 'FORMAT_100x100', label: '100x100' }
];

// Options pour la qualité de carrelage
export const QUALITE_CARRELAGE_OPTIONS = [
  { value: 'PREMIER_CHOIX', label: '1er Choix' },
  { value: 'DEUXIEME_CHOIX', label: '2ème Choix' },
  { value: 'TROISIEME_CHOIX', label: '3ème Choix' }
];

// Options pour le type de carrelage
export const TYPE_CARRELAGE_OPTIONS = [
  { value: 'SOL', label: 'Sol' },
  { value: 'MURAL', label: 'Mural' },
  { value: 'EXTERIEUR', label: 'Extérieur' },
  { value: 'DECORATIF', label: 'Décoratif' }
];

// Constantes pour les types de produits
export const PRODUCT_TYPES = {
  CARRELAGE: 'CARRELAGE',
  AUTRE: 'AUTRE'
};

// Statuts des produits
export const STATUT_PRODUIT = {
  ACHETE: "Acheté",
  VENDU: "Vendu",
  STOCKE: "Stocké",
  GERE_PAR_LOT: "Géré par lot",
};

// Configuration pour l'upload d'images
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Ce champ est obligatoire",
  INVALID_PRICE: "Le prix doit être un nombre positif",
  INVALID_IMAGE: "Format d'image non supporté",
  IMAGE_TOO_LARGE: "L'image est trop volumineuse",
  NETWORK_ERROR: "Erreur de connexion au serveur",
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite",
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: "Produit créé avec succès",
  PRODUCT_UPDATED: "Produit modifié avec succès",
  PRODUCT_DELETED: "Produit supprimé avec succès",
};

// Configuration de pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// Options pour les qualités de produits (correspondant exactement à l'enum QualiteProduit Java)
export const QUALITE_PRODUIT_OPTIONS = [
  { value: "PREMIERE_QUALITE", label: "Première qualité", color: "bg-green-100 text-green-800" },
  { value: "DEUXIEME_QUALITE", label: "Deuxième qualité", color: "bg-yellow-100 text-yellow-800" },
  { value: "TROISIEME_QUALITE", label: "Troisième qualité", color: "bg-orange-100 text-orange-800" },
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
