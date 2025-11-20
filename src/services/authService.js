import { config } from '@/config/environment';

// Service d'authentification
class AuthService {
  constructor() {
    this.refreshPromise = null;
  }

  async login(credentials) {
    try {
      const response = await fetch(`${config.api.baseUrl}/api/auth/login/username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      this._storeAuthData(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    // Si une requête de rafraîchissement est déjà en cours, retournez cette promesse
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${config.api.baseUrl}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token: refreshToken
          }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        this._storeAuthData(data);
        return data;
      } catch (error) {
        console.error('Token refresh error:', error);
        this.logout();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  _storeAuthData(data) {
    // Support both old (access_token) and new (token) API response formats
    const token = data.token || data.access_token;
    if (token) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', data.refresh_token || '');
      localStorage.setItem('token_type', data.tokenType || data.token_type || 'Bearer');
      localStorage.setItem('userInfo', JSON.stringify({
        id: data.id,
        email: data.email,
        username: data.username,
        nomComplet: data.nomComplet,
        telephone: data.telephone,
        genre: data.genre,
        role: data.role,
        pointDeVenteId: data.pointDeVenteId,
        // Support old format
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        roles: data.roles,
        allowedAPP: data.allowedAPP
      }));
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token_type');
    localStorage.removeItem('userInfo');
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Ajouter le token aux headers
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Si le token est expiré
      if (response.status === 401) {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Rafraîchir le token
        await this.refreshToken(refreshToken);

        // Réessayer la requête avec le nouveau token
        const newResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.getAccessToken()}`
          }
        });

        if (!newResponse.ok) {
          throw new Error(`HTTP error! status: ${newResponse.status}`);
        }

        return newResponse;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();