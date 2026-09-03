const errorHandler = (err, req, res, next) => { // Express, 4 parametreli middleware'i otomatik olarak "error handler" olarak tanır.

    //Status code belirleme
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || 'Sunucu hatası';


    // HTTP 409 Conflict: Kaynak zaten var, çakışma oluştu
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409; // Conflict

        // map(e) => e.path: Hatanın olduğu alanın adı (örn: email)
        const fields = err.errors.map((e) => `${e.path} alanı zaten kullanılıyor`);

        message = fields.join(', ');
    }


    if (err.name === 'SequelizeValidationError') {
        statusCode = 400; // Bad Request

        // Her validation hatasını okunabilir mesaja dönüştür
        const fields = err.errors.map((e) => `${e.path}: ${e.message}`);

        message = fields.join(', ');
    }


    res.status(statusCode).json({
        success: false,
        message: message,

        // stack trace: sadece development ortamında gönder
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // err.stack: Hatanın detaylı izi. Production'da göstermeyiz.
    });
};

module.exports = { errorHandler }; 
