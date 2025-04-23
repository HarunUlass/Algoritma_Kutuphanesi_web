import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .env dosyasını yükle (bu şekilde Vite'nin kendi mekanizmasını kullanıyoruz)
  const env = loadEnv(mode, process.cwd(), '')
  
  // .env içeriğini konsola yazdır (hata ayıklama için)
  console.log('Environment variables loaded:', Object.keys(env).filter(key => key.startsWith('VITE_')))
  
  return {
  plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      open: true,
      port: 5174
    },
    // Ana giriş noktasını belirle
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      }
    },
    // Debug log seviyesini artır
    logLevel: 'info',
    // .env dosyasından değişkenleri doğrudan kullan
    // Vite, 'VITE_' önekli değişkenleri otomatik olarak import.meta.env yoluyla kullanıma sunar
  }
})
