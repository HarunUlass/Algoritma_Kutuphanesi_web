# MongoDB Atlas Kurulum ve Bağlantı Talimatları

Bu dokümanda, MongoDB Atlas'ı nasıl kuracağınız ve uygulamanızı MongoDB Atlas ile nasıl bağlayacağınız adım adım anlatılmaktadır.

## 1. MongoDB Atlas Hesabı Oluşturma

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) sitesine gidin.
2. "Try Free" veya "Start Free" düğmesine tıklayarak kaydolun.
3. Gerekli bilgileri doldurun ve bir hesap oluşturun.

## 2. Veritabanı Kümesi (Cluster) Oluşturma

1. Atlas Dashboard'a giriş yapın.
2. "Build a Database" seçeneğine tıklayın.
3. Free Tier seçeneğini seçin.
4. AWS, Google Cloud veya Azure sağlayıcılarından birini seçin.
5. "Cluster Tier" olarak FREE TIER'ı seçili bırakın.
6. Küme için bir ad belirleyin (örn: "AlgoritmaKutuphanesi").
7. "Create Cluster" düğmesine tıklayın.

## 3. Veritabanı Kullanıcısı Oluşturma

1. Sol menüden "Database Access" seçeneğine tıklayın.
2. "Add New Database User" düğmesine tıklayın.
3. Kimlik doğrulama yöntemi olarak "Password" seçin.
4. Bir kullanıcı adı ve şifre belirleyin.
5. "Database User Privileges" alanında "Atlas admin" rolünü seçin.
6. "Add User" düğmesine tıklayın.

## 4. IP Erişim Listesi Yapılandırma

1. Sol menüden "Network Access" seçeneğine tıklayın.
2. "Add IP Address" düğmesine tıklayın.
3. Geliştirme aşamasında "Allow Access from Anywhere" seçeneğini işaretleyin. (ÖNEMLİ: Üretim ortamında güvenlik için belirli IP adreslerine izin vermelisiniz)
4. "Confirm" düğmesine tıklayın.

## 5. Bağlantı URI'sini Alma

1. Sol menüden "Database" seçeneğine tıklayın.
2. "Connect" düğmesine tıklayın.
3. "Connect your application" seçeneğini seçin.
4. Bağlantı dizesini (Connection String) kopyalayın.
5. Bağlantı dizesindeki `<password>` kısmını oluşturduğunuz kullanıcının şifresiyle değiştirin.
6. Bağlantı dizesindeki `myFirstDatabase` kısmını `Kullanicilar` ile değiştirin.

## 6. Uygulama Yapılandırması

1. Projenin kök dizininde `.env` dosyasını oluşturun (veya `.env.example` dosyasını kopyalayıp `.env` olarak yeniden adlandırın).
2. MongoDB bağlantı URI'sini aşağıdaki formatta ekleyin:

```
MONGODB_URI=mongodb+srv://kullanici_adi:sifre@cluster.mongodb.net/Kullanicilar
JWT_SECRET=algoritma_kutuphanesi_jwt_gizli_anahtar
```

## 7. Veritabanı ve Koleksiyon Oluşturma

MongoDB Atlas kümenizi oluşturduktan sonra, veritabanı ve koleksiyonu manuel olarak oluşturabilir veya uygulamanın ilk çalıştırılması sırasında otomatik olarak oluşturulmasını sağlayabilirsiniz.

Manuel olarak oluşturmak için:

1. MongoDB Atlas Dashboard'da kümenize tıklayın.
2. "Browse Collections" düğmesine tıklayın.
3. "Add My Own Data" düğmesine tıklayın.
4. Veritabanı adı olarak "Kullanicilar" girin.
5. Koleksiyon adı olarak "KullaniciBilgileri" girin.
6. "Create" düğmesine tıklayın.

## 8. Bağlantıyı Test Etme

Uygulama başlatıldığında, MongoDB Atlas bağlantısı otomatik olarak kurulacaktır. Konsolda aşağıdaki mesajı görmelisiniz:

```
MongoDB veritabanına başarıyla bağlandı
```

Eğer bir hata alırsanız, `.env` dosyasındaki bağlantı URI'sini kontrol edin ve MongoDB Atlas ayarlarınızı gözden geçirin.

## Yardım ve Destek

Daha fazla bilgi ve destek için [MongoDB Atlas Dokümantasyonu](https://docs.atlas.mongodb.com/)nu inceleyebilirsiniz. 