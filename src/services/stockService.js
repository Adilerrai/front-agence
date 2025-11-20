import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

/**
 * Service pour la gestion des stocks
 */
export const stockService = {
  /**
   * Récupère tous les stocks
   * @returns {Promise<Array>} Liste de tous les stocks
   */
  async getAllStocks() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/all`, {
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
      console.error('Erreur lors de la récupération des stocks:', error);
      throw error;
    }
  },

  /**
   * Récupère un stock par ID du produit
   * @param {number} produitId - ID du produit
   * @returns {Promise<Object>} Détails du stock
   */
  async getStockByProduit(produitId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/produit/${produitId}`, {
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
      console.error('Erreur lors de la récupération du stock:', error);
      throw error;
    }
  },

  /**
   * Récupère les stocks en dessous du minimum
   * @returns {Promise<Array>} Liste des stocks en alerte
   */
  async getStocksBelowMinimum() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/below-minimum`, {
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
      console.error('Erreur lors de la récupération des stocks en alerte:', error);
      throw error;
    }
  },

  /**
   * Récupère les stocks vides
   * @returns {Promise<Array>} Liste des stocks vides
   */
  async getStocksEmpty() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/empty`, {
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
      console.error('Erreur lors de la récupération des stocks vides:', error);
      throw error;
    }
  },

  /**
   * Ajuste le stock d'un produit
   * @param {number} produitId - ID du produit
   * @param {BigDecimal} nouvelleQuantite - Nouvelle quantité
   * @param {string} motif - Motif de l'ajustement
   * @returns {Promise<Object>} Stock mis à jour
   */
  async ajusterStock(produitId, nouvelleQuantite, motif) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/ajuster`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produitId,
          nouvelleQuantite,
          motif,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'ajustement du stock:', error);
      throw error;
    }
  },

  /**
   * Enregistre une entrée de stock
   * @param {number} produitId - ID du produit
   * @param {BigDecimal} quantite - Quantité entrée
   * @param {string} reference - Référence (optionnel)
   * @param {string} motif - Motif de l'entrée
   * @returns {Promise<void>}
   */
  async entreeStock(produitId, quantite, reference, motif) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/entree`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produitId,
          quantite,
          reference,
          motif,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'entrée de stock:', error);
      throw error;
    }
  },

  /**
   * Enregistre une sortie de stock
   * @param {number} produitId - ID du produit
   * @param {BigDecimal} quantite - Quantité sortie
   * @param {string} reference - Référence (optionnel)
   * @param {string} motif - Motif de la sortie
   * @returns {Promise<void>}
   */
  async sortieStock(produitId, quantite, reference, motif) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/sortie`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produitId,
          quantite,
          reference,
          motif,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la sortie de stock:', error);
      throw error;
    }
  },

  /**
   * Met à jour les limites de stock
   * @param {number} produitId - ID du produit
   * @param {BigDecimal} stockMin - Stock minimum
   * @param {BigDecimal} stockMax - Stock maximum
   * @returns {Promise<Object>} Stock mis à jour
   */
  async updateStockLimits(produitId, stockMin, stockMax) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/update-limits/${produitId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockMin,
          stockMax,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des limites de stock:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau stock
   * POST /api/v1/stock/create
   * @param {Object} stockData - Données du stock
   * @returns {Promise<Object>} Stock créé
   */
  async createStock(stockData) {
    try {
      const token = authService.getAccessToken();

      // Nettoyer les données en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedData = Object.entries(stockData).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/stock/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du stock:', error);
      throw error;
    }
  },

  /**
   * Met à jour un stock
   * PUT /api/v1/stock/update/{id}
   * @param {number} id - ID du stock
   * @param {Object} stockData - Données du stock
   * @returns {Promise<Object>} Stock mis à jour
   */
  async updateStock(id, stockData) {
    try {
      const token = authService.getAccessToken();

      // Nettoyer les données en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedData = Object.entries(stockData).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/stock/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la mise à jour du stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      throw error;
    }
  },

  /**
   * Recherche des stocks selon des critères (avec pagination)
   * POST /api/v1/stock/search
   * @param {Object} criteria - Critères de recherche (tous les champs null/undefined/vides seront ignorés)
   * @param {number} page - Numéro de page
   * @param {number} size - Nombre d'éléments par page
   * @param {string} sort - Tri
   * @returns {Promise<Array>} Liste des stocks
   */
  async searchStocks(criteria = {}, page = 0, size = 50, sort = 'produitLibelle,asc') {
    try {
      const token = authService.getAccessToken();
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      // Nettoyer les critères en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/stock/search?${params}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedCriteria),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
      console.error('Erreur lors de la recherche des stocks:', error);
      throw error;
    }
  },

  /**
   * Recherche des stocks selon des critères (sans pagination)
   * POST /api/v1/stock/search/all
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<Array>} Liste complète des stocks
   */
  async searchStocksNotPaged(criteria = {}) {
    try {
      const token = authService.getAccessToken();

      // Nettoyer les critères en enlevant les valeurs null, undefined et les chaînes vides
      const cleanedCriteria = Object.entries(criteria).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await fetch(`${API_BASE_URL}/api/v1/stock/search/all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedCriteria),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la recherche des stocks (non paginée):', error);
      throw error;
    }
  },

  /**
   * Supprime un stock
   * @param {number} id - ID du stock
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async deleteStock(id) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/stock/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du stock:', error);
      throw error;
    }
  },
};

export default stockService;

