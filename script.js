// Rig-11 Tank Geometri Uzunlukları (Excel Tablosundan Çıkarılan Gerçek Uzunluklar - L cm)
const tanklar = [
    { id: 'dinlenme1', isim: 'Dinlenme-1', L: 254.21 },
    { id: 'dinlenme2', isim: 'Dinlenme-2', L: 254.21 },
    { id: 'dinlenme3', isim: 'Dinlenme-3', L: 254.21 },
    { id: 'reserve', isim: 'Reserve', L: 508.51 },
    { id: 'hopper', isim: 'Hopper', L: 254.21 },
    { id: 'emis1', isim: 'Emiş-1', L: 1031.99 },
    { id: 'emis2', isim: 'Emiş-2', L: 1031.90 },
    { id: 'premix1', isim: 'Premix 1. Göz', L: 553.30 },
    { id: 'premix2', isim: 'Premix 2. Göz', L: 478.61 },
    { id: 'kt1', isim: 'KT Tankı 1. Göz', L: 254.21 },
    { id: 'kt2', isim: 'KT Tankı 2. Göz', L: 254.21 },
    { id: 'kt3', isim: 'KT Tankı 3. Göz', L: 254.21 }
];

// Sayfa yüklendiğinde HTML inputlarını oluştur
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tank-container');
    tanklar.forEach(tank => {
        container.innerHTML += `
            <div class="tank-item">
                <label for="${tank.id}">${tank.isim}</label>
                <!-- step="0.01" sayesinde artık 14.5 veya 14.25 cm gibi virgüllü (noktalı) girişler de yapılabilir -->
                <input type="number" id="${tank.id}" placeholder="cm" min="0" max="210" step="0.01">
            </div>
        `;
    });
});

// Dairesel Kesitli Hacim Hesaplama Algoritması (Kusursuz Mühendislik Modeli)
function hesapla() {
    const sonucAlani = document.getElementById('sonuc-alani');
    const sonucListesi = document.getElementById('sonuc-listesi');
    const toplamHacimAlani = document.getElementById('toplam-hacim');
    
    sonucListesi.innerHTML = '';
    let genelToplam = 0;
    let hesaplananTankSayisi = 0;

    // Tank Geometri Sabitleri
    const R = 149;           // Alt silindir yarıçapı (cm)
    const D = 300;           // Üst dikdörtgen genişliği (cm)
    const maxH = 210;        // Toplam depo derinliği (cm)
    const bblFactor = 158987.295; // cm³ to bbl dönüşüm faktörü

    tanklar.forEach(tank => {
        const inputDegeri = document.getElementById(tank.id).value;
        
        if (inputDegeri !== '') {
            // Girilen cm değerini alıp kısıtlıyoruz (Eksileri 0'a, 210 üstünü 210'a sabitler)
            let boslukCm = Math.max(0, Math.min(maxH, parseFloat(inputDegeri)));
            
            // Tabandan yukarı sıvı yüksekliği
            let h = maxH - boslukCm;
            
            // 1) Alt Silindirik Kısım Hesabı (Integral Dairesel Kesit Formülü)
            let h_cyl = Math.min(h, R);
            let A_cyl = 0;
            if (h_cyl > 0) {
                // Formül: R^2 * acos((R-h)/R) - (R-h) * sqrt(2Rh - h^2)
                let acosPart = Math.pow(R, 2) * Math.acos((R - h_cyl) / R);
                let sqrtPart = (R - h_cyl) * Math.sqrt(Math.max(0, 2 * R * h_cyl - Math.pow(h_cyl, 2)));
                A_cyl = acosPart - sqrtPart;
            }
            
            // 2) Üst Dikdörtgen Prizma Hesabı
            let h_rect = Math.max(0, h - R);
            let A_rect = D * h_rect;
            
            // 3) Toplam Hacim = (Toplam Kesit Alanı * Tank Uzunluğu) / BBL Çarpanı
            let toplamKesitAlani = A_cyl + A_rect;
            let hacim = (toplamKesitAlani * tank.L) / bblFactor;
            
            genelToplam += hacim;
            hesaplananTankSayisi++;

            sonucListesi.innerHTML += `
                <div class="sonuc-satiri">
                    <span>${tank.isim} (${boslukCm} cm):</span>
                    <strong>${hacim.toFixed(2)} bbl</strong>
                </div>
            `;
        }
    });

    if (hesaplananTankSayisi > 0) {
        toplamHacimAlani.innerHTML = `Toplam Hacim: ${genelToplam.toFixed(2)} bbl`;
        sonucAlani.style.display = 'block';
    } else {
        alert("Lütfen hesaplama yapmak için en az bir tanka boşluk değeri (0-210 cm arası) girin.");
        sonucAlani.style.display = 'none';
    }
}
