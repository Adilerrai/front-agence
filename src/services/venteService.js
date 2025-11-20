import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des commandes clients (CommandeClientDTO)
 * Pour les ventes directes avec lignes, voir venteDirectService.js
 */
export const venteService = {
  /**
   * Récupère toutes les ventes (commandes clients)
   * @returns {Promise<Array>} Liste des ventes
   */
  async getAllVentes() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/all`, {
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
      console.error('Erreur lors de la récupération des ventes:', error);
      throw error;
    }
  },

  /**
   * Récupère une vente par son ID
   * @param {number} id - ID de la vente
   * @returns {Promise<Object>} Détails de la vente
   */
  async getVenteById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/${id}`, {
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
      console.error('Erreur lors de la récupération de la vente:', error);
      throw error;
    }
  },

  /**
   * Récupère les ventes par statut
   * @param {string} statut - Statut (BROUILLON, CONFIRMEE, EN_PREPARATION, PRETE, LIVREE, FACTUREE, ANNULEE)
   * @returns {Promise<Array>} Liste des ventes
   */
  async getVentesByStatut(statut) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/statut/${statut}`, {
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
      console.error('Erreur lors de la récupération des ventes par statut:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle vente
   * @param {Object} venteData - Données de la vente
   * @returns {Promise<Object>} Vente créée
   */
  async createVente(venteData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venteData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une vente
   * @param {number} id - ID de la vente
   * @param {string} statut - Nouveau statut
   * @returns {Promise<Object>} Vente mise à jour
   */
  async updateStatut(id, statut) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/${id}/statut?statut=${statut}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la vente:', error);
      throw error;
    }
  },

  /**
   * Confirme une vente
   * @param {number} id - ID de la vente
   * @returns {Promise<Object>} Vente confirmée
   */
  async confirmerVente(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/${id}/confirmer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la confirmation de la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la confirmation de la vente:', error);
      throw error;
    }
  },

  /**
   * Annule une vente
   * @param {number} id - ID de la vente
   * @returns {Promise<Object>} Vente annulée
   */
  async annulerVente(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/ventes/${id}/annuler`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'annulation de la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la vente:', error);
      throw error;
    }
  },
};

export default venteService;

