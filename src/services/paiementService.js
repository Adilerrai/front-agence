import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des paiements
 */
export const paiementService = {
  /**
   * Enregistre un paiement pour une vente
   * @param {number} venteId - ID de la vente
   * @param {Object} paiementData - Données du paiement
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Paiement créé
   */
  async enregistrerPaiementVente(venteId, paiementData, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/paiements/vente/${venteId}?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'enregistrement du paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement de la vente:', error);
      throw error;
    }
  },

  /**
   * Enregistre un paiement pour une facture
   * @param {number} factureId - ID de la facture
   * @param {Object} paiementData - Données du paiement
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Paiement créé
   */
  async enregistrerPaiementFacture(factureId, paiementData, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/paiements/facture/${factureId}?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'enregistrement du paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement de la facture:', error);
      throw error;
    }
  },

  /**
   * Annule un paiement
   * @param {number} paiementId - ID du paiement
   * @param {string} motif - Motif d'annulation
   * @param {number} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Paiement annulé
   */
  async annulerPaiement(paiementId, motif, userId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(
        `${API_BASE_URL}/api/paiements/${paiementId}/annuler?motif=${encodeURIComponent(motif)}&userId=${userId}`,
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
        throw new Error(error.message || 'Erreur lors de l\'annulation du paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation du paiement:', error);
      throw error;
    }
  },

  /**
   * Récupère les paiements d'une vente
   * @param {number} venteId - ID de la vente
   * @returns {Promise<Array>} Liste des paiements
   */
  async getPaiementsByVente(venteId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/paiements/vente/${venteId}`, {
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
      console.error('Erreur lors de la récupération des paiements de la vente:', error);
      throw error;
    }
  },

  /**
   * Récupère les paiements d'une facture
   * @param {number} factureId - ID de la facture
   * @returns {Promise<Array>} Liste des paiements
   */
  async getPaiementsByFacture(factureId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/paiements/facture/${factureId}`, {
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
      console.error('Erreur lors de la récupération des paiements de la facture:', error);
      throw error;
    }
  },

  /**
   * Récupère les paiements d'un client
   * @param {number} clientId - ID du client
   * @returns {Promise<Array>} Liste des paiements
   */
  async getPaiementsByClient(clientId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/paiements/client/${clientId}`, {
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
      console.error('Erreur lors de la récupération des paiements du client:', error);
      throw error;
    }
  },

  /**
   * Récupère les paiements par période
   * @param {Date|string} dateDebut - Date de début
   * @param {Date|string} dateFin - Date de fin
   * @returns {Promise<Array>} Liste des paiements
   */
  async getPaiementsByPeriode(dateDebut, dateFin) {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        dateDebut: typeof dateDebut === 'string' ? dateDebut : dateDebut.toISOString(),
        dateFin: typeof dateFin === 'string' ? dateFin : dateFin.toISOString(),
      });

      const response = await fetch(`${API_BASE_URL}/api/paiements/periode?${params}`, {
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
      console.error('Erreur lors de la récupération des paiements par période:', error);
      throw error;
    }
  },

  /**
   * Récupère le total des paiements par période
   * @param {Date|string} dateDebut - Date de début
   * @param {Date|string} dateFin - Date de fin
   * @returns {Promise<string>} Total des paiements
   */
  async getTotalPaiementsByPeriode(dateDebut, dateFin) {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        dateDebut: typeof dateDebut === 'string' ? dateDebut : dateDebut.toISOString(),
        dateFin: typeof dateFin === 'string' ? dateFin : dateFin.toISOString(),
      });

      const response = await fetch(`${API_BASE_URL}/api/paiements/total-periode?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Erreur lors de la récupération du total des paiements:', error);
      throw error;
    }
  },

  /**
   * Récupère le total par mode de paiement
   * @param {string} modePaiement - Mode de paiement (ESPECES, CARTE_BANCAIRE, CHEQUE, VIREMENT, CREDIT)
   * @param {Date|string} dateDebut - Date de début
   * @param {Date|string} dateFin - Date de fin
   * @returns {Promise<string>} Total
   */
  async getTotalByModePaiement(modePaiement, dateDebut, dateFin) {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        modePaiement,
        dateDebut: typeof dateDebut === 'string' ? dateDebut : dateDebut.toISOString(),
        dateFin: typeof dateFin === 'string' ? dateFin : dateFin.toISOString(),
      });

      const response = await fetch(`${API_BASE_URL}/api/paiements/total-mode-paiement?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Erreur lors de la récupération du total par mode de paiement:', error);
      throw error;
    }
  },
};

export default paiementService;
