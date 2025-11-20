import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des commandes fournisseur
 */
export const commandeFournisseurService = {
  
  /**
   * Récupère toutes les commandes fournisseur
   * @param {number} page - Numéro de page (défaut: 0)
   * @param {number} size - Nombre d'éléments par page (défaut: 10)
   * @returns {Promise<Array>} Liste des commandes
   */
  async getAllCommandes(page = 0, size = 10) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/all`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur getAllCommandes:', error);
      throw error;
    }
  },

  /**
   * Récupère les commandes par statut
   * @param {string} statut - Le statut (BROUILLON, PASSEE, PARTIELLE, LIVREE, VALIDEE, ANNULEE)
   * @param {number} page - Numéro de page
   * @param {number} size - Nombre d'éléments par page
   * @returns {Promise<Array>} Liste des commandes
   */
  async getCommandesByStatut(statut, page = 0, size = 10) {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/statut/${statut}?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur getCommandesByStatut:', error);
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

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur getCommandeById:', error);
      throw error;
    }
  },

  /**
   * Valide une commande (passe de BROUILLON à PASSEE)
   * @param {number} id - ID de la commande
   * @returns {Promise<Object>} Commande validée
   */
  async validerCommande(id) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/valider/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur validerCommande:', error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une commande
   * @param {number} id - ID de la commande
   * @param {string} newStatut - Nouveau statut
   * @returns {Promise<Object>} Commande mise à jour
   */
  async updateStatut(id, newStatut) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/${id}/statut/${newStatut}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur updateStatut:', error);
      throw error;
    }
  },

  /**
   * Convertit une commande en réception fournisseur
   * @param {number} commandeId - ID de la commande
   * @returns {Promise<number>} ID de la réception créée
   */
  async convertToReception(commandeId) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/${commandeId}/convert-to-reception`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur convertToReception:', error);
      throw error;
    }
  },

  /**
   * Récupère les commandes par fournisseur
   * @param {number} fournisseurId - ID du fournisseur
   * @returns {Promise<Array>} Liste des commandes
   */
  async getCommandesByFournisseur(fournisseurId) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/fournisseur/${fournisseurId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur getCommandesByFournisseur:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle commande fournisseur
   * @param {Object} commandeData - Données de la commande
   * @returns {Promise<Object>} Commande créée
   */
  async createCommande(commandeData) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commandeData),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur createCommande:', error);
      throw error;
    }
  },

  /**
   * Met à jour une commande fournisseur
   * @param {number} id - ID de la commande
   * @param {Object} commandeData - Données de la commande
   * @returns {Promise<Object>} Commande mise à jour
   */
  async updateCommande(id, commandeData) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/update/${id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commandeData),
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur updateCommande:', error);
      throw error;
    }
  },

  /**
   * Supprime une commande fournisseur
   * @param {number} id - ID de la commande
   * @returns {Promise<void>}
   */
  async deleteCommande(id) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(
        `${API_BASE_URL}/api/v1/commandes-fournisseur/delete/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error('Erreur deleteCommande:', error);
      throw error;
    }
  },
};

