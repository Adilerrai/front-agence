export const TypeCarrelage = {
  // Add your TypeCarrelage enum values here
};

export const Format = {
  // Add your Format enum values here
};

export const Qualite = {
  PREMIER_CHOIX: 'PREMIER_CHOIX',
  DEUXIEME_CHOIX: 'DEUXIEME_CHOIX',
  TROISIEME_CHOIX: 'TROISIEME_CHOIX',
};

export const UniteMesure = {
  CM2: 'CM2',
  M2: 'M2',
};

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  SYNDIC: 'SYNDIC',
  ASSISTANTE: 'ASSISTANTE',
};

/**
 * @typedef {Object} ProduitDTO
 * @property {number} id
 * @property {string} libelle
 * @property {string} description
 * @property {string} reference
 * @property {string} format
 * @property {string} marque
 * @property {number} epaisseurMm
 * @property {string} typeCarrelage
 * @property {string} qualite
 * @property {string} uniteMesure
 * @property {number} piecesParBoite
 * @property {number} prixAchat
 * @property {number} prixVenteHT
 * @property {number} tauxTVA
 * @property {number} prixVenteTTC
 * @property {string} dateCreation
 * @property {string} dateModification
 */

/**
 * @typedef {Object} ProduitCriteria
 * @property {string} reference
 * @property {string} libelle
 * @property {number} codeSite
 * @property {string} format
 * @property {string} qualite
 */

/**
 * @typedef {Object} NoeudSite
 * @property {number} id
 * @property {string} raisonSociale
 * @property {number} codeSite
 * @property {string} adresse
 * @property {string} ville
 * @property {string} telephone
 * @property {string} email
 * @property {Array<User>} utilisateurs
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email
 * @property {string} username
 * @property {string} password
 * @property {string} role
 * @property {string} telephone
 * @property {string} adresse
 * @property {Ville} ville
 * @property {NoeudSite} noeudSite
 */

/**
 * @typedef {Object} Ville
 * @property {number} id
 * @property {string} libelle
 * @property {Array<User>} users
 */

export const APP_TYPES = {
  LOCARIS_IMMO: 'LOCARIS_IMMO',
  LOCARIS_SYNDIC: 'LOCARIS_SYNDIC'
};

/**
 * @typedef {Object} AuthenticationResponse
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} phone - User phone number
 * @property {Array<string>} roles - User roles (e.g., ["ROLE_SUPER_ADMIN"])
 * @property {Array<string>} allowedAPP - List of applications the user has access to (e.g., ["LOCARIS_IMMO", "LOCARIS_SYNDIC"])
 * @property {string} access_token - JWT access token
 * @property {string} refresh_token - Refresh token for obtaining new access tokens
 * @property {string} token_type - Token type (e.g., "BEARER")
 */