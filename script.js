// Proteksi klik & copy
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpPEkKbEt6b_v2OWlBfGuaVQpBg2-RWR4",
  authDomain: "cwu-gen-2.firebaseapp.com",
  databaseURL: "https://cwu-gen-2-default-rtdb.firebaseio.com",
  projectId: "cwu-gen-2",
  storageBucket: "cwu-gen-2.appspot.com",
  messagingSenderId: "40585612014",
  appId: "1:40585612014:web:c88141fee369aca68181ff"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db, "keuangan");

const tabelPartisipasi = document.getElementById("tabelUser");
const tabelFull = document.getElementById("tabelUser2");

let dataPartisipasi = [];
let dataFull = [];

onValue(dbRef, snapshot => {
  dataPartisipasi = [];
  dataFull = [];

  if(snapshot.exists()){
    snapshot.forEach(n => {
      const o = n.val();
      const rowHTML = `<tr>
        <td class="p-2 border border-blue-400/40">${o.nama || "-"}</td>
        <td class="p-2 border border-blue-400/40">${o.prodi || "-"} - ${o.angkatan || "-"}</td>
        <td class="p-2 border border-blue-400/40">${o.divisi || "-"}</td>
        <td class="p-2 border border-blue-400/40 text-center">Rp ${o.nominal?.toLocaleString() || "0"}</td>
        <td class="p-2 border border-blue-400/40 text-center">
          <span class="px-3 py-1 rounded-full text-xs font-bold ${o.status==="Lunas"?"status-lunas":"status-belum"}">
            ${o.status === "Lunas" ? "Lunas" : "Belum"}
          </span>
        </td>
      </tr>`;

      if(o.tipe === "partisipasi_makan") dataPartisipasi.push({
        u: o.updatedAt || 0,
        h: rowHTML,
        divisi: o.divisi || "",
        nama: o.nama || ""
      });
      else if(o.tipe === "full") dataFull.push({
        u: o.updatedAt || 0,
        h: rowHTML,
        divisi: o.divisi || "",
        nama: o.nama || ""
      });
    });

    applyFilter();
  } else {
    tabelPartisipasi.innerHTML = tabelFull.innerHTML = '<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>';
  }
});

function applyFilter(){
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const divisiFilter = document.getElementById("divisiFilter").value.toLowerCase();

  renderTable(tabelPartisipasi, dataPartisipasi, searchText, divisiFilter);
  renderTable(tabelFull, dataFull, searchText, divisiFilter);
}

function renderTable(tableElem, dataArray, searchText = "", filterDivisi = "all"){
  let filtered = dataArray.filter(x => {
    const divisiClean = x.divisi.trim().toLowerCase();
    let divisiCheck = true;

    if(filterDivisi !== "all"){
      divisiCheck = divisiClean === filterDivisi;
    }

    let namaCheck = x.nama.toLowerCase().includes(searchText);
    return divisiCheck && namaCheck;
  });

  filtered.sort((a,b) => b.u - a.u);

  tableElem.innerHTML = filtered.map(x => x.h).join("") ||
    '<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>';
}

document.getElementById("searchInput").addEventListener("input", applyFilter);
document.getElementById("divisiFilter").addEventListener("change", applyFilter);

function updateClock(){
  const now = new Date();
  document.getElementById("tanggal").textContent = now.toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});
  document.getElementById("waktu").textContent = now.toLocaleTimeString("id-ID",{hour12:false});
}
setInterval(updateClock,1000);
updateClock();
