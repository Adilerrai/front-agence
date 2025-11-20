import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des livraisons
 */
export const livraisonService = {
  /**
   * Récupère toutes les livraisons
   * @returns {Promise<Array>} Liste des livraisons
   */
  async getAllLivraisons() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/all`, {
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
      console.error('Erreur lors de la récupération des livraisons:', error);
      throw error;
    }
  },

  /**
   * Récupère une livraison avec ses détails
   * @param {number} id - ID de la livraison
   * @returns {Promise<Object>} Détails de la livraison
   */
  async getLivraisonWithDetails(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/${id}/details`, {
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
      console.error('Erreur lors de la récupération de la livraison:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle livraison
   * @param {Object} livraisonData - Données de la livraison
   * @returns {Promise<Object>} Livraison créée
   */
  async createLivraison(livraisonData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livraisonData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la livraison:', error);
      throw error;
    }
  },

  /**
   * Met à jour une livraison
   * @param {Object} livraisonData - Données de la livraison
   * @returns {Promise<Object>} Livraison mise à jour
   */
  async updateLivraison(livraisonData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(livraisonData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la livraison:', error);
      throw error;
    }
  },

  /**
   * Valide une livraison
   * @param {number} id - ID de la livraison
   * @returns {Promise<Object>} Livraison validée
   */
  async validerLivraison(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/${id}/valider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la validation de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la validation de la livraison:', error);
      throw error;
    }
  },

  /**
   * Annule une livraison
   * @param {number} id - ID de la livraison
   * @returns {Promise<Object>} Livraison annulée
   */
  async annulerLivraison(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/${id}/annuler`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'annulation de la livraison');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la livraison:', error);
      throw error;
    }
  },

  /**
   * Supprime une livraison
   * @param {number} id - ID de la livraison
   * @returns {Promise<void>}
   */
  async deleteLivraison(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/livraisons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la livraison:', error);
      throw error;
    }
  },
};

export default livraisonService;
