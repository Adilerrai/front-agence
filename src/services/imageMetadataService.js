import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8009';

const imageMetadataService = {
  /**
   * Upload binaire (multipart/form-data) vers /api/v1/images/upload
   * @param {number} produitId
   * @param {File} file
   * @returns {Promise<Object>} ImageMetadataDTO
   */
  async upload(produitId, file) {
    const token = authService.getAccessToken();
    const form = new FormData();
    form.append('produitId', String(produitId));
    form.append('file', file);

    const resp = await fetch(`${API_BASE_URL}/api/v1/images/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Ne pas définir Content-Type pour FormData; le navigateur le fera avec boundary
      },
      body: form,
    });
    if (!resp.ok) {
      let message = `HTTP ${resp.status}`;
      try { message = (await resp.json()).message || message; } catch {}
      throw new Error(message);
    }
    return resp.json();
  },
  /**
   * Crée un enregistrement de métadonnées d'image pour un produit
   * @param {Object} data { produitId, fileName, contentType, size, url }
   * @returns {Promise<Object>} ImageMetadataDTO créé
   */
  async create(data) {
    const token = authService.getAccessToken();
    const response = await fetch(`${API_BASE_URL}/api/v1/images/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try { message = (await response.json()).message || message; } catch {}
      throw new Error(message);
    }
    return response.json();
  },

  /**
   * Récupère une image par ID
   */
  async getById(id) {
    const token = authService.getAccessToken();
    const resp = await fetch(`${API_BASE_URL}/api/v1/images/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  },

  /**
   * Récupère les images d'un produit
   */
  async getByProduitId(produitId) {
    const token = authService.getAccessToken();
    const resp = await fetch(`${API_BASE_URL}/api/v1/images/produit/${produitId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
  },

  /**
   * Supprime une image
   */
  async delete(id) {
    const token = authService.getAccessToken();
    const resp = await fetch(`${API_BASE_URL}/api/v1/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return true;
  },

  /**
   * Renvoie l'URL publique du contenu (décompressé) d'une image
   */
  getContentUrl(id) {
    return `${API_BASE_URL}/api/v1/images/${id}/produit-content`;
  },

  /**
   * Renvoie l'URL du contenu d'image à partir de l'ID produit
   * (selon le nouveau contrôleur: GET /api/v1/images/{id}/content)
   */
  getContentByProduitIdUrl(produitId) {
    return `${API_BASE_URL}/api/v1/images/${produitId}/produit-content`;
  },
};

export default imageMetadataService;
