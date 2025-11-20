import { authService } from './authService';
import { produitService } from './produitService';
import { stockService } from './stockService';
import { clientService } from './clientService';
import { venteService } from './venteService';
import { commandeService } from './commandeService';
import { fournisseurService } from './fournisseurService';
import receptionFournisseurService from './receptionFournisseurService';
import imageMetadataService from './imageMetadataService';
import { commandeFournisseurService } from './commandeFournisseurService';

// Re-export authService
export { authService };

// Export all services
export { produitService };
export { stockService };
export { clientService };
export { venteService };
export { commandeService };
export { fournisseurService };
export { receptionFournisseurService };
export { commandeFournisseurService };
export { imageMetadataService };

// Service API général avec utilitaires
const apiService = {
  makeAuthenticatedRequest(url, options = {}) {
    const token = authService.getAccessToken();
    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
      'Authorization': `Bearer ${token}`,
      // N'ajoutez Content-Type que si ce n'est pas un FormData
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    };

    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Si c'est un FormData, laissez le navigateur gérer le Content-Type
    if (isFormData) {
      delete requestOptions.headers['Content-Type'];
    }

    return fetch(url, requestOptions);
  }
};

export { apiService };

export default {
  authService,
  apiService,
  produitService,
  stockService,
  clientService,
  venteService,
  commandeService,
  fournisseurService,
  receptionFournisseurService,
  commandeFournisseurService,
  imageMetadataService,
};