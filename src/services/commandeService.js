import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des commandes fournisseurs
 */
export const commandeService = {
  /**
   * Récupère toutes les commandes
   * @returns {Promise<Array>} Liste des commandes
   */
  async getAllCommandes() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/all`, {
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
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  /**
   * Récupère une commande par son ID
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Détails de la commande
   */
  async getCommandeById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/${id}`, {
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
      console.error('Erreur lors de la récupération de la commande:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle commande
   * @param {Object} commandeData - Données de la commande
   * @returns {Promise<Object>} Commande créée
   */
  async createCommande(commandeData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la commande');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  /**
   * Recherche des commandes selon des critères
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<Array>} Liste des commandes
   */
  async searchCommandes(criteria = {}) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la recherche des commandes:', error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une commande
   * @param {number} id - ID de la commande
   * @param {string} statut - Nouveau statut (EN_ATTENTE, CONFIRMEE, EN_COURS, LIVREE, ANNULEE)
   * @returns {Promise<Object>} Commande mise à jour
   */
  async updateStatutCommande(id, statut) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/${id}/statut?statut=${statut}`, {
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
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      throw error;
    }
  },

  /**
   * Confirme une commande
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Commande confirmée
   */
  async confirmerCommande(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/${id}/confirmer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la confirmation de la commande');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la confirmation de la commande:', error);
      throw error;
    }
  },

  /**
   * Annule une commande
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Commande annulée
   */
  async annulerCommande(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/${id}/annuler`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'annulation de la commande');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande:', error);
      throw error;
    }
  },

  /**
   * Imprime une commande (retourne un PDF en bytes)
   * @param {number} id - ID de la commande
   * @returns {Promise<Blob>} PDF de la commande
   */
  async printCommande(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/commandes/${id}/print`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Erreur lors de l\'impression de la commande:', error);
      throw error;
    }
  },
};

export default commandeService;

