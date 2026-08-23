/**
 * DBDBSCHOOL & 늘봄학교 공통 API 클라이언트
 */
const API = {
  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  setToken(token, persist = false) {
    if (persist) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  async request(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `요청 실패 (${response.status})`);
      }
      return data;
    } catch (err) {
      console.error(`[API Error] ${url}:`, err);
      throw err;
    }
  },

  get(url, options = {}) {
    return this.request(url, { credentials: 'omit', method: 'GET', ...options });
  },

  post(url, body = {}, credentials = 'omit') {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials
    });
  },

  put(url, body = {}) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  patch(url, body = {}) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
};

// Global export for vanilla scripts
if (typeof window !== 'undefined') {
  window.API = API;
  window.fetchWithAuth = (url, options = {}) => API.request(url, options);
}
