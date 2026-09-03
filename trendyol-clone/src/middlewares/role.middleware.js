// ...roles → "rest parameter": kaç tane parametre gelirse gelsin hepsini bir diziye toplar.
const authorize = (...roles) => {

    // Bir middleware fonksiyonu döndürüyoruz (factory pattern)
    return (req, res, next) => {

        // req.user: protect middleware'i tarafından set edilmiş olmalı. Eğer yoksa, protect middleware çalışmamış demektir.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Bu işlem için giriş yapmanız gerekiyor',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için yetkiniz bulunmamaktadır',
            });
        }
        next();
    };
};

module.exports = { authorize };

/*
Akış:
      1. protect middleware → kullanıcıyı doğrular, req.user'a atar
      2. authorize middleware → req.user.role'ü kontrol eder
      3. Rol uygunsa → next() ile devam eder
      4. Rol uygun değilse → 403 Forbidden döner */
