// Configuration d'environnement pour l'application
export const config = {
  // Mode de développement
  isDevelopment: import.meta.env.MODE === 'development',
  
  // Configuration de l'API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8009',
    timeout: 10000, // 10 secondes
  },
  
  // Configuration de Mirage
  mirage: {
    // Désactiver Mirage si on veut utiliser une vraie API
    enabled: import.meta.env.VITE_USE_MIRAGE !== 'false',
  },
  
  // Configuration de l'authentification
  auth: {
    tokenKey: 'authToken',
    userKey: 'userInfo',
    // Durée de validité du token en millisecondes (24h par défaut)
    tokenExpiry: 24 * 60 * 60 * 1000,
  },
  
  // Configuration des toasts
  toast: {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
  
  // Configuration de la pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  
  // Configuration des uploads
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  
  // Configuration de l'application
  app: {
    name: 'DashSpace - Point de Vente',
    version: '1.0.0',
    description: 'Application SaaS de gestion de point de vente',
  }
};

export default config;
