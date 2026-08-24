const express = require('express');
const helmet = require('helmet'); // Güvenlik başlıklarını (headers) otomatik ayarlar, uygulamayı yaygın web saldırılarından korur.
const cors = require('cors');     // Farklı origin'lerden (domain/port) gelen isteklere (örneğin React frontend'inden) izin verir.
const morgan = require('morgan'); // Gelen HTTP isteklerini konsola loglar. 'dev' formatı geliştirme aşaması için idealdir.

// İleride yazacağımız ana route dosyamızı projemize dahil ediyoruz.
const routes = require('../routes/index');

const app = express();


//Global Middleware'ler. Gelen her isteğin ilk uğradığı yer. 
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Gelen isteklerdeki (JSON) verileri parse eder (req.body'yi doldurur).
app.use(express.urlencoded({ extended: true })); // 🌟 Senin eklediğin süper detay! Form/x-www-form-urlencoded verilerini okumak için kullanılır.


// api/v1 ile başlayan tüm istekler routes dosyasına yönlendirilir.
// api ön eki "Bu yola gelen hiçbir isteğe HTML dönme, burası tamamen JSON/Data dönecek bir alandır." demek için kullandık.
// v1 -> versiyon 1 
app.use('/api/v1', routes);


//Middleware burada hatayı yakalar ve frontende iletir.
app.use((err, req, res, next) => { // 4 parametre alması hata ayıklama middleware olduğunu gösterir.
  // next parametresi hata varsa bir sonrakine iletir.Express.js'in hata ayıklama mekanizması olduğunu anlaması için next parametresi zorunludur.
  console.error('Global Hata Yakalandı:', err.message);

  // Eğer hatanın özel bir HTTP statü kodu yoksa (örneğin 404 gibi), standart olarak 500 dönüyoruz.
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false, // İşlemin başarılı olup olmadığını belirtir.
    message: err.message || 'Sunucu içi beklenmeyen bir hata oluştu.',
    // Stack trace'i sadece geliştirme aşamasında (development) gösteriyoruz.Çünkü productionda ayrıntılı hata mesajları göstermek güvenlik açığı oluşturabilir.
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Hata yığını (stack trace), hata ayıklama için kullanılır.
  });
});

module.exports = app;
