const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Bağlantı URI'si
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Atlas\'a başarıyla bağlanıldı');
  // Başlatma verilerini ekle
  initializeData();
})
.catch((err) => {
  console.error('MongoDB Atlas bağlantı hatası:', err);
});

// User Model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { 
  timestamps: true 
});

// Şifre karşılaştırma için metod ekleme
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

const User = mongoose.model('User', userSchema);

// Algorithm model'i import et
const Algorithm = require('./models/Algorithm');

// Veritabanı başlatma fonksiyonu
async function initializeData() {
  try {
    // Algoritmalar koleksiyonunun boş olup olmadığını kontrol et
    const count = await Algorithm.countDocuments();
    console.log(`Veritabanında ${count} algoritma bulundu`);
    
    // Bubble Sort algoritmasının varlığını kontrol et
   
  } catch (error) {
    console.error('Başlangıç verilerini eklerken hata oluştu:', error);
  }
}

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bu email veya kullanıcı adı zaten kullanılıyor'
      });
    }

    const user = new User({ email, username, password });
    await user.save();

    res.status(201).json({
      message: 'Kullanıcı başarıyla kaydedildi',
      username: user.username
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      error: 'Kayıt işlemi sırasında bir hata oluştu'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        error: 'Kullanıcı bulunamadı'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        error: 'Hatalı şifre'
      });
    }

    res.json({
      message: 'Giriş başarılı',
      username: user.username
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      error: 'Giriş işlemi sırasında bir hata oluştu'
    });
  }
});

// Algoritma işlemleri
app.get('/api/algorithms', async (req, res) => {
  try {
    const algorithms = await Algorithm.find({}, 'title description complexity');
    console.log(`${algorithms.length} algoritma bulundu`);
    res.json(algorithms);
  } catch (error) {
    console.error('Algoritmaları getirme hatası:', error);
    res.status(500).json({
      error: 'Algoritmaları getirirken bir hata oluştu'
    });
  }
});

app.get('/api/algorithms/:title', async (req, res) => {
  try {
    const title = req.params.title;
    console.log(`Aranan algoritma: "${title}"`);
    
    // Tüm algoritmaları getir ve log'la (debug için)
    const allAlgos = await Algorithm.find({}, 'title');
    console.log('Veritabanındaki algoritmalar:', allAlgos.map(algo => algo.title));
    
    // Algoritma başlığı birebir eşleşme yerine case-insensitive arama yap
    const algorithm = await Algorithm.findOne({ 
      title: { $regex: new RegExp(`^${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') } 
    });
    
    if (!algorithm) {
      console.log(`Algoritma bulunamadı: "${title}"`);
      return res.status(404).json({
        error: 'Algoritma bulunamadı'
      });
    }
    
    console.log(`Algoritma bulundu: ${algorithm.title}`);
    res.json(algorithm);
  } catch (error) {
    console.error('Algoritma detayını getirme hatası:', error);
    res.status(500).json({
      error: 'Algoritma detayını getirirken bir hata oluştu'
    });
  }
});

// Server'ı başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 