# BAK Terminal — Canlı Sohbet

Gerçek zamanlı, oda koduyla çalışan terminal temalı sohbet. Node.js + Express + Socket.IO.

## Bilgisayarda başlat

1. Node.js 20 veya üstünü yükle: https://nodejs.org/
2. Terminalde bu klasöre gir.
3. `npm install`
4. `npm start`
5. Tarayıcıdan `http://localhost:3000` adresini aç.

Aynı bilgisayardaki iki sekmede aynı oda koduyla test edebilirsin.

## İnternete yayınla (Render örneği)

1. Bu klasörü bir GitHub deposuna yükle (server.js, package.json, public/index.html).
2. https://render.com/ üzerinden yeni **Web Service** oluştur, depoyu bağla.
3. Runtime: **Node**. Build command: `npm install`. Start command: `npm start`.
4. Node 20+ kullan. Sunucu otomatik olarak `process.env.PORT` dinler.
5. Render'ın verdiği HTTPS adresini arkadaşlarınla paylaş. Aynı oda kodunu kullananlar konuşabilir.

Ücretsiz servislerde uyku/soğuk başlangıç, kota ve bağlantı kesintileri olabilir; güncel planları sağlayıcıdan kontrol et. Tek sunucu örneği için tasarlanmıştır. Birden fazla sunucu instance'ı için Socket.IO Redis adapter ve paylaşılan oda üyeliği takibi gerekir.

## Güvenlik ve sınırlar

- Bu bir **özel oda kodlu** sohbet uygulamasıdır, kullanıcı hesabı veya güçlü kimlik doğrulama yoktur. Oda kodunu bilen herkes katılabilir.
- **Uçtan uca şifreleme yoktur**. HTTPS/WSS kullanırsan aktarım şifrelenir, ancak sunucu mesaj içeriğini görebilir. Gizli bilgi paylaşma.
- Mesajlar RAM üzerinden yayınlanır, veritabanında saklanmaz. Çevrimdışı mesaj ve geçmiş yoktur.
- Mesajlar HTML olarak yorumlanmaz; XSS riskini azaltmak için `textContent` ile gösterilir.
- Temel mesaj hız sınırı vardır; halka açık geniş kullanım için IP tabanlı limitler, kimlik doğrulama, moderasyon ve spam koruması ekle.
- Kötüye kullanım veya büyük trafik için hazır bir üretim sistemi değildir.

## Komutlar

`/help`, `/clear`, `/whoami`, `/status`, `/matrix`

## Sağlık kontrolü

`GET /health` → `{ "ok": true }`
