import apiClient from './apiClient';

export const siteService = {
  // Get all sites
  async getAllSites() {
    const response = await apiClient.get('/site');
    return response.data;
  },

  // Get site by ID
  async getSiteById(id) {
    const response = await apiClient.get(`/site/${id}`);
    return response.data;
  },

  // Get site by code
  async getSiteByCode(codeSite) {
    const response = await apiClient.get(`/site/code/${codeSite}`);
    return response.data;
  },

  // Create new site
  async createSite(siteData) {
    const response = await apiClient.post('/site', siteData);
    return response.data;
  },

  // Update site
  async updateSite(id, siteData) {
    const response = await apiClient.put(`/site/${id}`, siteData);
    return response.data;
  }
};