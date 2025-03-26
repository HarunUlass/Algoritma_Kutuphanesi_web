import { connectDB } from './db';

// Uygulama başlatıldığında çağrılarak veritabanı bağlantısını kurar
export async function initializeDatabase() {
  try {
    console.log('Veritabanı bağlantısı başlatılıyor...');
    
    // connectDB fonksiyonu null dönerse bağlantı başarısız demektir
    const connection = await connectDB();
    
    if (!connection) {
      console.warn('Veritabanı bağlantısı kurulamadı, ancak uygulama test modunda çalışmaya devam edecek.');
      console.log('Test kullanıcısı bilgileri:');
      console.log('  Email: test@example.com');
      console.log('  Şifre: password123');
      return false;
    }
    
    console.log('Veritabanı bağlantısı kuruldu.', connection ? 'Bağlantı aktif.' : 'Bağlantı sorunlu.');
    return !!connection;
  } catch (error) {
    console.error('Veritabanı bağlantısı başlatılamadı:', error);
    console.log('Uygulama test modunda çalışmaya devam edecek.');
    console.log('Test kullanıcısı bilgileri:');
    console.log('  Email: test@example.com');
    console.log('  Şifre: password123');
    return false;
  }
}

// Uygulamanın başlangıç noktasında çağrılmalıdır
export default initializeDatabase; 