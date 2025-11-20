import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des produits
 * Endpoints: POST /api/v1/produit/create
 *            PUT /api/v1/produit/update/{id}
 *            GET /api/v1/produit/get/{id}
 *            GET /api/v1/produit/all
 *            DELETE /api/v1/produit/{id}
 *            POST /api/v1/produit/search
 *            POST /api/v1/produit/search/all
 */
export const produitService = {
  /**
   * Récupère tous les produits
   * GET /api/v1/produit/all
   * @returns {Promise<Array>} Liste de tous les produits
   */
  

  /**
   * Récupère un produit par son ID
   * GET /api/v1/produit/get/{id}
   * @param {number} id - ID du produit
   * @returns {Promise<Object>} Détails du produit
   */
  async getProduitById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/produit/get/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau produit
   * POST /api/v1/produit/create
   * Envoie SEULEMENT les champs du ProduitDTO
   * @param {Object} produitData - Données du produit
   * @returns {Promise<Object>} Produit créé
   */
  async createProduit(produitData) {
    try {
      const token = authService.getAccessToken();

      // Champs valides du ProduitDTO
      const validFields = [
        'id', 'libelle', 'description', 'reference', 'format', 'marque',
        'epaisseurMm', 'typeCarrelage', 'uniteMesure', 'piecesParBoite',
        'prixAchat', 'prixVenteHT', 'tauxTVA', 'prixVenteTTC',
        'fournisseurId', 'fournisseurRaisonSociale',
        'dateCreation', 'dateModification'
      ];

      // Filtrer et nettoyer les données - garder SEULEMENT les champs valides
      const cleanedData = {};
      validFields.forEach(field => {
        const value = produitData[field];

        // Ignorer les champs undefined
        if (value === undefined) {
          return;
        }

        // Convertir les nombres en nombres (pas de chaînes)
        if (['prixAchat', 'prixVenteHT', 'tauxTVA', 'prixVenteTTC', 'epaisseurMm', 'piecesParBoite', 'fournisseurId', 'id'].includes(field)) {
          if (value !== null) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              cleanedData[field] = numValue;
            }
          } else {
            cleanedData[field] = null;
          }
        } else {
          // Pour les chaînes, envoyer null ou la valeur
          cleanedData[field] = value;
        }
      });

      console.log('Données nettoyées envoyées au backend (ProduitDTO):', cleanedData);

      const response = await fetch(`${API_BASE_URL}/api/v1/produit/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création du produit';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        console.error('Réponse d\'erreur du serveur:', errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  },

  /**
   * Met à jour un produit
   * PUT /api/v1/produit/update/{id}
   * Envoie SEULEMENT les champs du ProduitDTO
   * @param {number} id - ID du produit
   * @param {Object} produitData - Données du produit
   * @returns {Promise<Object>} Produit mis à jour
   */
  async updateProduit(id, produitData) {
    try {
      const token = authService.getAccessToken();

      // Champs valides du ProduitDTO
      const validFields = [
        'id', 'libelle', 'description', 'reference', 'format', 'marque',
        'epaisseurMm', 'typeCarrelage', 'uniteMesure', 'piecesParBoite',
        'prixAchat', 'prixVenteHT', 'tauxTVA', 'prixVenteTTC',
        'fournisseurId', 'fournisseurRaisonSociale',
        'dateCreation', 'dateModification'
      ];

      // Filtrer et nettoyer les données - garder SEULEMENT les champs valides
      const cleanedData = {};
      validFields.forEach(field => {
        const value = produitData[field];

        // Ignorer les champs undefined
        if (value === undefined) {
          return;
        }

        // Convertir les nombres en nombres (pas de chaînes)
        if (['prixAchat', 'prixVenteHT', 'tauxTVA', 'prixVenteTTC', 'epaisseurMm', 'piecesParBoite', 'fournisseurId', 'id'].includes(field)) {
          if (value !== null) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              cleanedData[field] = numValue;
            }
          } else {
            cleanedData[field] = null;
          }
        } else {
          // Pour les chaînes, envoyer null ou la valeur
          cleanedData[field] = value;
        }
      });

      console.log('Données nettoyées envoyées au backend (ProduitDTO):', cleanedData);

      const response = await fetch(`${API_BASE_URL}/api/v1/produit/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour du produit';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        console.error('Réponse d\'erreur du serveur:', errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  },

  /**
   * Supprime un produit
   * DELETE /api/v1/produit/{id}
   * @param {number} id - ID du produit
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteProduit(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/produit/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  },

  /**
   * Recherche des produits selon des critères (avec pagination)
   * POST /api/v1/produit/search
   * @param {Object} criteria - Critères de recherche
   * @param {number} page - Numéro de page
   * @param {number} size - Nombre d'éléments par page
   * @param {string} sort - Tri
   * @returns {Promise<Array>} Liste des produits
   */
  async searchProduits(criteria = {}, page = 0, size = 50, sort = 'libelle,asc') {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      // Nettoyer les critères en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/produit/search?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedCriteria),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
      console.error('Erreur lors de la recherche des produits:', error);
      throw error;
    }
  },

  /**
   * Recherche des produits selon des critères (sans pagination)
   * POST /api/v1/produit/search/all
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<Array>} Liste complète des produits
   */
  async searchProduitsNotPaged(criteria = {}) {
    try {
      const token = authService.getAccessToken();

      // Nettoyer les critères en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/produit/search/all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedCriteria),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la recherche des produits (non paginée):', error);
      throw error;
    }
  },
};