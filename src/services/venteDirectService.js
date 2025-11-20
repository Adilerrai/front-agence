import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des ventes (entité Vente avec lignes)
 * Pour les commandes clients (CommandeClientDTO), voir commandeClientService.js
 */
export const venteDirectService = {
  /**
   * Récupère toutes les ventes
   * @returns {Promise<Array>} Liste des ventes
   */
  async getAllVentes() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes`, {
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
      const response = await fetch(`${API_BASE_URL}/api/ventes/${id}`, {
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
   * Crée une nouvelle vente
   * @param {Object} venteData - Données de la vente
   * @param {number} vendeurId - ID du vendeur
   * @returns {Promise<Object>} Vente créée
   */
  async createVente(venteData, vendeurId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes?vendeurId=${vendeurId}`, {
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
   * Ajoute une ligne à une vente
   * @param {number} venteId - ID de la vente
   * @param {Object} ligneData - Données de la ligne
   * @returns {Promise<Object>} Vente mise à jour
   */
  async ajouterLigne(venteId, ligneData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes/${venteId}/lignes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ligneData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'ajout de la ligne');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la ligne:', error);
      throw error;
    }
  },

  /**
   * Supprime une ligne d'une vente
   * @param {number} venteId - ID de la vente
   * @param {number} ligneId - ID de la ligne
   * @returns {Promise<Object>} Vente mise à jour
   */
  async supprimerLigne(venteId, ligneId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes/${venteId}/lignes/${ligneId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression de la ligne');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression de la ligne:', error);
      throw error;
    }
  },

  /**
   * Applique une remise sur une vente
   * @param {number} venteId - ID de la vente
   * @param {number} remise - Montant de la remise
   * @returns {Promise<Object>} Vente mise à jour
   */
  async appliquerRemise(venteId, remise) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes/${venteId}/remise?remise=${remise}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'application de la remise');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'application de la remise:', error);
      throw error;
    }
  },

  /**
   * Valide une vente
   * @param {number} venteId - ID de la vente
   * @returns {Promise<Object>} Vente validée
   */
  async validerVente(venteId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/ventes/${venteId}/valider`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la validation de la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la validation de la vente:', error);
      throw error;
    }
  },

  /**
   * Annule une vente
   * @param {number} venteId - ID de la vente
   * @param {string} motif - Motif d'annulation
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Vente annulée
   */
  async annulerVente(venteId, motif, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(
        `${API_BASE_URL}/api/ventes/${venteId}/annuler?motif=${encodeURIComponent(motif)}&userId=${userId}`,
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
        throw new Error(error.message || 'Erreur lors de l\'annulation de la vente');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la vente:', error);
      throw error;
    }
  },
};

export default venteDirectService;
