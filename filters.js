window.currentFilterDivisi = "";
window.searchInputVal = "";

document.getElementById("searchInput").addEventListener("keyup", e => {
  window.searchInputVal = e.target.value.toLowerCase().trim();
  renderFinalTable();
});

document.getElementById("divisiFilter").addEventListener("change", e => {
  window.currentFilterDivisi = e.target.value;
  renderFinalTable();
});
