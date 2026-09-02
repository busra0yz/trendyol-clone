// Token oluşturma işi auth controller'da yapılır (kullanıcı login olduğunda).

const jwt = require('jsonwebtoken'); // JWT token'larını OLUŞTURMAK ve DOĞRULAMAK için kullanılan kütüphane.

const User = require('../models/User'); // User modeli: Token doğrulandıktan sonra, token'ın içindeki kullanıcı ID'si ile veritabanından güncel kullanıcı bilgilerini çekmek için lazım.

const protect = async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ') //Boşluğu unutma 
    ) {
        // "Bearer eyJhbGciOiJIUzI1NiIsInR5..." → split(' ') ile boşluktan böl
        token = req.headers.authorization.split(' ')[1];
    }


    // Bu noktada eğer token hâlâ undefined ise, iki ihtimal var:
    //   1. Frontend Authorization header'ını hiç göndermemiş
    //   2. Header var ama "Bearer " ile başlamıyor (yanlış format)


    //   401: "Sen kimsin bilmiyorum. Önce giriş yap." (Kimlik sorunu)
    //   403: "Seni tanıyorum ama buna yetkin yok." (Yetki sorunu)
    //   Şu an token yoksa → kullanıcıyı tanıyamıyoruz → 401

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Bu işlem için giriş yapmanız gerekiyor. Lütfen önce login olun.'
        });
    }

    // jwt.verify() iki durumda HATA FIRLATIR:
    //   1. Token geçersizse (biri token'ı değiştirmiş, sahte imza)
    //   2. Token'ın süresi dolmuşsa (expired)

    try {

        //JWT_SECRET=Token'leri imzalamak için kullanılan gizli anahtar.
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //Token'in 3 parçasını alır: Header.Payload.Signature
        //decoded değişkeni token'ın Payload kısmını içerir.


        // Token geçerli olsa bile, kullanıcının HÂLÂ sistemde var olduğundan
        // emin olmalıyız.
        //
        // ❓ Neden tekrar DB'ye gidiyoruz?
        //   Senaryo 1: Admin, kullanıcıyı TOKEN OLUŞTURULDUKTAN SONRA sildi
        //   Senaryo 2: Kullanıcı hesabını kapattı ama eski token'ı hâlâ var
        //   Senaryo 3: Kullanıcı banlandı (isActive: false yapıldı)

        const currentUser = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] } // şifreyi hariç tut
        });


        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: 'Bu token\'a ait kullanıcı artık mevcut değil.'
            });
        }

        // 🎓 Bu kontrol neden önemli?
        // Token geçerli olabilir çünkü kullanıcı banlanmadan ÖNCE token
        // almıştı. Ama artık sistemi kullanma yetkisi yok.

        if (!currentUser.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Bu hesap devre dışı bırakılmış. Lütfen destek ile iletişime geçin.'
            });
        }


        // Örnek kullanım (controller'da):
        //   const userId = req.user.id;      → Sipariş oluştururken kullanıcı ID'si
        //   const userRole = req.user.role;   → Admin mi müşteri mi kontrolü
        //   const userName = req.user.name;   → "Hoşgeldin Büşra" mesajı

        req.user = currentUser; //req.user : Controller'da kullanmak için kullanıcı bilgilerini saklar.

        //next() demezsek istek askıda kalır.
        next(); // Bir middleware ya res.json() ile yanıt döndürmeli, ya da next() ile sonrakine devretmeli. İKİSİNİ BİRDEN YAPMA! (Çift yanıt hatası verir)


    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.'
            });
        }

        // ───  Token Geçersiz (Invalid) ───

        // Bu hata şu durumlarda oluşur:
        //   1. Token'ın içeriği değiştirilmiş (biri payload'ı kurcalamış)
        //   2. Token tamamen sahte (farklı bir secret ile imzalanmış)
        //   3. Token formatı bozuk (eksik parça, hatalı Base64)
        //
        // 🔒 GÜVENLİK NOTU: Bu durum potansiyel bir saldırı girişimi olabilir. Production'da bu tür hataları log'lamak iyi bir pratiktir (ör: Winston logger ile).

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token. Lütfen tekrar giriş yapın.'
            });
        }

        // ───  Beklenmeyen Hatalar ───
        //Veritabanı hatası, User.findByPk çöktü, genel bir 500 hatası döndürüyoruz.

        console.error('Auth Middleware Hatası:', error); //Hatayı sunucu konsoluna yazdırır.Production'da bu loglar hata takip araçları (Sentry, Datadog) tarafından yakalanır.
        return res.status(500).json({ //Bu artık kullanıcının hatası değil (401 değil), sunucunun kendi iç problemi. 500 = "Internal Server Error"
            success: false,
            message: 'Kimlik doğrulama sırasında bir sunucu hatası oluştu.'
        });
    }
};


//   // Tek bir route'u koruma:
//   router.get('/my-orders', protect, orderController.getMyOrders);

//  Tüm route'ları koruma (bu satırdan sonraki her route korunur):

//   router.use(protect);
//   router.post('/orders', orderController.createOrder);
//   router.get('/profile', userController.getProfile);

//   const { protect } = require('../middlewares/auth.middleware'); kullanım örneği
module.exports = { protect }; //Obje olarak export ediyoruz ({ protect }) çünkü ileride bu dosyaya başka middleware'ler de eklenebilir (ör: optionalAuth, refreshToken).

// AKIŞ ŞÖYLEDİR:
// ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
// │   Frontend   │────▶│   protect()  │────▶│  Controller  │────▶│   Yanıt      │
// │  (İstek atar)│     │  (Kapıcı)    │     │  (İş mantığı)│     │   (JSON)     │
// └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
//       │                     │
//       │  Authorization:     │  Token doğruysa → next()
//       │  Bearer <token>     │  Token yanlışsa → 401 hata döndür, zinciri kes
//       └─────────────────────┘
//
// Bu dosyadaki "protect" fonksiyonu tam olarak o "Kapıcı" rolünü üstleniyor.
// Route'a gelen her isteği kontrol eder: "Kimliğin var mı? Geçerli mi? Süresi
// dolmuş mu?" — Her şey tamamsa geçirir, değilse reddeder.
//
// ============================================================================