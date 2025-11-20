// Types et interfaces pour le système de gestion des stocks avec qualité

/**
 * Enum pour les qualités de produits (correspondant exactement à l'enum Java)
 */
export const QualiteProduit = {
  PREMIERE_QUALITE: "PREMIERE_QUALITE",
  DEUXIEME_QUALITE: "DEUXIEME_QUALITE",
  TROISIEME_QUALITE: "TROISIEME_QUALITE"
};

/**
 * Interface pour ProduitImageDTO (correspondant au DTO Java)
 */
export const createProduitImageDTO = (data = {}) => ({
  id: data.id || null,
  base64Data: data.base64Data || null,
  imageData: data.imageData || null,
  contentType: data.contentType || null,
  fileName: data.fileName || null,
  ...data
});

/**
 * Interface pour GroupeArticle (correspondant au modèle Java)
 */
export const createGroupeArticle = (data = {}) => ({
  id: data.id || null,
  nom: data.nom || "",
  description: data.description || "",
  ...data
});

/**
 * Interface pour ProduitDTO (correspondant exactement au DTO Java mis à jour)
 */
export const createProduitDTO = (data = {}) => ({
  id: data.id || null,
  reference: data.reference || "",
  designation: data.designation || "",
  description: data.description || "",
  uniteMesureStock: data.uniteMesureStock || "PIECE",
  prixAchat: data.prixAchat || null,
  prixVente: data.prixVente || null,
  pointDeVenteId: data.pointDeVenteId || null,
  image: data.image ? createProduitImageDTO(data.image) : null,
  actif: data.actif !== undefined ? data.actif : true,
  groupeArticle: data.groupeArticle ? createGroupeArticle(data.groupeArticle) : null,
  // Caractéristiques techniques
  longueurCm: data.longueurCm || null,
  largeurCm: data.largeurCm || null,
  epaisseurMm: data.epaisseurMm || null,
  format: data.format || null,
  ...data
});

/**
 * Interface pour StockQualiteDTO
 */
export const createStockQualiteDTO = (data = {}) => ({
  id: data.id || null,
  qualite: data.qualite || QualiteProduit.PREMIERE_QUALITE,
  quantiteDisponible: data.quantiteDisponible || 0,
  quantiteReservee: data.quantiteReservee || 0,
  seuilAlerte: data.seuilAlerte || null,
  derniereMaj: data.derniereMaj || new Date().toISOString(),
  produitId: data.produitId || null,
  produitDescription: data.produitDescription || "",
  depotId: data.depotId || null,
  depotNom: data.depotNom || "",
  ...data
});

/**
 * Interface pour StockDTO
 */
export const createStockDTO = (data = {}) => ({
  id: data.id || null,
  produitId: data.produitId || null,
  produitDescription: data.produitDescription || "",
  depotId: data.depotId || null,
  depotNom: data.depotNom || "",
  stocksQualite: data.stocksQualite ? 
    data.stocksQualite.map(sq => createStockQualiteDTO(sq)) : [],
  ...data
});

/**
 * Interface pour DepotDTO
 */
export const createDepotDTO = (data = {}) => ({
  id: data.id || null,
  nom: data.nom || "",
  description: data.description || "",
  adresse: data.adresse || "",
  pointDeVenteId: data.pointDeVenteId || null,
  actif: data.actif !== undefined ? data.actif : true,
  ...data
});

/**
 * Interface pour MouvementStockDTO
 */
export const createMouvementStockDTO = (data = {}) => ({
  id: data.id || null,
  type: data.type || "ENTREE",
  quantite: data.quantite || 0,
  qualite: data.qualite || QualiteProduit.PREMIERE_QUALITE,
  dateCreation: data.dateCreation || new Date().toISOString(),
  dateValidation: data.dateValidation || null,
  statut: data.statut || "EN_ATTENTE",
  commentaire: data.commentaire || "",
  produitId: data.produitId || null,
  produitDescription: data.produitDescription || "",
  depotSourceId: data.depotSourceId || null,
  depotSourceNom: data.depotSourceNom || "",
  depotDestinationId: data.depotDestinationId || null,
  depotDestinationNom: data.depotDestinationNom || "",
  utilisateurId: data.utilisateurId || null,
  utilisateurNom: data.utilisateurNom || "",
  ...data
});

