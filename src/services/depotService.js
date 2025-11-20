import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des dépôts
 */
export const depotService = {
  /**
   * Récupère tous les dépôts
   * @returns {Promise<Array>} Liste des dépôts
   */
  async getAllDepots() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/depots/all`, {
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
      console.error('Erreur lors de la récupération des dépôts:', error);
      throw error;
    }
  },

  /**
   * Récupère un dépôt par son ID
   * @param {number} id - ID du dépôt
   * @returns {Promise<Object>} Détails du dépôt
   */
  async getDepotById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/depots/${id}`, {
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
      console.error('Erreur lors de la récupération du dépôt:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau dépôt
   * @param {Object} depotData - Données du dépôt
   * @returns {Promise<Object>} Dépôt créé
   */
  async createDepot(depotData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/depots/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depotData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du dépôt');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du dépôt:', error);
      throw error;
    }
  },

  /**
   * Met à jour un dépôt
   * @param {number} id - ID du dépôt
   * @param {Object} depotData - Données du dépôt
   * @returns {Promise<Object>} Dépôt mis à jour
   */
  async updateDepot(id, depotData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/depots/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depotData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du dépôt');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du dépôt:', error);
      throw error;
    }
  },

  /**
   * Supprime un dépôt
   * @param {number} id - ID du dépôt
   * @returns {Promise<void>}
   */
  async deleteDepot(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/depots/${id}`, {
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
      console.error('Erreur lors de la suppression du dépôt:', error);
      throw error;
    }
  },
};

export default depotService;
