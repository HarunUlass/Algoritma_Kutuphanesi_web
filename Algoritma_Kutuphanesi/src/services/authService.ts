import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { isInTestMode } from '../utils/db';

// Test için kullanıcı verileri
const TEST_USERS = [
  {
    _id: "65f5a8c0b89f8a5e92a8ed3a",
    ad: "Test",
    soyad: "Kullanıcı",
    email: "test@example.com",
    password: "$2a$10$eVJPOSdDVy/WmA7Egj.MvO6s7k1BgF3/Y7HnC1QXfH0iHZBxnnrUG", // "password123"
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Kullanıcı kaydı
export const registerUser = async (userData: Partial<IUser>): Promise<Partial<IUser> | null> => {
  try {
    // Test modunda mı kontrol et
    if (isInTestMode()) {
      console.log('Test modunda kullanıcı kaydı yapılıyor...');
      
      // Email kontrolü
      const existingUser = TEST_USERS.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Bu email adresi ile kayıtlı bir kullanıcı zaten var.');
      }
      
      // Yeni test kullanıcısı oluştur
      const hashedPassword = await bcrypt.hash(userData.password || '', 10);
      const newUser = {
        _id: `test_${Date.now()}`,
        ad: userData.ad || '',
        soyad: userData.soyad || '',
        email: userData.email || '',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      TEST_USERS.push(newUser);
      
      // Şifre olmadan kullanıcı bilgilerini döndür
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    }
    
    // Gerçek veritabanı ile kullanıcı kaydı
    // Email kontrolü
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Bu email adresi ile kayıtlı bir kullanıcı zaten var.');
    }
    
    // Yeni kullanıcı oluştur
    const user = new User(userData);
    await user.save();
    
    // Şifre olmadan kullanıcı bilgilerini döndür
    const userObject = user.toObject();
    delete userObject.password;
    
    return userObject as Partial<IUser>;
  } catch (error: any) {
    console.error('Kullanıcı kaydı sırasında hata:', error.message);
    throw error;
  }
};

// Kullanıcı girişi
export const loginUser = async (email: string, password: string): Promise<{ user: Partial<IUser>, token: string } | null> => {
  try {
    let user;
    let isPasswordValid = false;
    
    // Test modunda mı kontrol et
    if (isInTestMode()) {
      console.log('Test modunda kullanıcı girişi yapılıyor...');
      
      // Test kullanıcısını bul
      user = TEST_USERS.find(u => u.email === email);
      
      // Kullanıcı bulunamadıysa hata fırlat
      if (!user) {
        throw new Error('Kullanıcı bulunamadı.');
      }
      
      // Şifre kontrolü
      isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Hatalı şifre.');
      }
    } else {
      // Gerçek veritabanından kullanıcıyı bul
      user = await User.findOne({ email });
      
      // Kullanıcı bulunamadıysa hata fırlat
      if (!user) {
        throw new Error('Kullanıcı bulunamadı.');
      }
      
      // Şifre kontrolü
      isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        throw new Error('Hatalı şifre.');
      }
    }
    
    // Token oluştur (JWT yerine basit bir token)
    const token = Buffer.from(`${user._id}:${user.email}:${Date.now()}`).toString('base64');
    
    // Kullanıcı bilgilerini ve token'ı döndür
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as Partial<IUser>,
      token
    };
  } catch (error: any) {
    console.error('Kullanıcı girişi sırasında hata:', error.message);
    throw error;
  }
};

// Email kontrolü servisi
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Test modunda mı kontrol et
    if (isInTestMode()) {
      return !!TEST_USERS.find(user => user.email === email);
    }
    
    // Email'in varlığını kontrol et
    const user = await User.findOne({ email });
    return !!user;
  } catch (error) {
    console.error('Email kontrolü sırasında hata:', error);
    return false;
  }
} 