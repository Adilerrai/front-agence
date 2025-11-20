// Statuts des commandes d'achat (correspondant à l'enum backend)
export const STATUT_COMMANDE_OPTIONS = [
  { value: "BROUILLON", label: "Brouillon", color: "bg-gray-100 text-gray-800" },
  { value: "EN_ATTENTE", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMEE", label: "Confirmée", color: "bg-blue-100 text-blue-800" },
  { value: "PASSEE", label: "Passée", color: "bg-blue-100 text-blue-800" },
  { value: "EN_COURS", label: "En cours", color: "bg-purple-100 text-purple-800" },
  { value: "LIVREE", label: "Livrée", color: "bg-green-100 text-green-800" },
  { value: "ANNULEE", label: "Annulée", color: "bg-red-100 text-red-800" },
  { value: "PARTIELLEMENT_LIVREE", label: "Partiellement livrée", color: "bg-orange-100 text-orange-800" },
  { value: "PARTIELLE", label: "Partiellement livrée", color: "bg-orange-100 text-orange-800" },
  { value: "VALIDEE", label: "Validée", color: "bg-emerald-100 text-emerald-800" },
];

// Fonction utilitaire pour obtenir le label d'un statut
export const getStatutLabel = (statut) => {
  const option = STATUT_COMMANDE_OPTIONS.find(opt => opt.value === statut);
  return option ? option.label : statut;
};

// Fonction utilitaire pour obtenir la couleur d'un statut
export const getStatutColor = (statut) => {
  const option = STATUT_COMMANDE_OPTIONS.find(opt => opt.value === statut);
  return option ? option.color : "bg-gray-100 text-gray-800";
};

// Types de lignes de commande
export const TYPE_LIGNE_COMMANDE = {
  PRODUIT: "PRODUIT",
  SERVICE: "SERVICE",
  FRAIS: "FRAIS",
};

// Priorités de commande
export const PRIORITE_COMMANDE = [
  { value: "BASSE", label: "Basse", color: "text-green-600" },
  { value: "NORMALE", label: "Normale", color: "text-blue-600" },
  { value: "HAUTE", label: "Haute", color: "text-orange-600" },
  { value: "URGENTE", label: "Urgente", color: "text-red-600" },
];

// Modes de livraison
export const MODE_LIVRAISON = [
  { value: "STANDARD", label: "Standard" },
  { value: "EXPRESS", label: "Express" },
  { value: "RETRAIT", label: "Retrait sur site" },
  { value: "LIVRAISON_DIRECTE", label: "Livraison directe" },
];

// Conditions de paiement
export const CONDITIONS_PAIEMENT = [
  { value: "COMPTANT", label: "Comptant" },
  { value: "30_JOURS", label: "30 jours" },
  { value: "60_JOURS", label: "60 jours" },
  { value: "90_JOURS", label: "90 jours" },
  { value: "PERSONNALISE", label: "Personnalisé" },
];

// Fonction pour formater les montants en dirhams marocains
export const formatMontant = (montant) => {
  if (!montant) return "0,00 DH";
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(montant) + ' DH';
};

// Fonction pour formater les dates
export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString('fr-FR');
};

// Fonction pour formater les dates avec heure
export const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString('fr-FR');
};

// Validation des numéros de commande
export const generateNumeroCommande = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-6);
  
  return `CMD-${year}${month}${day}-${time}`;
};
