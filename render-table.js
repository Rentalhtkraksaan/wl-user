const minWelpart = 7000;
const minKas = 10000;
const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0
});

const finalTableBody = document.querySelector("#finalDataTable tbody");
let combinedData = [];

function createTableRow(data) {
  const row = document.createElement("tr");
  const welpartClass = data.welpart >= minWelpart ? "bg-green-min" : "bg-red-min";
  const kasClass = data.kas >= minKas ? "bg-green-min" : "bg-red-min";
  const statusText = data.status === "lunas" ? "PAID" : "UNPAID";
  const statusBadgeClass = data.status === "lunas" ? "status-lunas" : "status-tidak";

  row.innerHTML = `
    <td data-label="No.">${data.index}</td>
    <td data-label="Nama Anggota">${data.nama}</td>
    <td data-label="Divisi">${data.divisi}${data.jabatan ? ` (${data.jabatan})` : ""}</td>
    <td data-label="Prodi/Akt">${data.prodiAkt}</td>
    <td data-label="TAGIHAN KONSUMSI">${formatter.format(data.tagihanTotal)}</td>
    <td data-label="Welpart"><span class="${welpartClass}">${formatter.format(data.welpart)}</span></td>
    <td data-label="Kas"><span class="${kasClass}">${formatter.format(data.kas)}</span></td>
    <td data-label="TOTAL TAGIHAN">${formatter.format(data.hasilAkhir)}</td>
    <td data-label="Status Pembayaran"><span class="${statusBadgeClass}">${statusText}</span></td>
  `;
  return row;
}

function renderFinalTable() {
  let filteredData = combinedData;

  if (window.currentFilterDivisi)
    filteredData = filteredData.filter(i => i.divisi === window.currentFilterDivisi);
  if (window.searchInputVal)
    filteredData = filteredData.filter(
      i =>
        i.nama.toLowerCase().includes(window.searchInputVal) ||
        i.divisi.toLowerCase().includes(window.searchInputVal) ||
        i.prodiAkt.toLowerCase().includes(window.searchInputVal)
    );

  if (filteredData.length === 0) {
    finalTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--color-text-secondary);">Tidak ada data yang cocok.</td></tr>`;
    return;
  }

  filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  finalTableBody.innerHTML = "";
  filteredData.forEach((data, index) => {
    data.index = index + 1;
    finalTableBody.appendChild(createTableRow(data));
  });
}

async function loadFinalTable() {
  try {
    const anggotaSnapshot = await database.ref("anggota").once("value");
    const pesananSnapshot = await database.ref("pesanan").once("value");

    const anggotaData = anggotaSnapshot.val() || {};
    const pesananData = pesananSnapshot.val() || {};
    combinedData = [];

    const pesananMap = {};
    for (const key in pesananData) {
      pesananMap[pesananData[key].pemesan] = { ...pesananData[key], pesananKey: key };
    }

    for (const anggotaKey in anggotaData) {
      const anggota = anggotaData[anggotaKey];
      const pesanan = pesananMap[anggota.nama];
      if (pesanan) {
        combinedData.push({
          anggotaKey,
          pesananKey: pesanan.pesananKey,
          nama: anggota.nama,
          divisi: anggota.divisi,
          jabatan: anggota.jabatan,
          prodiAkt: anggota.prodiAkt,
          tagihanTotal: pesanan.tagihan_akhir_total,
          welpart: anggota.welpart,
          kas: anggota.kas,
          hasilAkhir: anggota.hasilAkhir,
          status: pesanan.status_pembayaran,
          timestamp: pesanan.timestamp
        });
      }
    }
    renderFinalTable();
  } catch (e) {
    console.error("Gagal memuat data:", e);
    finalTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--color-danger);">Gagal memuat data dari server.</td></tr>`;
  }
}

database.ref("anggota").on("value", () => loadFinalTable());
database.ref("pesanan").on("value", () => loadFinalTable());

