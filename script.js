// === Firebase Config ===
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
const refKeuangan = ref(db, "keuangan");

onValue(refKeuangan, (snapshot) => {
  const tabel1 = document.getElementById("tabelUser");
  const tabel2 = document.getElementById("tabelUser2");
  tabel1.innerHTML = "";
  tabel2.innerHTML = "";

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const d = childSnapshot.val();
      const statusClass = d.status === "Lunas" ? "status-lunas" : "status-belum";
      const prodiAkt = `${d.prodi || ""} - ${d.angkatan || ""}`;
      
      const row = `
        <tr>
          <td class="p-2 border border-blue-400/40">${d.nama || "-"}</td>
          <td class="p-2 border border-blue-400/40">${prodiAkt}</td>
          <td class="p-2 border border-blue-400/40">${d.divisi || "-"}</td>
          <td class="p-2 border border-blue-400/40 text-center">Rp ${d.nominal?.toLocaleString() || "0"}</td>
          <td class="p-2 border border-blue-400/40 text-center">
            <span class="px-3 py-1 rounded-full text-xs font-bold inline-block ${statusClass}">
              ${d.status || "Belum"}
            </span>
          </td>
        </tr>`;

      if (d.tipe === "partisipasi_makan") {
        tabel1.innerHTML += row;
      } else if (d.tipe === "full") {
        tabel2.innerHTML += row;
      }
    });
  } else {
    tabel1.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>`;
    tabel2.innerHTML = `<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>`;
  }
});

// === Realtime Clock ===
function updateClock() {
  const now = new Date();
  const tanggal = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const waktu = now.toLocaleTimeString("id-ID", { hour12: false });
  document.getElementById("tanggal").textContent = tanggal;
  document.getElementById("waktu").textContent = waktu;
}
setInterval(updateClock, 1000);
updateClock();
