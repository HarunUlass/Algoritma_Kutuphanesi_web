import bcrypt from 'bcryptjs';

// Kullanıcı arayüzü
export interface IUser {
  _id: string;
  ad: string;
  soyad: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Demo kullanıcı verisi
export const demoUsers = [
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

// Yardımcı fonksiyonlar
export const User = {
  findOne: async (query: {email?: string}) => {
    return demoUsers.find(user => user.email === query.email);
  },
  
  create: async (userData: Partial<IUser>) => {
    const newUser = {
      _id: `user_${Date.now()}`,
      ad: userData.ad || '',
      soyad: userData.soyad || '',
      email: userData.email || '',
      password: userData.password || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    demoUsers.push(newUser);
    return newUser;
  },
  
  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

export default User; 