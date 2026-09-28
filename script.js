// Kalibrasyon Cetveli (Statik).xlsx dosyanızdaki verilere dayanarak oluşturulmuş tank listesi.
// Toplam derinliği (210 cm) ve 1 cm'ye düşen yaklaşık bbl karşılıklarını (cmHacimCarpani) 
// Excel dosyanızdaki kesin statik formüllere göre gerekirse revize edebilirsiniz.
const tanklar = [
    { id: 'dinlenme1', isim: 'Dinlenme-1', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'dinlenme2', isim: 'Dinlenme-2', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'dinlenme3', isim: 'Dinlenme-3', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'reserve', isim: 'Reserve', toplamDerinlik: 210, cmHacimCarpani: 0.96 },
    { id: 'hopper', isim: 'Hopper', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'emis1', isim: 'Emiş-1', toplamDerinlik: 210, cmHacimCarpani: 0.65 },
    { id: 'emis2', isim: 'Emiş-2', toplamDerinlik: 210, cmHacimCarpani: 1.95 },
    { id: 'premix1', isim: 'Premix 1. Göz', toplamDerinlik: 210, cmHacimCarpani: 1.04 },
    { id: 'premix2', isim: 'Premix 2. Göz', toplamDerinlik: 210, cmHacimCarpani: 0.91 },
    { id: 'kt1', isim: 'KT Tankı 1. Göz', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'kt2', isim: 'KT Tankı 2. Göz', toplamDerinlik: 210, cmHacimCarpani: 0.48 },
    { id: 'kt3', isim: 'KT Tankı 3. Göz', toplamDerinlik: 210, cmHacimCarpani: 0.48 }
];

// Sayfa yüklendiğinde HTML inputlarını otomatik oluştur
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tank-container');
    tanklar.forEach(tank => {
        container.innerHTML += `
            <div class="tank-item">
                <label for="${tank.id}">${tank.isim}</label>
                <input type="number" id="${tank.id}" placeholder="cm" min="0">
            </div>
        `;
    });
});

// Hacim Hesaplama Fonksiyonu
function hesapla() {
    const sonucAlani = document.getElementById('sonuc-alani');
    const sonucListesi = document.getElementById('sonuc-listesi');
    const toplamHacimAlani = document.getElementById('toplam-hacim');
    
    sonucListesi.innerHTML = '';
    let genelToplam = 0;
    let hesaplananTankSayisi = 0;

    tanklar.forEach(tank => {
        const boslukCm = document.getElementById(tank.id).value;
        
        // Eğer input boş değilse hesaplama yap
        if (boslukCm !== '') {
            // Sıvı Yüksekliği = Toplam Tank Derinliği - Üstten Ölçülen Boşluk
            const siviYuksekligi = tank.toplamDerinlik - parseFloat(boslukCm);
            
            // Boşluk ölçümü tank derinliğinden büyük girilirse sonucu eksiye düşürmemek için Math.max(0, ...)
            const gecerliSiviYuksekligi = Math.max(0, siviYuksekligi); 
            
            // Hacim = Sıvı Yüksekliği x 1 cm'nin hacim karşılığı (bbl)
            const hacim = gecerliSiviYuksekligi * tank.cmHacimCarpani;
            
            genelToplam += hacim;
            hesaplananTankSayisi++;

            // Sonuçları ekrana bbl formatında yazdırma
            sonucListesi.innerHTML += `
                <div class="sonuc-satiri">
                    <span>${tank.isim}:</span>
                    <strong>${hacim.toFixed(2)} bbl</strong>
                </div>
            `;
        }
    });

    // En az bir veri girildiyse sonuç panelini göster
    if (hesaplananTankSayisi > 0) {
        toplamHacimAlani.innerHTML = `Toplam Hacim: ${genelToplam.toFixed(2)} bbl`;
        sonucAlani.style.display = 'block';
    } else {
        alert("Lütfen hesaplama yapmak için en az bir tanka boşluk değeri (cm) girin.");
        sonucAlani.style.display = 'none';
    }
}
