import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des factures
 */
export const factureService = {
  /**
   * Récupère toutes les factures
   * @returns {Promise<Array>} Liste des factures
   */
  async getAllFactures() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures`, {
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
      console.error('Erreur lors de la récupération des factures:', error);
      throw error;
    }
  },

  /**
   * Récupère une facture par son ID
   * @param {number} id - ID de la facture
   * @returns {Promise<Object>} Détails de la facture
   */
  async getFactureById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/${id}`, {
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
      console.error('Erreur lors de la récupération de la facture:', error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle facture
   * @param {Object} factureData - Données de la facture
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Facture créée
   */
  async createFacture(factureData, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factureData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la facture');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      throw error;
    }
  },

  /**
   * Crée une facture depuis une vente
   * @param {number} venteId - ID de la vente
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Facture créée
   */
  async createFactureFromVente(venteId, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/depuis-vente/${venteId}?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la facture depuis la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la facture depuis la vente:', error);
      throw error;
    }
  },

  /**
   * Valide une facture
   * @param {number} id - ID de la facture
   * @returns {Promise<Object>} Facture validée
   */
  async validerFacture(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/${id}/valider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la validation de la facture');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la validation de la facture:', error);
      throw error;
    }
  },

  /**
   * Annule une facture
   * @param {number} id - ID de la facture
   * @param {string} motif - Motif d'annulation
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Facture annulée
   */
  async annulerFacture(id, motif, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(
        `${API_BASE_URL}/api/factures/${id}/annuler?motif=${encodeURIComponent(motif)}&userId=${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'annulation de la facture');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la facture:', error);
      throw error;
    }
  },

  /**
   * Récupère les factures d'un client
   * @param {number} clientId - ID du client
   * @returns {Promise<Array>} Liste des factures
   */
  async getFacturesByClient(clientId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/client/${clientId}`, {
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
      console.error('Erreur lors de la récupération des factures du client:', error);
      throw error;
    }
  },

  /**
   * Récupère les factures impayées
   * @returns {Promise<Array>} Liste des factures impayées
   */
  async getFacturesImpayees() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/impayees`, {
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
      console.error('Erreur lors de la récupération des factures impayées:', error);
      throw error;
    }
  },

  /**
   * Récupère les factures échues
   * @returns {Promise<Array>} Liste des factures échues
   */
  async getFacturesEchues() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/factures/echues`, {
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
      console.error('Erreur lors de la récupération des factures échues:', error);
      throw error;
    }
  },
};

export default factureService;
