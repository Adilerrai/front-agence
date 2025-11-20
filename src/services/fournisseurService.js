import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des fournisseurs
 * Endpoints: POST /api/v1/fournisseur/create
 *            PUT /api/v1/fournisseur/update/{id}
 *            GET /api/v1/fournisseur/get/{id}
 *            GET /api/v1/fournisseur/all
 *            GET /api/v1/fournisseur/actifs
 *            PUT /api/v1/fournisseur/desactiver/{id}
 *            PUT /api/v1/fournisseur/reactiver/{id}
 *            POST /api/v1/fournisseur/search
 *            POST /api/v1/fournisseur/search/all
 */
export const fournisseurService = {
  /**
   * Récupère tous les fournisseurs
   * GET /api/v1/fournisseur/all
   * @returns {Promise<Array>} Liste de tous les fournisseurs
   */
  async getAllFournisseurs() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      throw error;
    }
  },

  /**
   * Récupère les fournisseurs actifs
   * GET /api/v1/fournisseur/actifs
   * @returns {Promise<Array>} Liste des fournisseurs actifs
   */
  async getActiveFournisseurs() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/actifs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs actifs:', error);
      throw error;
    }
  },

  /**
   * Récupère un fournisseur par son ID
   * GET /api/v1/fournisseur/get/{id}
   * @param {number} id - ID du fournisseur
   * @returns {Promise<Object>} Détails du fournisseur
   */
  async getFournisseurById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/get/${id}`, {
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
      console.error('Erreur lors de la récupération du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau fournisseur
   * POST /api/v1/fournisseur/create
   * @param {Object} fournisseurData - Données du fournisseur
   * @returns {Promise<Object>} Fournisseur créé
   */
  async createFournisseur(fournisseurData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fournisseurData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du fournisseur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Met à jour un fournisseur
   * PUT /api/v1/fournisseur/update/{id}
   * @param {number} id - ID du fournisseur
   * @param {Object} fournisseurData - Données du fournisseur
   * @returns {Promise<Object>} Fournisseur mis à jour
   */
  async updateFournisseur(id, fournisseurData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fournisseurData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du fournisseur');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Supprime un fournisseur
   * DELETE /api/v1/fournisseur/{id}
   * @param {number} id - ID du fournisseur
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteFournisseur(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/${id}`, {
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
      console.error('Erreur lors de la suppression du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Désactive un fournisseur
   * PUT /api/v1/fournisseur/desactiver/{id}
   * @param {number} id - ID du fournisseur
   * @returns {Promise<boolean>} Succès de la désactivation
   */
  async desactiverFournisseur(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/desactiver/${id}`, {
        method: 'PUT',
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
      console.error('Erreur lors de la désactivation du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Réactive un fournisseur
   * PUT /api/v1/fournisseur/reactiver/{id}
   * @param {number} id - ID du fournisseur
   * @returns {Promise<boolean>} Succès de la réactivation
   */
  async reactiverFournisseur(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/reactiver/${id}`, {
        method: 'PUT',
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
      console.error('Erreur lors de la réactivation du fournisseur:', error);
      throw error;
    }
  },

  /**
   * Recherche des fournisseurs selon des critères (avec pagination)
   * POST /api/v1/fournisseur/search
   * @param {Object} criteria - Critères de recherche
   * @param {number} page - Numéro de page
   * @param {number} size - Nombre d'éléments par page
   * @param {string} sort - Tri (défaut: "raisonSociale,asc")
   * @returns {Promise<Array>} Liste des fournisseurs
   */
  async searchFournisseurs(criteria = {}, page = 0, size = 50, sort = 'raisonSociale,asc') {
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

      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/search?${params}`, {
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
      // Gérer la réponse paginée (Page<FournisseurDTO>)
      return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
      console.error('Erreur lors de la recherche des fournisseurs:', error);
      throw error;
    }
  },

  /**
   * Recherche des fournisseurs selon des critères (sans pagination)
   * POST /api/v1/fournisseur/search/all
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<Array>} Liste complète des fournisseurs
   */
  async searchFournisseursNotPaged(criteria = {}) {
    try {
      const token = authService.getAccessToken();

      // Nettoyer les critères en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/fournisseur/search/all`, {
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
      console.error('Erreur lors de la recherche des fournisseurs (non paginée):', error);
      throw error;
    }
  },
};

export default fournisseurService;

