const { Model, DataTypes } = require('sequelize'); //Model: Kendimize ait sınıfı oluştururken genetiğini miras alacağımız "Ana Sınıf", DataTypes: Veritabanındaki sütunların tiplerini (Metin, Sayı vb.) belirten sözlük
const bcyrpt = require('bcyrptjs'); //Şifreleri veritabanında düz metin (123456) şelinde saklamak büyük güvenlik zafiyetidir.
const { sequelize } = require('../config/database'); //Veritabanı bağlantısını buraya alıyoruz.

class User extends Model {

    async comparePassword(candidatePassword) { //Kullanıcının girdiği şifreyi veritabanındaki şifreyle karşılaştırır.
        return await bcrypt.compare(candidatePassword, this.password);
    }

    toJSON() { //Burada yapılan işlem, API üzerinden veri çekerken şifreyi gizlemektir.
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    }
}

User.init({ //Burada veritabanındaki tablonun sütunlarını tanımlıyoruz.
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allownull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allownull: false,
    },
    password: {
        type: DataTypes.STRING,
        allownull: false,
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin'), //ENUM, belirli değerlerden sadece birini alabilen veri tipidir.Burada sadece customer ve admin değerlerini alabilir.
        defaultValue: 'customer',
    },
    phone: {
        type: DataTypes.STRING,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }

},
    { //Modelin ayarlarını burada yapıyoruz.
        sequelize, //Veritabanı bağlantısını buraya alıyoruz.
        modelName: 'User', //Modelin adını burada belirtiyoruz.
        timestamps: true, //Modelin zaman damgalarını burada belirtiyoruz.
        createdAt: 'createdAt', //Modelin oluşturulma zamanını burada belirtiyoruz.
        updatedAt: 'updatedAt', //Modelin güncellenme zamanını burada belirtiyoruz.


        hooks: { //Hooks, modelin belirli olaylarından önce veya sonra çalışacak fonksiyonlardır.
            beforeCreate: async (user) => {
                if (user.changed('password')) { //Eğer şifre değiştiyse
                    const salt = await bcrypt.genSalt(10); //Salt oluştur
                    user.password = await bcrypt.hash(user.password, salt); //Şifreyi hashle
                }

            },
            beforeUpdate: async (user) => { //Kullanıcı şifresini güncellerken de hashle
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    }
)



module.exports = User;


































// // ==========================================
// // 1. KÜTÜPHANELERİ ÇAĞIRMA (IMPORTS) ZAMANI
// // ==========================================
// // Sequelize paketinden bize lazım olan iki aracı alıyoruz.
// // Model: Kendimize ait sınıfı oluştururken genetiğini miras alacağımız "Ana Sınıf"
// // DataTypes: Veritabanındaki sütunların tiplerini (Metin, Sayı vb.) belirten sözlük
// const { Model, DataTypes } = require('sequelize');

// // Şifreleri veritabanında düz metin (123456) şelinde saklamak büyük güvenlik zafiyetidir.
// // bcryptjs kütüphanesini, kullanıcının şifresini kimsenin çözemeyeceği bir yapıya (hash) dönüştürmek için kullanacağız.
// const bcrypt = require('bcryptjs');

// // database.js'de kurduğumuz bağlantıyı (motoru) buraya alıyoruz
// // Ki User modelimiz SQL'e gidip işlemlerini bu bağlantı üzerinden yapsın
// const { sequelize } = require('../config/database');

// // ==========================================
// // 2. SINIF TANIMLAMASI VE METOTLAR
// // ==========================================
// // Kendi User sınıfımızı Sequelize'in Model sınıfının üzerine (extends) inşa ediyoruz.
// // Bütün SQL özellikleri (User.create, User.findAll) bu miras sayesinde class'a kazandırılır.
// class User extends Model {

//     // -- INSTANCE METHOD (Örnek Metodu) --
//     // Aylar sonra kullanıcı login (giriş) yaparken "candidatePassword" kısmına girdiği
//     // düz şifreyi, veritabanındaki hashlenmiş (this.password) şifreyle güvenli kıyaslar. (True/False döner)
//     async comparePassword(candidatePassword) {
//         return await bcrypt.compare(candidatePassword, this.password);
//     }

//     // -- TOJSON OVERRIDE (Cevabı Ezme) --
//     // Sunucumuz API üzerinden Frontend'e veri fırlatırken (ör: res.json(user)),
//     // gizlice hep bu toJSON() fonksiyonu devreye girer. Biz burada o varsayılan davranışı bozuyoruz:
//     // "API'ye veriyi atmadan önce onun güvenli sahte kopyasını çıkart, o kopyadan password satırını sil, Frontend'e temiz kopyayı at!!"
//     toJSON() {
//         const values = Object.assign({}, this.get()); // Verinin güvenli sahte kopyası çıkarılır
//         delete values.password; // Kopyadan şifre tamamen temizlenir
//         return values; // Temizlenmiş veri döner (Network tab'ında şifre GÖZÜKMEZ)
//     }
// }

// // ==========================================
// // 3. MODEL BAŞLATMA (VERİTABANI ŞEMASI)
// // ==========================================
// // Veritabanına bu tablonun kolonlarını (sütunlarını) ve tiplerini anlatıyoruz.
// User.init(
//     {
//         id: {
//             type: DataTypes.INTEGER, // Tam sayı (Sayısal ID)
//             autoIncrement: true,     // Her yeni kayıtta sayıyı kendi 1 arttırsın (1,2,3... diye ilerler)
//             primaryKey: true,        // Bu tablonun anahtarı "id" sütunudur. Benzersiz satır kimliği.
//         },
//         name: {
//             type: DataTypes.STRING,  // Normal metin
//             allowNull: false,        // Database dilinde "NOT NULL" (Asla boş geçilemez)
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,            // Aynı e-maille 2. kişi kaydolmaya çalışırsa SQL hata (red) döner.
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         role: {
//             type: DataTypes.ENUM('customer', 'admin'), // Enum: Bu alan sadece "customer" ya da "admin" isimli metinleri alabilir! Başkasına izin vermez.
//             defaultValue: 'customer',                  // Yeni bir kişiyi kayıt ederken rol yazmazsak sistem onu otomatik 'müsteri' yapsın.
//         },
//         phone: {
//             type: DataTypes.STRING,  // Telefon no (Metin olarak çünkü +90 gibi işaretler girebiliriz)
//         },
//         isActive: {
//             type: DataTypes.BOOLEAN, // True / False (Aktif mi?, Yasaklandı mı?)
//             defaultValue: true,      // Yeni kaydolanlar genelde başlangıçta aktiftir.
//         },
//     },
//     {
//         // ==========================================
//         // 4. KONFİGÜRASYON (AYARLAR) VE KANCALAR (HOOKS)
//         // ==========================================
//         sequelize,           // Kullanacağı veritabanı motoru (Yukarıda import etmiştik)
//         modelName: 'User',   // Kod içerisindeki tekil class referans ismi (Node.js tarafı)
//         tableName: 'users',  // Veritabanın içerisine gidip oluşturmasını istediğimiz Gerçek Tablonun adı! (Çoğul olur genelde)
//         timestamps: true,    // Sequelize'ın tabloya kendi kendine createdAt ve updatedAt tarihlerini atmasını sağlar, rahatlatır.

//         // Yazar yazmaz veritabanına basılıp girilmeyecektir. Kancaya takılacak:
//         hooks: {
//             // beforeSave (Kaydedilmeden hemen ÖNCE!): Veritabanına tam anlamıyla bir Yazma (Yeni kayıt veya Güncelleme) işlemi tetiklendiği o son saniye kancasıdır!
//             beforeSave: async (user) => {
//                 // user.changed('password'): Eğer veritabanına giden güncellemelerde 'password' alanında bir değişiklik tespit edildiyse veya sistemde "ilk üretimi" ise şartı çalışır.
//                 // Neden var? Adam profil resmini veya adını değiştirdi diye (Eğer şifre değişimi yoksa) adama tekrar üst üste şifre algoritması (hash) çalıştırma diye.
//                 if (user.changed('password')) {
//                     const salt = await bcrypt.genSalt(10);                  // Tuzlama: Şifreyi daha da kırılmaz yapan, dışarıdan eklenen karmaşık kalıplar.
//                     user.password = await bcrypt.hash(user.password, salt); // Gerçek düz şifreyi (ör: 123456) al, tuz (salt) ile birlikte ezip güvenli haline dönüştür ki DB'ye öyle gitsin.
//                 }
//             },
//         },
//     }
// );

// // Başka dosyalarda çağırabilmek (import Controller) için modeli dışarıya ihraç ediyoruz.
// module.exports = User;
