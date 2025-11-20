import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des points de vente
 */
export const pointVenteService = {
  /**
   * Récupère tous les points de vente
   * @returns {Promise<Array>} Liste des points de vente
   */
  async getAllPointsDeVente() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/points-vente/all`, {
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
      console.error('Erreur lors de la récupération des points de vente:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau point de vente
   * @param {Object} data - Données du point de vente (nomPointDeVente, password)
   * @returns {Promise<Object>} Point de vente créé
   */
  async createPointDeVente(data) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/points-vente/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du point de vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du point de vente:', error);
      throw error;
    }
  },
};

export default pointVenteService;
