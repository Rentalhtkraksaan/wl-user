
async function initializeFinancialData() {
    try {
        const anggotaSnapshot = await CWU_REALTIME_DATABASE.ref('anggota').once('value');
        const pesananSnapshot = await CWU_REALTIME_DATABASE.ref('pesanan').once('value');
        
        const anggotaData = anggotaSnapshot.val() || {};
        const pesananData = pesananSnapshot.val() || {};
        
        CWU_MASTER_DATA = [];
        
        const pesananMap = {};
        for (const key in pesananData) {
            if (pesananData.hasOwnProperty(key)) {
                // Gunakan nama pemesan sebagai kunci peta
                pesananMap[pesananData[key].pemesan] = { ...pesananData[key], pesananKey: key };
            }
        }
        
        for (const anggotaKey in anggotaData) {
            if (anggotaData.hasOwnProperty(anggotaKey)) {
                const anggota = anggotaData[anggotaKey];
                const pesanan = pesananMap[anggota.nama]; 
                
                if (pesanan) {
                    CWU_MASTER_DATA.push({
                        anggotaKey: anggotaKey,
                        pesananKey: pesanan.pesananKey,
                        nama: anggota.nama,
                        divisi: anggota.divisi,
                        jabatan: anggota.jabatan,
                        prodiAkt: anggota.prodiAkt,
                        tagihanTotal: pesanan.tagihan_akhir_total || 0,
                        welpart: anggota.welpart || 0,
                        kas: anggota.kas || 0,
                        hasilAkhir: anggota.hasilAkhir || 0,
                        status: pesanan.status_pembayaran,
                        timestamp: pesanan.timestamp || Date.now()
                    });
                }
            }
        }


        refreshCWUTable(); 

    } catch (error) {
        console.error('Gagal memuat data CWU:', error);
        CWU_DATA_TABLE_BODY.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-danger);">Gagal memuat data dari server. Silakan coba refresh.</td></tr>`;
    }
}



window.cwuSearchData = function() {
    CURRENT_SEARCH_TERM = document.getElementById('cwu-s-input').value.toLowerCase().trim();
    refreshCWUTable(); 
}

window.cwuFilterData = function(divisi) {
    CURRENT_FILTER_DIVISION = divisi;
    refreshCWUTable();
}


CWU_REALTIME_DATABASE.ref('anggota').on('value', () => initializeFinancialData());
CWU_REALTIME_DATABASE.ref('pesanan').on('value', () => initializeFinancialData());


initializeFinancialData();
