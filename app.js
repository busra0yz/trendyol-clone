require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Aynı anda maksimum 10 aktif bağlantıya izin verilir.
    queueLimit: 0  // Bağlantı sırası sınırsızdır.
})


//Veritabanı şemasını sıfırdan oluşturuyoruz.
async function setupDatabase() {
    console.log("🛠️  Veritabanı kurulumu başlıyor...");

    // Veritabanı oluşturma ve seçme
    await pool.query("CREATE DATABASE IF NOT EXISTS ECOMMERCE_DB");
    await pool.query("USE ECOMMERCE_DB");

    //// Çakışmaları önlemek için temizlik işlemi yaparız.
    await pool.query("DROP PROCEDURE IF EXISTS GetCustomerTotalSpent");
    await pool.query('DROP TABLE IF EXISTS ORDERS');
    await pool.query('DROP TABLE IF EXISTS PRODUCTS');
    await pool.query('DROP TABLE IF EXISTS CUSTOMERS');

    //Müşteriler tablosu oluşturulur.
    await pool.query("CREATE TABLE  CUSTOMERS (ID INT AUTO_INCREMENT PRIMARY KEY,CUSTOMER_NAME VARCHAR(50) NOT NULL,EMAIL VARCHAR(50))");

    //Ürünler ve indexleme tablosu oluşturulur.
    await pool.query("CREATE TABLE  PRODUCTS (ID INT AUTO_INCREMENT PRIMARY KEY,PRODUCT_NAME VARCHAR(50) NOT NULL,PRICE DECIMAL(10,2),STOCK INT )");
    await pool.query("CREATE INDEX idx_name ON PRODUCTS(PRODUCT_NAME)");

    //Siparişler tablosu oluşturulur.
    await pool.query("CREATE TABLE ORDERS (ID INT AUTO_INCREMENT PRIMARY KEY,CUSTOMER_ID INT,PRODUCT_ID INT,QUANTITY INT,ORDER_DATE DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(CUSTOMER_ID) REFERENCES CUSTOMERS(ID),FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(ID))");

    const procedureSQL =
        'CREATE PROCEDURE GetCustomerTotalSpent(IN cusID INT) BEGIN SELECT SUM(P.PRICE*O.QUANTITY) AS TOPLAM FROM ORDERS O JOIN PRODUCTS P ON O.PRODUCT_ID = P.ID WHERE O.CUSTOMER_ID = cusID; END';
    await pool.query(procedureSQL);

    console.log(" Veritabanı şeması başarıyla oluşturuldu.");

}

// Test verilerini (Dummy Data) veritabanına ekler.
// Bulk Insert yöntemi kullanılarak performans optimize edilmiştir.

async function seedData() {
    console.log("Örnek veriler ekleniyor...");

    const Customers = [
        ['Seyit', 'seyitaltintas8@gmail.com'],
        ['Busranur', 'busra0yz@gmail.com'],
        ['Defne', 'defnealtintas@gmail.com']
    ];

    await pool.query("INSERT INTO CUSTOMERS(CUSTOMER_NAME,EMAIL) VALUES ?", [Customers]);

    const Products = [
        ['Bilgisayar', 20000, 5],
        ['Tablet', 12000, 100],
        ['Telefon', 45000, 245],
        ['Mouse', 2000, 2000],
        ['Klavye', 5000, 90]
    ];

    await pool.query("INSERT INTO PRODUCTS (PRODUCT_NAME,PRICE,STOCK) VALUES ?", [Products]);
}

//  Ürün Arama ve Sayfalama (Pagination)
//  @param {string} keyword - Arama terimi
//  @param {number} page - Sayfa numarası

async function searchProducts(keyword, page) {
    const page_size = 2;
    const offset = (page - 1) * page_size;

    const searchPattern = `%${keyword}%`;


    const search = 'SELECT PRODUCT_NAME ,PRICE ,STOCK FROM PRODUCTS WHERE PRODUCT_NAME LIKE ? ORDER BY PRICE ASC LIMIT ? OFFSET ? ';
    const [rows] = await pool.query(search, [searchPattern, page_size, offset]);
    console.log(rows);

}

// Satın Alma İşlemi (Transaction Yönetimi)
// Stok kontrolü yapar, stok düşer ve sipariş kaydı oluşturur.
// Hata durumunda tüm işlemleri geri alır (Rollback).
async function buyProduct(customerId, productId, quantity) {
    const connection = await pool.getConnection(); //"Bir hata olursa, sanki hiçbir şey olmamış gibi zamanı geri sar" der.

    try {

        await connection.beginTransaction(); 

        //  Ürün ve Stok Kontrolü
        const [stockResult] = await connection.query("SELECT STOCK,PRODUCT_NAME FROM PRODUCTS WHERE ID = ?", [productId]);

        if (stockResult.length === 0) throw new Error("Ürün Bulunamadı!");

        const currentStock = stockResult[0].STOCK;
        const productName = stockResult[0].PRODUCT_NAME;

        if (currentStock < quantity) {
            throw new Error("Stok Yetersiz");
        }

        // Stok Güncelleme
        await connection.query("UPDATE PRODUCTS SET STOCK = STOCK - ? WHERE ID = ?", [quantity, productId]);

        //Sipariş Kaydı OLuşturma
        await connection.query("INSERT INTO ORDERS (CUSTOMER_ID,PRODUCT_ID,QUANTITY) VALUES (?,?,?)", [customerId, productId, quantity]);

        //// Tüm işlemler başarılıysa veritabanına işle
        await connection.commit();
    }
    catch (err) {
        // Hata anında değişiklikleri iptal et
        await connection.rollback();
        console.log(err.message);
    }
    finally {
        connection.release();
    }
}

// Müşteri bazlı rapor sunar
// Join yapısı ve Stored Procedure kullanımını gösterir.

async function showReport(customerId) {
    console.log(`\n--- Müşteri Raporu (ID: ${customerId}) ---`);

    // Detaylı sipariş listesi (Inner Join)
    const sqlJoin = 'SELECT C.CUSTOMER_NAME,P.PRODUCT_NAME AS URUN,O.QUANTITY,O.ORDER_DATE FROM ORDERS O INNER JOIN CUSTOMERS C ON O.CUSTOMER_ID = C.ID INNER JOIN PRODUCTS P ON O.PRODUCT_ID = P.ID WHERE C.ID = ? ';
    const [rows] = await pool.query(sqlJoin, [customerId]);
    console.table(rows);

    // Toplam harcama
    const [procResult] = await pool.query("CALL GetCustomerTotalSpent(?)", [customerId]);
    const total = procResult[0][0].TOPLAM;
    console.log(` Toplam Harcama: ${total} TL\n`);

}

async function main() {
    try {

        await setupDatabase();
        await seedData();

        // Ürün Arama
        await searchProducts("Bilgisayar", 1);

        // Satın Alma
        await buyProduct(1, 2, 4);
        await buyProduct(2, 3, 45);

        // Raporlama
        await showReport(1);
        await showReport(2);
    }
    catch (err) {
        console.log('Ana akış hatası ' + err.message);
    }
    finally {
        // Bağlantı havuzunu kapat
        await pool.end();
        console.log(" Veritabanı bağlantıları kapatıldı.");
    }
}
main();
