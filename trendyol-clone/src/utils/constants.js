//object.freeze() → Objenin değerlerini değiştirilmesini engellemek içindir.
//Magic String Problemi → Sabitleri TEK BİR YERDE tanımla, her yerde import et.

//Sipariş durumları
const ORDER_STATUS = Object.freeze({
    PENDING: 'pending',         // Sipariş beklemede — henüz işleme alınmadı
    PROCESSING: 'processing',   // Sipariş hazırlanıyor — depoda paketleniyor
    SHIPPED: 'shipped',         // Kargoya verildi — yolda
    DELIVERED: 'delivered',     // Teslim edildi — müşteri aldı
    CANCELLED: 'cancelled'      // İptal edildi — sipariş sonlandırıldı
});


//Kullanıcı rolleri
const USER_ROLES = Object.freeze({
    CUSTOMER: 'customer',   // Normal müşteri — alışveriş yapar
    ADMIN: 'admin',         // Sistem yöneticisi — her şeye erişir
    SELLER: 'seller'        // Satıcı — kendi ürünlerini yönetir
});


//Ödeme durumları
const PAYMENT_STATUS = Object.freeze({
    PENDING: 'pending',     // Ödeme bekleniyor — henüz alınmadı
    PAID: 'paid',           // Ödeme alındı — başarılı
    REFUNDED: 'refunded'    // İade edildi — para geri döndü
});

//Sayfalama varsayılanı
const PAGE_SIZE_DEFAULT = 20;


module.exports = {
    ORDER_STATUS,
    USER_ROLES,
    PAYMENT_STATUS,
    PAGE_SIZE_DEFAULT
};
