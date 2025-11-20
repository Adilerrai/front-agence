export const FormatCarrelage = {
  // Add your format values here
  // Example: F30X30: 'F30X30', F60X60: 'F60X60', etc.
};

export const TypeCarrelage = {
  // Add your type values here
};

export const QualiteCarrelage = {
  PREMIER_CHOIX: 'PREMIER_CHOIX',
  DEUXIEME_CHOIX: 'DEUXIEME_CHOIX',
  TROISIEME_CHOIX: 'TROISIEME_CHOIX'
};

export const UniteMesure = {
  CM2: 'CM2',
  M2: 'M2'
};

/**
 * @typedef {Object} ProduitDTO
 * @property {number} id
 * @property {string} libelle
 * @property {string} description
 * @property {string} reference
 * @property {string} format - FormatCarrelage enum value
 * @property {string} marque
 * @property {number} epaisseurMm
 * @property {string} typeCarrelage - TypeCarrelage enum value
 * @property {string} qualite - QualiteCarrelage enum value
 * @property {string} uniteMesure - UniteMesure enum value
 * @property {number} piecesParBoite
 * @property {number} prixAchat
 * @property {number} prixVenteHT
 * @property {number} tauxTVA
 * @property {number} prixVenteTTC
 * @property {string} dateCreation - ISO date string
 * @property {string} dateModification - ISO date string
 */

/**
 * @typedef {Object} ProduitCriteria
 * @property {string} reference
 * @property {string} libelle
 * @property {number} codeSite
 * @property {string} format - FormatCarrelage enum value
 * @property {string} qualite - QualiteCarrelage enum value
 */