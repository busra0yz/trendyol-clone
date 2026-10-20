//helpers fonksiyonlar, projenin birden fazla yerinde tekrar tekrar ihtiyaç duyulan KÜÇÜK ve BAĞIMSIZ işleri yapan fonksiyonlardır.

const jwt = require('jsonwebtoken');
const { PAGE_SIZE_DEFAULT } = require('./constants');


const generateSlug = (text) => {

    const turkishCharMap = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'I': 'I',
        'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U'
    };

    return text
        .replace(/[çÇğĞıİöÖşŞüÜ]/g, (char) => turkishCharMap[char] || char)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')

        .replace(/^-+|-+$/g, '');
};


const generateToken = (payload) => {


    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN // 7 gün sonra bu token geçersiz olacak
        //Dönen değer: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." şeklinde bir string
    });
};


const paginate = (page, limit) => {

    const safePage = Math.max(1, parseInt(page) || 1); //max 1den başlıyor (yani 0 diye bir değer olamaz).parseInt string ifadeyi tam sayıya çevirir. || → veya (ilk koşul sağlanmazsa ikinci koşul çalışır)
    const safeLimit = Math.max(1, parseInt(limit) || PAGE_SIZE_DEFAULT);

    return {
        offset: (safePage - 1) * safeLimit,  // Kaç kayıt atlanacak
        limit: safeLimit                      // Kaç kayıt getirilecek
    };
};


const successResponse = (res, data, statusCode = 200, message = '') => { //successResponse fonksiyonu, API'den dönen yanıtları standart bir formatta döndürmek için kullanılır.Parametreler sırasıyla:

    // res: response objesi (res.status().json() çağırmak için)
    // data: gönderilecek asıl veri (ürün listesi, kullanıcı bilgileri vs.)
    // statusCode: HTTP durum kodu (varsayılan: 200)
    // message: isteğe bağlı açıklama mesajı ("Ürünler başarıyla getirildi" gibi)   


    return res.status(statusCode).json({
        success: true,
        message,     // ES6 shorthand: message: message ile aynı şey
        data         // ES6 shorthand: data: data ile aynı şey
    });
};


module.exports = {
    generateSlug,
    generateToken,
    paginate,
    successResponse
};
