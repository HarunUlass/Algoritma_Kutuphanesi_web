// API istek fonksiyonları
import { connectDB } from '../utils/db';

// MongoDB bağlantı durumunu kontrol et
export async function testConnection() {
  try {
    const connection = await connectDB();
    return {
      success: true,
      message: 'MongoDB bağlantısı başarılı',
      connection
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'MongoDB bağlantısı başarısız',
      error
    };
  }
}

// API durumunu kontrol et
export async function healthCheck() {
  try {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  } catch (error) {
    console.error('Health check sırasında hata:', error);
    throw error;
  }
} 