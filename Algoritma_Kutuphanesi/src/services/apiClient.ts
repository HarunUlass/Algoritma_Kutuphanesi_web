// API istek fonksiyonları

const API_BASE_URL = 'http://localhost:3000/api';

// Temel API istekleri için yardımcı fonksiyon
async function fetchApi(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  headers: Record<string, string> = {}
) {
  try {
    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      mode: 'cors' // CORS sorununu çözmek için
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    console.log(`API isteği: ${API_BASE_URL}${endpoint}`, body);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API isteği başarısız oldu');
    }

    return data;
  } catch (error) {
    console.error(`API isteği başarısız: ${endpoint}`, error);
    throw error;
  }
}

// API endpoint'leri
export const api = {
  auth: {
    login: (email: string, password: string) => 
      fetchApi('/auth/login', 'POST', { email, password }),
    register: (userData: any) => 
      fetchApi('/auth/register', 'POST', userData)
  },
  algorithms: {
    getAll: () => fetchApi('/algorithms', 'GET'),
    getByTitle: (title: string) => fetchApi(`/algorithms/${title}`, 'GET')
  }
};

// API durumunu kontrol et
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      return {
        status: 'error',
        message: 'API bağlantı hatası',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: 'development'
    };
  } catch (error) {
    console.error('Health check sırasında hata:', error);
    return {
      status: 'error',
      message: 'API bağlantı hatası',
      timestamp: new Date().toISOString()
    };
  }
} 