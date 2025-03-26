// Mongoose bağlantısını yönetmek için basitleştirilmiş modül
import mongoose from 'mongoose';

// Test modunda olup olmadığını belirle
export const isTestMode = { value: false };

// Veritabanı bağlantısı
export async function connectDB() {
  try {
    // MongoDB URI'yi kontrol et
    const MONGODB_URI = import.meta.env.VITE_MONGODB_URI as string;
    
    if (!MONGODB_URI) {
      console.warn('MongoDB URI bulunamadı! Test moduna geçiliyor...');
      isTestMode.value = true;
      return null;
    }
    
    // URI'ı maskele ve logla
    const maskedURI = MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      'mongodb$1://$2:****@'
    );
    console.log(`MongoDB'ye bağlanılıyor: ${maskedURI}`);
    
    // Mongoose tipinin ve bağlantı fonksiyonunun kontrolü
    console.log('Mongoose tipi:', typeof mongoose);
    console.log('Connect fonksiyonu mevcut mu:', 'connect' in mongoose);
    
    // Mongoose 6.x için bağlantı
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Hata durumunda detaylı loglama
    console.error('MongoDB bağlantı hatası:', error);
    console.warn('Test moduna geçiliyor, demo hesap kullanılacak...');
    isTestMode.value = true;
    return null;
  }
}

// Test modunda mı kontrolü
export function isInTestMode() {
  return isTestMode.value;
}

// Bağlantıyı kapat
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('MongoDB bağlantısını kapatırken hata:', error);
  }
}

export default mongoose; 