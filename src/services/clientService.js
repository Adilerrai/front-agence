import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des clients - Nouvelle API
 */
export const clientService = {
  /**
   * Récupère tous les clients
   * @returns {Promise<Array>} Liste des clients
   */
  async getAllClients() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
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
      console.error('Erreur lors de la récupération des clients:', error);
      throw error;
    }
  },

  /**
   * Récupère un client par son ID
   * @param {number} id - ID du client
   * @returns {Promise<Object>} Détails du client
   */
  async getClientById(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
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
      console.error('Erreur lors de la récupération du client:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau client
   * @param {Object} clientData - Données du client
   * @returns {Promise<Object>} Client créé
   */
  async createClient(clientData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du client');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw error;
    }
  },

  /**
   * Met à jour un client
   * @param {number} id - ID du client
   * @param {Object} clientData - Données du client
   * @returns {Promise<Object>} Client mis à jour
   */
  async updateClient(id, clientData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du client');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      throw error;
    }
  },

  /**
   * Active un client
   * @param {number} id - ID du client
   * @returns {Promise<void>}
   */
  async activerClient(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/activer`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation du client:', error);
      throw error;
    }
  },

  /**
   * Désactive un client
   * @param {number} id - ID du client
   * @returns {Promise<void>}
   */
  async desactiverClient(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}/desactiver`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de la désactivation du client:', error);
      throw error;
    }
  },

  /**
   * Récupère les clients avec dépassement de crédit
   * @returns {Promise<Array>} Liste des clients
   */
  async getClientsAvecDepassementCredit() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/clients/depassement-credit`, {
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
      console.error('Erreur lors de la récupération des clients en dépassement:', error);
      throw error;
    }
  },
};

export default clientService;

