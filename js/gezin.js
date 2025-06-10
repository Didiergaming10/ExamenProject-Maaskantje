document.addEventListener("DOMContentLoaded", () => {
  function requireAuth() {
    console.log("Authentication check (mock)");
  }

  function getCurrentUser() {
    return { role: "directie" };
  }

  requireAuth();
  const user = getCurrentUser();

  let currentCategory = "all";

  function loadGezinnen() {
    fetch("php/klanten-api.php")
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(gezinnen => {
        renderProducts(gezinnen);
      })
      .catch(err => {
        console.error("Gezinnen info ophalen mislukt:", err);
        const tbody = document.getElementById("gezin-table-body");
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Fout bij ophalen gegevens: ${err.message}</td></tr>`;
      });
  }

  function renderProducts(products) {
    const tbody = document.getElementById("gezin-table-body");
    tbody.innerHTML = "";

    if (!products.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Geen gezinnen gevonden.</td></tr>`;
        return;
    }

    // Fetch all pakketten once
    fetch("php/voedselpakketten-api.php?action=list")
      .then(res => res.json())
      .then(pakketten => {
        // Split gezinnen into two groups
        const zonderOpenPakket = [];
        const metOpenPakket = [];

        products.forEach(p => {
            const gezinPakketten = pakketten.filter(pk => pk.klanten_id == p.id);
            const openPakket = gezinPakketten.some(pk => !pk.datum_uitgifte);

            if (!openPakket) {
                zonderOpenPakket.push({ ...p, gezinPakketten });
            } else {
                metOpenPakket.push({ ...p, gezinPakketten });
            }
        });

        // First render those without open pakket
        [...zonderOpenPakket, ...metOpenPakket].forEach(p => {
            const gezinPakketten = p.gezinPakketten;
            const openPakket = gezinPakketten.some(pk => !pk.datum_uitgifte);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="px-6 py-4">${p.naam}</td>
                <td class="px-6 py-4">${p.postcode || ""}</td>
                <td class="px-6 py-4">${p.gezinsleden ? p.gezinsleden.length : 0} leden</td>
                <td class="px-6 py-4">
                    ${
                        !openPakket
                        ? `<button onclick="window.location.href='voedselpakket-maken.php?gezin_id=${p.id}&gezin_naam=${encodeURIComponent(p.naam)}'" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Maak pakket</button>`
                        : `<span class="text-gray-500">Pakket al aangemaakt</span>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
      });
}

  // Filters
  document.getElementById("sort-by")?.addEventListener("change", loadGezinnen);
  document.getElementById("search-gezinnen")?.addEventListener("input", loadGezinnen);

  // Initial load
  loadGezinnen();

  
});
