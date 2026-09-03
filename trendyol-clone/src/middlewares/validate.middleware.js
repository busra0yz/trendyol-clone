//Controller dan önce veriyi doğrularız.

// Email formatını kontrol eden basit regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// validate: factory function — bir schema alır, middleware döndürür
const validate = (schema) => { //Schema,  Hangi alanların zorunlu olduğunu ve ne tipte olması gerektiğini tanımlayan bir JavaScript objesidir.


    return (req, res, next) => {

        // Hata mesajlarını toplayacağımız dizi
        const errors = [];

        //Bu döngüde schema içindeki her field ve rules için döneriz.
        for (const [field, rules] of Object.entries(schema)) {

            // req.body'den bu alanın değerini al
            const value = req.body[field];


            //Zorunluluk kontrolü
            if (rules.required && (value == null || String(value).trim() === '')) {
                errors.push(`${field} alanı zorunludur`);
                continue; // bu alan için diğer kontrollere gerek yok, sonraki alana geç
            }

            // Değer yoksa ve zorunlu değilse → bu alanı atla
            if (value == null) continue;


            //Tip kontrolü
            if (rules.type && typeof value !== rules.type) {
                errors.push(`${field} alanı ${rules.type} tipinde olmalıdır`);
                continue;
            }


            //String kontrolleri

            // minLength: minimum karakter sayısı
            if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
                errors.push(`${field} alanı en az ${rules.minLength} karakter olmalıdır`);
            }

            // maxLength: maksimum karakter sayısı
            if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
                errors.push(`${field} alanı en fazla ${rules.maxLength} karakter olmalıdır`);
            }

            // pattern: özel format kontrolü (şimdilik sadece email)
            if (rules.pattern === 'email' && typeof value === 'string' && !emailRegex.test(value)) {
                errors.push(`${field} alanı geçerli bir e-posta adresi olmalıdır`);
            }


            // ── Sayı kontrolleri ──

            // min: minimum değer
            if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
                errors.push(`${field} alanı en az ${rules.min} olmalıdır`);
            }

            // max: maksimum değer
            if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
                errors.push(`${field} alanı en fazla ${rules.max} olmalıdır`);
            }


            // ── Enum kontrolü ──
            // enum: değerin belirli seçeneklerden biri olması gerekiyorsa
            // Örn: { enum: ['pending', 'shipped', 'delivered'] }
            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${field} alanı şu değerlerden biri olmalıdır: ${rules.enum.join(', ')}`);
            }
        }


        // Hata varsa → 400 Bad Request döndür, controller'a ulaşma
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Doğrulama hatası',
                errors: errors,  // tüm hata mesajlarını dizi olarak gönder
            });
        }

        // Tüm kontroller geçti → sonraki middleware/controller'a devam et
        next();
    };
};

module.exports = { validate };
