import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Kullanıcı doküman arayüzü
export interface IUser extends Document {
  _id: string;
  ad: string;
  soyad: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(path: string): boolean;
}

// Kullanıcı şeması
const UserSchema = new Schema<IUser>({
  ad: {
    type: String,
    required: [true, 'Ad alanı zorunludur'],
    trim: true
  },
  soyad: {
    type: String,
    required: [true, 'Soyad alanı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email alanı zorunludur'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir email adresi girin']
  },
  password: {
    type: String,
    required: [true, 'Şifre alanı zorunludur'],
    minlength: [6, 'Şifre en az 6 karakter olmalıdır']
  }
}, {
  timestamps: true,
  collection: 'KullaniciBilgileri' // MongoDB koleksiyon adı
});

// Şifreyi kaydetmeden önce hashleme
UserSchema.pre('save', async function(this: IUser, next: mongoose.CallbackWithoutResultAndOptionalError) {
  // Şifre değişmediyse işlemi atlayalım
  if (!this.isModified('password')) return next();
  
  try {
    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Kullanıcı modelini oluştur
const User = mongoose.model<IUser>('User', UserSchema);

// Model erişimini ESModule ve CommonJS için destekle
export { User };
export default User; 