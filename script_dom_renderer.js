// Membutuhkan akses ke: CWU_MASTER_DATA, CWU_DATA_TABLE_BODY, CURRENCY_FORMATTER, THRESHOLD_WELPART, THRESHOLD_KAS

/**

@param {Object} data 
@returns {HTMLTableRowElement} 
 */
function generateEntryRow(data) {
    const row = document.createElement('tr');
    row.id = `entry-row-${data.anggotaKey.substring(0, 8)}`; 

    const welpartClass = data.welpart >= THRESHOLD_WELPART ? 'bg-green-min' : 'bg-red-min';
    const kasClass = data.kas >= THRESHOLD_KAS ? 'bg-green-min' : 'bg-red-min';

    const statusText = data.status === 'lunas' ? 'PAID' : 'UNPAID'; 
    const statusBadgeClass = data.status === 'lunas' ? 'status-lunas' : 'status-tidak';
    
    row.innerHTML = `
        <td data-label="No.">${data.index}</td>
        <td data-label="Nama Anggota">${data.nama}</td>
        <td data-label="Divisi">${data.divisi}${data.jabatan ? ` (${data.jabatan})` : ''}</td>
        <td data-label="Prodi/Akt">${data.prodiAkt}</td>
        <td data-label="TAGIHAN KONSUMSI">${CURRENCY_FORMATTER.format(data.tagihanTotal)}</td>
        <td data-label="Welpart"><span class="${welpartClass}">${CURRENCY_FORMATTER.format(data.welpart)}</span></td>
        <td data-label="Kas"><span class="${kasClass}">${CURRENCY_FORMATTER.format(data.kas)}</span></td>
        <td data-label="TOTAL TAGIHAN">${CURRENCY_FORMATTER.format(data.hasilAkhir)}</td>
        <td data-label="Status Pembayaran"><span class="${statusBadgeClass}">${statusText}</span></td>
    `;
    return row;
}


function refreshCWUTable() {
    
    let filteredData = CWU_MASTER_DATA;

    
    if (CURRENT_FILTER_DIVISION) {
        filteredData = filteredData.filter(item => item.divisi === CURRENT_FILTER_DIVISION);
    }

  
    if (CURRENT_SEARCH_TERM) {
         filteredData = filteredData.filter(item => 
            item.nama.toLowerCase().includes(CURRENT_SEARCH_TERM) ||
            item.divisi.toLowerCase().includes(CURRENT_SEARCH_TERM) ||
            item.prodiAkt.toLowerCase().includes(CURRENT_SEARCH_TERM)
        );
    }
    
    if (filteredData.length === 0) {
        CWU_DATA_TABLE_BODY.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-text-secondary);">Tidak ada data yang cocok dengan filter atau pencarian saat ini.</td></tr>`;
        return;
    }

    
    filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    
    CWU_DATA_TABLE_BODY.innerHTML = '';
    filteredData.forEach((data, index) => {
        data.index = index + 1; 
        const row = generateEntryRow(data);
        CWU_DATA_TABLE_BODY.appendChild(row);
    });
}
