import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

const receptionFournisseurService = {
  /**
   * Crée une nouvelle réception fournisseur
   */
  async createReception(receptionData) {
    try {
      const token = authService.getAccessToken();

      // Champs valides du ReceptionFournisseurDTO
      const validFields = [
        'id', 'numeroReception', 'fournisseurId', 'fournisseurRaisonSociale',
        'codeSite', 'statut', 'dateReception', 'dateValidation',
        'numeroBonLivraisonFournisseur', 'numeroFactureFournisseur',
        'montantTotal', 'observations', 'userId',
        'dateCreation', 'dateModification', 'lignes'
      ];

      // Filtrer et nettoyer les données
      const cleanedData = {};
      validFields.forEach(field => {
        const value = receptionData[field];

        // Ignorer les champs undefined
        if (value === undefined) {
          return;
        }

        // Convertir les nombres en nombres
        if (['fournisseurId', 'codeSite', 'userId', 'id'].includes(field)) {
          if (value !== null) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              cleanedData[field] = numValue;
            }
          } else {
            cleanedData[field] = null;
          }
        } else {
          cleanedData[field] = value;
        }
      });

      console.log('Données nettoyées envoyées au backend (ReceptionFournisseurDTO):', cleanedData);

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la création de la réception';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        console.error('Réponse d\'erreur du serveur:', errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la réception:', error);
      throw error;
    }
  },

  /**
   * Met à jour une réception fournisseur
   */
  async updateReception(id, receptionData) {
    try {
      const token = authService.getAccessToken();

      const validFields = [
        'id', 'numeroReception', 'fournisseurId', 'fournisseurRaisonSociale',
        'codeSite', 'statut', 'dateReception', 'dateValidation',
        'numeroBonLivraisonFournisseur', 'numeroFactureFournisseur',
        'montantTotal', 'observations', 'userId',
        'dateCreation', 'dateModification', 'lignes'
      ];

      const cleanedData = {};
      validFields.forEach(field => {
        const value = receptionData[field];

        if (value === undefined) {
          return;
        }

        if (['fournisseurId', 'codeSite', 'userId', 'id'].includes(field)) {
          if (value !== null) {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              cleanedData[field] = numValue;
            }
          } else {
            cleanedData[field] = null;
          }
        } else {
          cleanedData[field] = value;
        }
      });

      console.log('Données nettoyées envoyées au backend (ReceptionFournisseurDTO):', cleanedData);

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la mise à jour de la réception';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        console.error('Réponse d\'erreur du serveur:', errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réception:', error);
      throw error;
    }
  },

  /**
   * Valide une réception fournisseur
   */
  async validerReception(id) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/valider/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la validation de la réception';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la validation de la réception:', error);
      throw error;
    }
  },

  /**
   * Annule une réception fournisseur
   */
  async annulerReception(id) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/annuler/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de l\'annulation de la réception';
        try {
          const clonedResponse = response.clone();
          const errorData = await clonedResponse.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          try {
            const clonedResponse = response.clone();
            const errorText = await clonedResponse.text();
            errorMessage = errorText || `Erreur HTTP ${response.status}`;
          } catch (e2) {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réception:', error);
      throw error;
    }
  },

  /**
   * Récupère une réception par ID
   */
  async getReceptionById(id) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/get/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la réception:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les réceptions
   */
  async getAllReceptions() {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réceptions:', error);
      throw error;
    }
  },

  /**
   * Récupère les réceptions par statut
   */
  async getReceptionsByStatut(statut) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/statut/${statut}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réceptions par statut:', error);
      throw error;
    }
  },

  /**
   * Récupère les réceptions par fournisseur
   */
  async getReceptionsByFournisseur(fournisseurId) {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/fournisseur/${fournisseurId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réceptions par fournisseur:', error);
      throw error;
    }
  },

  /**
   * Récupère les réceptions en cours
   */
  async getReceptionsEnCours() {
    try {
      const token = authService.getAccessToken();

      const response = await fetch(`${API_BASE_URL}/api/v1/reception-fournisseur/en-cours`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des réceptions en cours:', error);
      throw error;
    }
  },
};

export default receptionFournisseurService;

