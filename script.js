document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('copy',e=>e.preventDefault());
document.addEventListener('selectstart',e=>e.preventDefault());

import{initializeApp as a}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getDatabase as b,ref as c,onValue as d}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const e={apiKey:"AIzaSyDpPEkKbEt6b_v2OWlBfGuaVQpBg2-RWR4",authDomain:"cwu-gen-2.firebaseapp.com",databaseURL:"https://cwu-gen-2-default-rtdb.firebaseio.com",projectId:"cwu-gen-2",storageBucket:"cwu-gen-2.appspot.com",messagingSenderId:"40585612014",appId:"1:40585612014:web:c88141fee369aca68181ff"};
const f=a(e),g=b(f),h=c(g,"keuangan"),i=document.getElementById("tabelUser"),j=document.getElementById("tabelUser2");

d(h,k=>{
  const l=[],m=[];
  if(k.exists()){k.forEach(n=>{
    const o=n.val(),p=`<tr><td class="p-2 border border-blue-400/40">${o.nama||"-"}</td><td class="p-2 border border-blue-400/40">${o.prodi||"-"} - ${o.angkatan||"-"}</td><td class="p-2 border border-blue-400/40">${o.divisi||"-"}</td><td class="p-2 border border-blue-400/40 text-center">Rp ${o.nominal?.toLocaleString()||"0"}</td><td class="p-2 border border-blue-400/40 text-center"><span class="px-3 py-1 rounded-full text-xs font-bold ${o.status==="Lunas"?"status-lunas":"status-belum"}">${o.status||"Belum"}</span></td></tr>`;
    if(o.tipe==="partisipasi_makan")l.push({u:o.updatedAt||0,h:p});
    else if(o.tipe==="full")m.push({u:o.updatedAt||0,h:p});
  });
  l.sort((a,b)=>b.u-a.u); m.sort((a,b)=>b.u-a.u);
  i.innerHTML=l.map(x=>x.h).join("")||'<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>';
  j.innerHTML=m.map(x=>x.h).join("")||'<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>';}
  else{i.innerHTML=j.innerHTML='<tr><td colspan="5" class="text-center p-3 text-gray-400">Belum ada data</td></tr>';}
});

function updateClock(){const e=new Date();document.getElementById("tanggal").textContent=e.toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"});document.getElementById("waktu").textContent=e.toLocaleTimeString("id-ID",{hour12:false});}
setInterval(updateClock,1e3);updateClock();