/**
 * Utilitaires pour les calculs de stock
 */
export const stockCalculations = {
  /**
   * Calculer la quantité totale disponible pour un stock
   */
  getQuantiteTotaleDisponible: (stock) => {
    return stock.stocksQualite.reduce((total, sq) => total + (sq.quantiteDisponible || 0), 0);
  },

  /**
   * Calculer la quantité totale réservée pour un stock
   */
  getQuantiteTotaleReservee: (stock) => {
    return stock.stocksQualite.reduce((total, sq) => total + (sq.quantiteReservee || 0), 0);
  },

  /**
   * Obtenir le stock par qualité
   */
  getStockByQualite: (stock, qualite) => {
    return stock.stocksQualite.find(sq => sq.qualite === qualite) || null;
  },

  /**
   * Calculer la quantité totale (disponible + réservée) pour un stock qualité
   */
  getQuantiteTotale: (stockQualite) => {
    return (stockQualite.quantiteDisponible || 0) + (stockQualite.quantiteReservee || 0);
  },

  /**
   * Vérifier si un stock qualité est en alerte
   */
  isStockEnAlerte: (stockQualite) => {
    if (!stockQualite.seuilAlerte) return false;
    return (stockQualite.quantiteDisponible || 0) <= stockQualite.seuilAlerte;
  },

  /**
   * Obtenir le niveau d'alerte d'un stock qualité
   */
  getNiveauAlerte: (stockQualite) => {
    if (!stockQualite.seuilAlerte) return "BON";
    const quantite = stockQualite.quantiteDisponible || 0;
    const seuil = stockQualite.seuilAlerte;
    
    if (quantite <= 0) return "CRITIQUE";
    if (quantite <= seuil * 0.2) return "CRITIQUE";
    if (quantite <= seuil * 0.5) return "FAIBLE";
    if (quantite <= seuil) return "MOYEN";
    return "BON";
  },

  /**
   * Filtrer les stocks en alerte
   */
  getStocksEnAlerte: (stocks) => {
    const alertes = [];
    stocks.forEach(stock => {
      stock.stocksQualite.forEach(sq => {
        if (stockCalculations.isStockEnAlerte(sq)) {
          alertes.push({
            ...sq,
            stockId: stock.id,
            produitDescription: stock.produitDescription,
            depotNom: stock.depotNom,
            niveauAlerte: stockCalculations.getNiveauAlerte(sq)
          });
        }
      });
    });
    return alertes;
  }
};

/**
 * Validateurs pour les données de stock
 */
export const stockValidators = {
  /**
   * Valider une quantité
   */
  isValidQuantite: (quantite) => {
    return typeof quantite === 'number' && quantite >= 0 && quantite <= 999999.99;
  },

  /**
   * Valider un seuil d'alerte
   */
  isValidSeuilAlerte: (seuil) => {
    return seuil === null || (typeof seuil === 'number' && seuil >= 0 && seuil <= 99999.99);
  },

  /**
   * Valider une qualité de produit
   */
  isValidQualite: (qualite) => {
    return Object.values(QualiteProduit).includes(qualite);
  },

  /**
   * Valider un objet StockQualiteDTO
   */
  validateStockQualiteDTO: (stockQualite) => {
    const errors = [];
    
    if (!stockValidators.isValidQualite(stockQualite.qualite)) {
      errors.push("Qualité invalide");
    }
    
    if (!stockValidators.isValidQuantite(stockQualite.quantiteDisponible)) {
      errors.push("Quantité disponible invalide");
    }
    
    if (!stockValidators.isValidQuantite(stockQualite.quantiteReservee)) {
      errors.push("Quantité réservée invalide");
    }
    
    if (!stockValidators.isValidSeuilAlerte(stockQualite.seuilAlerte)) {
      errors.push("Seuil d'alerte invalide");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
